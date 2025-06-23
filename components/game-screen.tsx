"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, BarChart3, Zap, TrendingUp, Clock, Eye, CheckCircle, Info } from "lucide-react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Line,
  LineChart,
  Area,
  AreaChart,
  Legend,
  ReferenceLine,
} from "recharts"
import { ChartTooltip } from "@/components/ui/chart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getEnergyData, CombinedEnergyData, EnergyConsumptionData, ElectricityProductionData, SUPPORTED_COUNTRIES, COUNTRY_NAMES } from "@/lib/energy-data"

interface GameScreenProps {
  onGameComplete: (results: GameResult[]) => void
  onBackToWelcome: () => void
}

interface GameResult {
  country: string
  flag: string
  isCorrect: boolean
  points: number
  chartsViewed: number
}

interface CountryOption {
  name: string
  flag: string
  code: string
}

// Country flags mapping
const COUNTRY_FLAGS: { [key: string]: string } = {
  'USA': '🇺🇸', 'CHN': '🇨🇳', 'JPN': '🇯🇵', 'DEU': '🇩🇪', 'RUS': '🇷🇺', 'IND': '🇮🇳', 'CAN': '🇨🇦', 'FRA': '🇫🇷', 'ITA': '🇮🇹', 'GBR': '🇬🇧',
  'SAU': '🇸🇦', 'BRA': '🇧🇷', 'MEX': '🇲🇽', 'KOR': '🇰🇷', 'ESP': '🇪🇸', 'IRN': '🇮🇷', 'IDN': '🇮🇩', 'NLD': '🇳🇱', 'AUS': '🇦🇺', 'SGP': '🇸🇬',
  'TWN': '🇹🇼', 'THA': '🇹🇭', 'BEL': '🇧🇪', 'TUR': '🇹🇷', 'ARG': '🇦🇷', 'EGY': '🇪🇬', 'VEN': '🇻🇪', 'SWE': '🇸🇪', 'POL': '🇵🇱', 'ARE': '🇦🇪',
  'MYS': '🇲🇾', 'ZAF': '🇿🇦', 'IRQ': '🇮🇶', 'UKR': '🇺🇦', 'GRC': '🇬🇷', 'PHL': '🇵🇭', 'PAK': '🇵🇰', 'ROU': '🇷🇴', 'CHE': '🇨🇭', 'AUT': '🇦🇹',
  'COL': '🇨🇴', 'DNK': '🇩🇰', 'PRT': '🇵🇹', 'KWT': '🇰🇼', 'FIN': '🇫🇮', 'CHL': '🇨🇱', 'HKG': '🇭🇰', 'DZA': '🇩🇿', 'VNM': '🇻🇳', 'ISR': '🇮🇱',
  'CZE': '🇨🇿', 'NOR': '🇳🇴', 'KAZ': '🇰🇿', 'BLR': '🇧🇾', 'HUN': '🇭🇺', 'BGR': '🇧🇬', 'PER': '🇵🇪', 'MAR': '🇲🇦', 'ECU': '🇪🇨', 'IRL': '🇮🇪',
  'NZL': '🇳🇿', 'SVK': '🇸🇰', 'UZB': '🇺🇿', 'QAT': '🇶🇦', 'AZE': '🇦🇿', 'OMN': '🇴🇲', 'BGD': '🇧🇩', 'TKM': '🇹🇲', 'LKA': '🇱🇰', 'LTU': '🇱🇹',
  'HRV': '🇭🇷', 'LUX': '🇱🇺', 'TTO': '🇹🇹', 'CYP': '🇨🇾', 'LVA': '🇱🇻', 'SVN': '🇸🇮', 'EST': '🇪🇪', 'ISL': '🇮🇸', 'MKD': '🇲🇰'
}

const energyColors: { [key: string]: string } = {
  // Energy consumption colors
  oil: "#8B4513",
  coal: "#2F4F4F",
  gas: "#FF6347",
  nuclear: "#FFD700",
  hydro: "#4169E1",
  wind: "#87CEEB",
  solar: "#FFA500",
  biofuels: "#228B22",
  other_renewables: "#32CD32",
  // Electricity production colors (matching where possible)
  bioenergy: "#228B22", // Same as biofuels
  other: "#32CD32", // Same as other_renewables
}

// Create country options from supported countries
const countryOptions: CountryOption[] = SUPPORTED_COUNTRIES.map(code => ({
  name: COUNTRY_NAMES[code] || code,
  flag: COUNTRY_FLAGS[code] || '🏳️',
  code: code
}))

export default function GameScreen({ onGameComplete, onBackToWelcome }: GameScreenProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [currentCountryOptions, setCurrentCountryOptions] = useState<CountryOption[]>([])
  const [correctCountry, setCorrectCountry] = useState<CountryOption | null>(null)
  const [currentEnergyData, setCurrentEnergyData] = useState<CombinedEnergyData | null>(null)
  const [visibleCharts, setVisibleCharts] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [openAccordion, setOpenAccordion] = useState<string>("consumption")
  const [isLoading, setIsLoading] = useState(true)
  const [energyData, setEnergyData] = useState<{ [countryCode: string]: CombinedEnergyData } | null>(null)

  useEffect(() => {
    // Load energy data on component mount
    const loadEnergyData = async () => {
      try {
        setIsLoading(true)
        const data = await getEnergyData()
        setEnergyData(data)
      } catch (error) {
        console.error('Failed to load energy data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEnergyData()
  }, [])

  useEffect(() => {
    if (!isLoading && energyData) {
      startNewRound()
    }
  }, [isLoading, energyData])

  const startNewRound = () => {
    if (!energyData) return

    // Get available countries (those with data)
    const availableCountries = countryOptions.filter(country => energyData[country.code])
    
    // Select 4 random countries for this round
    const shuffled = [...availableCountries].sort(() => Math.random() - 0.5)
    const roundOptions = shuffled.slice(0, 4)

    // Pick one as the correct answer
    const correct = roundOptions[Math.floor(Math.random() * 4)]

    setCurrentCountryOptions(roundOptions)
    setCorrectCountry(correct)
    setCurrentEnergyData(energyData[correct.code])
    setVisibleCharts(1)
    setSelectedCountry(null)
    setOpenAccordion("consumption")
  }

  const handleRevealNext = () => {
    if (visibleCharts < 4) {
      setVisibleCharts(visibleCharts + 1)
      const accordionOrder = ["consumption", "production", "imports", "timeseries"]
      setOpenAccordion(accordionOrder[visibleCharts])
      
      // Auto-scroll to the newly revealed chart on mobile
      setTimeout(() => {
        const chartElements = document.querySelectorAll('[data-slot="accordion-item"]')
        if (chartElements.length >= visibleCharts) {
          const targetChart = chartElements[visibleCharts - 1] as HTMLElement
          if (targetChart) {
            targetChart.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }
      }, 300) // Longer delay to ensure accordion animation completes
    }
  }

  const handleGuess = () => {
    if (!selectedCountry || !correctCountry) return

    const isCorrect = selectedCountry === correctCountry.code
    const pointsArray = [100, 75, 50, 25]
    const points = isCorrect ? pointsArray[visibleCharts - 1] || 0 : 0

    const roundResult: GameResult = {
      country: correctCountry.name,
      flag: correctCountry.flag,
      isCorrect,
      points,
      chartsViewed: visibleCharts,
    }

    const newResults = [...gameResults, roundResult]
    setGameResults(newResults)

    if (currentRound < 4) {
      setCurrentRound(currentRound + 1)
      setTimeout(startNewRound, 1000)
    } else {
      onGameComplete(newResults)
    }
  }

  const createConsumptionChartData = (data: EnergyConsumptionData) => {
    return [
      { name: 'Oil', value: data.oil, fill: energyColors.oil },
      { name: 'Coal', value: data.coal, fill: energyColors.coal },
      { name: 'Gas', value: data.gas, fill: energyColors.gas },
      { name: 'Nuclear', value: data.nuclear, fill: energyColors.nuclear },
      { name: 'Hydro', value: data.hydro, fill: energyColors.hydro },
      { name: 'Wind', value: data.wind, fill: energyColors.wind },
      { name: 'Solar', value: data.solar, fill: energyColors.solar },
      { name: 'Biofuels', value: data.biofuels, fill: energyColors.biofuels },
      { name: 'Other', value: data.other_renewables, fill: energyColors.other_renewables }
    ]
  }

  const createProductionChartData = (data: ElectricityProductionData) => {
    return [
      { name: 'Coal', value: data.coal, fill: energyColors.coal },
      { name: 'Gas', value: data.gas, fill: energyColors.gas },
      { name: 'Oil', value: data.oil, fill: energyColors.oil },
      { name: 'Nuclear', value: data.nuclear, fill: energyColors.nuclear },
      { name: 'Hydro', value: data.hydro, fill: energyColors.hydro },
      { name: 'Wind', value: data.wind, fill: energyColors.wind },
      { name: 'Solar', value: data.solar, fill: energyColors.solar },
      { name: 'Bioenergy', value: data.bioenergy, fill: energyColors.bioenergy },
      { name: 'Other', value: data.other, fill: energyColors.other }
    ]
  }

  const progress = ((currentRound + 1) / 5) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Energy Data</h2>
          <p className="text-gray-500">Fetching real energy statistics from Our World in Data...</p>
        </div>
      </div>
    )
  }

  if (!currentEnergyData || !correctCountry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Game Loading</h2>
          <p className="text-gray-500">Preparing your energy challenge...</p>
        </div>
      </div>
    )
  }

  const consumptionData = createConsumptionChartData(currentEnergyData.consumption)
  const productionData = createProductionChartData(currentEnergyData.production)
  const importsExportsData: Array<{ year: number; value: number }> = []
  const timeSeriesData: Array<{ year: number; [key: string]: number }> = []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <Button variant="ghost" onClick={onBackToWelcome} className="flex items-center gap-2 z-10">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center gap-1">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
                <Zap className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Round {currentRound + 1} of 5</p>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4 px-4">
            {/* Top row: Back button and Logo */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBackToWelcome} className="p-3">
                <ArrowLeft className="h-10 w-10" />
              </Button>
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
                  <Zap className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="w-14"></div> {/* Spacer for centering */}
            </div>
            
            {/* Bottom row: Round indicator and Progress bar */}
            <div className="flex items-center justify-between">
              <div className="text-base font-medium text-foreground">
                Round {currentRound + 1} of 5
              </div>
              <div className="flex-1 ml-6">
                <Progress value={progress} className="h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Game Headline */}
        <Card className="mb-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🌍 Which country does this energy data represent?</CardTitle>
            <p className="text-muted-foreground">
              Analyse the energy visualisations below and select the correct country from the options
            </p>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 lg:gap-8 pb-24 md:pb-0">
          {/* Left Side - Country Options */}
          <div className="space-y-6 lg:space-y-6 space-y-4">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Select a Country</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose which country you think matches the energy data shown
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {currentCountryOptions.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => setSelectedCountry(country.code)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        selectedCountry === country.code
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                      }`}
                    >
                      <div className="text-3xl mb-2">{country.flag}</div>
                      <div className="font-semibold text-sm">{country.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Desktop Action Buttons */}
            <div className="hidden md:block space-y-3">
              {visibleCharts < 4 && (
                <Button onClick={handleRevealNext} variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Reveal Next Chart ({[100, 75, 50, 25][visibleCharts]} points if correct)
                </Button>
              )}
              <Button
                onClick={handleGuess}
                disabled={!selectedCountry}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Make Guess ({[100, 75, 50, 25][visibleCharts - 1]} points if correct)
              </Button>
            </div>
          </div>

          {/* Right Side - Energy Data Visualizations */}
          <div className="space-y-4 lg:space-y-4 space-y-2">
            <TooltipProvider>
              <Accordion type="single" value={openAccordion} onValueChange={setOpenAccordion}>
                {/* Energy Consumption 2023 */}
                <AccordionItem value="consumption">
                  <AccordionTrigger
                    className={`${visibleCharts >= 1 ? "" : "opacity-50 pointer-events-none"}`}
                    disabled={visibleCharts < 1}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      What fuels this country?
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            This shows the breakdown of primary energy consumption by source for 2023. Data source: Energy
                            Institute - Statistical Review of World Energy (2024). Note: 2023 data is used due to availability.
                            OurWorldinData.org/energy | CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={consumptionData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                          <YAxis type="number" label={{ value: "TWh", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                return (
                                  <div className="bg-white p-2 border rounded shadow">
                                    <p className="font-semibold">{`${payload[0].payload.name}: ${payload[0].value} TWh`}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {consumptionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Electricity Production 2024 */}
                <AccordionItem value="production">
                  <AccordionTrigger
                    className={`${visibleCharts >= 2 ? "" : "opacity-50 pointer-events-none"}`}
                    disabled={visibleCharts < 2}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      How does this country generate electricity (including what it exports)?
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            This shows electricity generation by source for 2024. Data source: Ember (2025); Energy Institute - Statistical Review
                            of World Energy (2024). Note: 2024 data is used due to availability. OurWorldinData.org/energy | CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                          <YAxis type="number" label={{ value: "TWh", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                return (
                                  <div className="bg-white p-2 border rounded shadow">
                                    <p className="font-semibold">{`${payload[0].payload.name}: ${payload[0].value} TWh`}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {productionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Energy Imports & Exports */}
                <AccordionItem value="imports">
                  <AccordionTrigger
                    className={`${visibleCharts >= 3 ? "" : "opacity-50 pointer-events-none"}`}
                    disabled={visibleCharts < 3}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Is this country an energy importer or exporter?
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            This shows energy imports and exports over time. Positive values indicate net exports, negative values indicate net imports.
                            Data source: International Energy Agency (IEA) and OECD. OurWorldinData.org/energy | CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={importsExportsData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                          <XAxis dataKey="year" />
                          <YAxis label={{ value: "Net Exports (% of energy use)", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                return (
                                  <div className="bg-white p-2 border rounded shadow">
                                    <p className="font-semibold">{`${payload[0].payload.year}: ${payload[0].value}%`}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }} />
                          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Energy Mix Over Time */}
                <AccordionItem value="timeseries">
                  <AccordionTrigger
                    className={`${visibleCharts >= 4 ? "" : "opacity-50 pointer-events-none"}`}
                    disabled={visibleCharts < 4}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      How has this country's energy mix evolved over time?
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            This shows the evolution of energy consumption by source over time. Data source: Energy Institute - Statistical Review
                            of World Energy (2024). OurWorldinData.org/energy | CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                          <XAxis dataKey="year" />
                          <YAxis label={{ value: "TWh", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-2 border rounded shadow">
                                    <p className="font-semibold">{`Year: ${payload[0].payload.year}`}</p>
                                    {payload.map((entry, index) => (
                                      <p key={index} style={{ color: entry.color }}>
                                        {`${entry.name}: ${entry.value} TWh`}
                                      </p>
                                    ))}
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Area type="monotone" dataKey="oil" stackId="1" stroke="#8B4513" fill="#8B4513" />
                          <Area type="monotone" dataKey="gas" stackId="1" stroke="#FF6347" fill="#FF6347" />
                          <Area type="monotone" dataKey="coal" stackId="1" stroke="#2F4F4F" fill="#2F4F4F" />
                          <Area type="monotone" dataKey="nuclear" stackId="1" stroke="#FFD700" fill="#FFD700" />
                          <Area type="monotone" dataKey="hydro" stackId="1" stroke="#4169E1" fill="#4169E1" />
                          <Area type="monotone" dataKey="wind" stackId="1" stroke="#87CEEB" fill="#87CEEB" />
                          <Area type="monotone" dataKey="solar" stackId="1" stroke="#FFA500" fill="#FFA500" />
                          <Area type="monotone" dataKey="biofuels" stackId="1" stroke="#228B22" fill="#228B22" />
                          <Area type="monotone" dataKey="other_renewables" stackId="1" stroke="#32CD32" fill="#32CD32" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TooltipProvider>
          </div>
        </div>

        {/* Mobile Sticky Action Buttons */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-sm border-t border-gray-200 p-4 z-50">
          <div className="space-y-3">
            {visibleCharts < 4 && (
              <Button onClick={handleRevealNext} variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Reveal Next Chart ({[100, 75, 50, 25][visibleCharts]} points if correct)
              </Button>
            )}
            <Button
              onClick={handleGuess}
              disabled={!selectedCountry}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Make Guess ({[100, 75, 50, 25][visibleCharts - 1]} points if correct)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
