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
  zone: string
}

interface EnergyData {
  energyConsumption2023: { [key: string]: number }
  electricityProduction2023: { [key: string]: number }
  energyImportsExports: Array<{ year: number; value: number }>
  energyConsumptionTimeSeries: Array<{ year: number; [key: string]: number }>
}

const energyColors: { [key: string]: string } = {
  // Energy sources
  oil: "#8B4513",
  gas: "#FF6347",
  coal: "#2F4F4F",
  nuclear: "#FFD700",
  hydro: "#4169E1",
  wind: "#87CEEB",
  solar: "#FFA500",
  biofuels: "#228B22",
  "other renewables": "#32CD32",
  // Electricity sources
  "fossil fuels": "#8B4513",
  "natural gas": "#FF6347",
  hydropower: "#4169E1",
  "wind power": "#87CEEB",
  "solar power": "#FFA500",
  "nuclear power": "#FFD700",
  biomass: "#228B22",
  geothermal: "#DC143C",
  "other sources": "#808080",
}

const countryOptions: CountryOption[] = [
  { name: "Great Britain", flag: "🇬🇧", zone: "GB" },
  { name: "Germany", flag: "🇩🇪", zone: "DE" },
  { name: "France", flag: "🇫🇷", zone: "FR" },
  { name: "Spain", flag: "🇪🇸", zone: "ES" },
  { name: "Italy", flag: "🇮🇹", zone: "IT" },
  { name: "Netherlands", flag: "🇳🇱", zone: "NL" },
  { name: "Norway", flag: "🇳🇴", zone: "NO" },
  { name: "Sweden", flag: "🇸🇪", zone: "SE" },
]

// Mock data - replace with API calls later
const mockEnergyData: { [key: string]: EnergyData } = {
  GB: {
    energyConsumption2023: {
      oil: 1200,
      gas: 1800,
      coal: 200,
      nuclear: 400,
      hydro: 50,
      wind: 300,
      solar: 80,
      biofuels: 120,
      "other renewables": 90,
    },
    electricityProduction2023: {
      "natural gas": 150,
      "nuclear power": 180,
      "wind power": 120,
      "solar power": 40,
      hydropower: 20,
      coal: 15,
      biomass: 35,
      "other sources": 10,
    },
    energyImportsExports: [
      { year: 1960, value: -15 },
      { year: 1970, value: -25 },
      { year: 1980, value: -30 },
      { year: 1990, value: -20 },
      { year: 2000, value: 10 },
      { year: 2010, value: 25 },
      { year: 2015, value: 35 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 800,
        gas: 200,
        coal: 1200,
        nuclear: 0,
        hydro: 30,
        wind: 0,
        solar: 0,
        biofuels: 10,
        "other renewables": 20,
      },
      {
        year: 1980,
        oil: 1000,
        gas: 800,
        coal: 1000,
        nuclear: 100,
        hydro: 40,
        wind: 0,
        solar: 0,
        biofuels: 20,
        "other renewables": 30,
      },
      {
        year: 2000,
        oil: 1100,
        gas: 1400,
        coal: 600,
        nuclear: 300,
        hydro: 45,
        wind: 20,
        solar: 5,
        biofuels: 60,
        "other renewables": 50,
      },
      {
        year: 2023,
        oil: 1200,
        gas: 1800,
        coal: 200,
        nuclear: 400,
        hydro: 50,
        wind: 300,
        solar: 80,
        biofuels: 120,
        "other renewables": 90,
      },
    ],
  },
  DE: {
    energyConsumption2023: {
      oil: 2200,
      gas: 2400,
      coal: 1800,
      nuclear: 300,
      hydro: 120,
      wind: 600,
      solar: 250,
      biofuels: 180,
      "other renewables": 150,
    },
    electricityProduction2023: {
      "natural gas": 280,
      coal: 220,
      "nuclear power": 150,
      "wind power": 320,
      "solar power": 180,
      hydropower: 80,
      biomass: 120,
      "other sources": 20,
    },
    energyImportsExports: [
      { year: 1960, value: 20 },
      { year: 1970, value: 35 },
      { year: 1980, value: 45 },
      { year: 1990, value: 40 },
      { year: 2000, value: 55 },
      { year: 2010, value: 60 },
      { year: 2015, value: 65 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 1200,
        gas: 400,
        coal: 2800,
        nuclear: 0,
        hydro: 60,
        wind: 0,
        solar: 0,
        biofuels: 20,
        "other renewables": 40,
      },
      {
        year: 1980,
        oil: 1800,
        gas: 1200,
        coal: 2600,
        nuclear: 200,
        hydro: 80,
        wind: 0,
        solar: 0,
        biofuels: 40,
        "other renewables": 60,
      },
      {
        year: 2000,
        oil: 2000,
        gas: 2000,
        coal: 2200,
        nuclear: 400,
        hydro: 100,
        wind: 50,
        solar: 10,
        biofuels: 100,
        "other renewables": 100,
      },
      {
        year: 2023,
        oil: 2200,
        gas: 2400,
        coal: 1800,
        nuclear: 300,
        hydro: 120,
        wind: 600,
        solar: 250,
        biofuels: 180,
        "other renewables": 150,
      },
    ],
  },
  FR: {
    energyConsumption2023: {
      oil: 1400,
      gas: 800,
      coal: 150,
      nuclear: 2200,
      hydro: 280,
      wind: 180,
      solar: 90,
      biofuels: 140,
      "other renewables": 110,
    },
    electricityProduction2023: {
      "nuclear power": 380,
      hydropower: 120,
      "natural gas": 80,
      "wind power": 90,
      "solar power": 50,
      coal: 20,
      biomass: 40,
      "other sources": 15,
    },
    energyImportsExports: [
      { year: 1960, value: 45 },
      { year: 1970, value: 55 },
      { year: 1980, value: 60 },
      { year: 1990, value: 40 },
      { year: 2000, value: 25 },
      { year: 2010, value: 15 },
      { year: 2015, value: 10 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 800,
        gas: 200,
        coal: 600,
        nuclear: 0,
        hydro: 150,
        wind: 0,
        solar: 0,
        biofuels: 30,
        "other renewables": 50,
      },
      {
        year: 1980,
        oil: 1200,
        gas: 600,
        coal: 400,
        nuclear: 800,
        hydro: 200,
        wind: 0,
        solar: 0,
        biofuels: 60,
        "other renewables": 80,
      },
      {
        year: 2000,
        oil: 1300,
        gas: 700,
        coal: 200,
        nuclear: 2000,
        hydro: 250,
        wind: 20,
        solar: 5,
        biofuels: 100,
        "other renewables": 90,
      },
      {
        year: 2023,
        oil: 1400,
        gas: 800,
        coal: 150,
        nuclear: 2200,
        hydro: 280,
        wind: 180,
        solar: 90,
        biofuels: 140,
        "other renewables": 110,
      },
    ],
  },
  ES: {
    energyConsumption2023: {
      oil: 1100,
      gas: 600,
      coal: 300,
      nuclear: 350,
      hydro: 180,
      wind: 280,
      solar: 150,
      biofuels: 90,
      "other renewables": 80,
    },
    electricityProduction2023: {
      "natural gas": 120,
      "nuclear power": 140,
      "wind power": 180,
      "solar power": 90,
      hydropower: 80,
      coal: 40,
      biomass: 30,
      "other sources": 12,
    },
    energyImportsExports: [
      { year: 1960, value: 25 },
      { year: 1970, value: 40 },
      { year: 1980, value: 55 },
      { year: 1990, value: 60 },
      { year: 2000, value: 65 },
      { year: 2010, value: 70 },
      { year: 2015, value: 72 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 400,
        gas: 100,
        coal: 800,
        nuclear: 0,
        hydro: 80,
        wind: 0,
        solar: 0,
        biofuels: 20,
        "other renewables": 30,
      },
      {
        year: 1980,
        oil: 800,
        gas: 300,
        coal: 600,
        nuclear: 50,
        hydro: 120,
        wind: 0,
        solar: 0,
        biofuels: 40,
        "other renewables": 50,
      },
      {
        year: 2000,
        oil: 1000,
        gas: 500,
        coal: 400,
        nuclear: 300,
        hydro: 150,
        wind: 50,
        solar: 10,
        biofuels: 70,
        "other renewables": 60,
      },
      {
        year: 2023,
        oil: 1100,
        gas: 600,
        coal: 300,
        nuclear: 350,
        hydro: 180,
        wind: 280,
        solar: 150,
        biofuels: 90,
        "other renewables": 80,
      },
    ],
  },
  IT: {
    energyConsumption2023: {
      oil: 1300,
      gas: 1200,
      coal: 200,
      nuclear: 0,
      hydro: 220,
      wind: 120,
      solar: 140,
      biofuels: 100,
      "other renewables": 90,
    },
    electricityProduction2023: {
      "natural gas": 200,
      hydropower: 110,
      "solar power": 80,
      "wind power": 70,
      coal: 30,
      biomass: 50,
      "other sources": 15,
    },
    energyImportsExports: [
      { year: 1960, value: 40 },
      { year: 1970, value: 55 },
      { year: 1980, value: 70 },
      { year: 1990, value: 75 },
      { year: 2000, value: 80 },
      { year: 2010, value: 82 },
      { year: 2015, value: 85 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 600,
        gas: 200,
        coal: 400,
        nuclear: 0,
        hydro: 100,
        wind: 0,
        solar: 0,
        biofuels: 30,
        "other renewables": 40,
      },
      {
        year: 1980,
        oil: 1000,
        gas: 600,
        coal: 300,
        nuclear: 20,
        hydro: 150,
        wind: 0,
        solar: 0,
        biofuels: 50,
        "other renewables": 60,
      },
      {
        year: 2000,
        oil: 1200,
        gas: 1000,
        coal: 250,
        nuclear: 0,
        hydro: 180,
        wind: 30,
        solar: 20,
        biofuels: 80,
        "other renewables": 70,
      },
      {
        year: 2023,
        oil: 1300,
        gas: 1200,
        coal: 200,
        nuclear: 0,
        hydro: 220,
        wind: 120,
        solar: 140,
        biofuels: 100,
        "other renewables": 90,
      },
    ],
  },
  NL: {
    energyConsumption2023: {
      oil: 600,
      gas: 800,
      coal: 300,
      nuclear: 20,
      hydro: 5,
      wind: 80,
      solar: 60,
      biofuels: 40,
      "other renewables": 30,
    },
    electricityProduction2023: {
      "natural gas": 120,
      coal: 40,
      "nuclear power": 15,
      "wind power": 50,
      "solar power": 35,
      biomass: 25,
      "other sources": 8,
    },
    energyImportsExports: [
      { year: 1960, value: -20 },
      { year: 1970, value: -35 },
      { year: 1980, value: -40 },
      { year: 1990, value: -30 },
      { year: 2000, value: -15 },
      { year: 2010, value: 10 },
      { year: 2015, value: 25 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 400,
        gas: 200,
        coal: 400,
        nuclear: 0,
        hydro: 2,
        wind: 0,
        solar: 0,
        biofuels: 10,
        "other renewables": 15,
      },
      {
        year: 1980,
        oil: 500,
        gas: 500,
        coal: 350,
        nuclear: 10,
        hydro: 3,
        wind: 0,
        solar: 0,
        biofuels: 20,
        "other renewables": 20,
      },
      {
        year: 2000,
        oil: 550,
        gas: 700,
        coal: 320,
        nuclear: 18,
        hydro: 4,
        wind: 10,
        solar: 2,
        biofuels: 30,
        "other renewables": 25,
      },
      {
        year: 2023,
        oil: 600,
        gas: 800,
        coal: 300,
        nuclear: 20,
        hydro: 5,
        wind: 80,
        solar: 60,
        biofuels: 40,
        "other renewables": 30,
      },
    ],
  },
  NO: {
    energyConsumption2023: {
      oil: 400,
      gas: 50,
      coal: 20,
      nuclear: 0,
      hydro: 800,
      wind: 60,
      solar: 5,
      biofuels: 30,
      "other renewables": 25,
    },
    electricityProduction2023: {
      hydropower: 160,
      "wind power": 25,
      "natural gas": 5,
      "other sources": 3,
    },
    energyImportsExports: [
      { year: 1960, value: -80 },
      { year: 1970, value: -120 },
      { year: 1980, value: -150 },
      { year: 1990, value: -180 },
      { year: 2000, value: -200 },
      { year: 2010, value: -220 },
      { year: 2015, value: -250 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 200,
        gas: 10,
        coal: 50,
        nuclear: 0,
        hydro: 400,
        wind: 0,
        solar: 0,
        biofuels: 15,
        "other renewables": 10,
      },
      {
        year: 1980,
        oil: 300,
        gas: 20,
        coal: 30,
        nuclear: 0,
        hydro: 600,
        wind: 0,
        solar: 0,
        biofuels: 20,
        "other renewables": 15,
      },
      {
        year: 2000,
        oil: 350,
        gas: 40,
        coal: 25,
        nuclear: 0,
        hydro: 700,
        wind: 5,
        solar: 1,
        biofuels: 25,
        "other renewables": 20,
      },
      {
        year: 2023,
        oil: 400,
        gas: 50,
        coal: 20,
        nuclear: 0,
        hydro: 800,
        wind: 60,
        solar: 5,
        biofuels: 30,
        "other renewables": 25,
      },
    ],
  },
  SE: {
    energyConsumption2023: {
      oil: 500,
      gas: 30,
      coal: 50,
      nuclear: 600,
      hydro: 400,
      wind: 120,
      solar: 10,
      biofuels: 180,
      "other renewables": 60,
    },
    electricityProduction2023: {
      "nuclear power": 120,
      hydropower: 140,
      "wind power": 80,
      biomass: 40,
      "other sources": 8,
    },
    energyImportsExports: [
      { year: 1960, value: 15 },
      { year: 1970, value: 10 },
      { year: 1980, value: -5 },
      { year: 1990, value: -15 },
      { year: 2000, value: -25 },
      { year: 2010, value: -30 },
      { year: 2015, value: -35 },
    ],
    energyConsumptionTimeSeries: [
      {
        year: 1965,
        oil: 300,
        gas: 5,
        coal: 200,
        nuclear: 0,
        hydro: 200,
        wind: 0,
        solar: 0,
        biofuels: 80,
        "other renewables": 30,
      },
      {
        year: 1980,
        oil: 400,
        gas: 15,
        coal: 100,
        nuclear: 200,
        hydro: 300,
        wind: 0,
        solar: 0,
        biofuels: 120,
        "other renewables": 40,
      },
      {
        year: 2000,
        oil: 450,
        gas: 25,
        coal: 75,
        nuclear: 500,
        hydro: 350,
        wind: 20,
        solar: 2,
        biofuels: 150,
        "other renewables": 50,
      },
      {
        year: 2023,
        oil: 500,
        gas: 30,
        coal: 50,
        nuclear: 600,
        hydro: 400,
        wind: 120,
        solar: 10,
        biofuels: 180,
        "other renewables": 60,
      },
    ],
  },
}

export default function GameScreen({ onGameComplete, onBackToWelcome }: GameScreenProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [currentCountryOptions, setCurrentCountryOptions] = useState<CountryOption[]>([])
  const [correctCountry, setCorrectCountry] = useState<CountryOption | null>(null)
  const [currentEnergyData, setCurrentEnergyData] = useState<EnergyData | null>(null)
  const [visibleCharts, setVisibleCharts] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [openAccordion, setOpenAccordion] = useState<string>("consumption")

  useEffect(() => {
    startNewRound()
  }, [])

  const startNewRound = () => {
    // Select 4 random countries for this round
    const shuffled = [...countryOptions].sort(() => Math.random() - 0.5)
    const roundOptions = shuffled.slice(0, 4)

    // Pick one as the correct answer
    const correct = roundOptions[Math.floor(Math.random() * 4)]

    setCurrentCountryOptions(roundOptions)
    setCorrectCountry(correct)
    setCurrentEnergyData(mockEnergyData[correct.zone] || mockEnergyData.GB)
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

    const isCorrect = selectedCountry === correctCountry.zone
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

  const createBarChartData = (data: { [key: string]: number }) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value,
      fill: energyColors[name] || "#666",
    }))
  }

  const progress = ((currentRound + 1) / 5) * 100

  if (!currentEnergyData || !correctCountry) {
    return <div>Loading...</div>
  }

  const consumptionData = createBarChartData(currentEnergyData.energyConsumption2023)
  const productionData = createBarChartData(currentEnergyData.electricityProduction2023)
  const importsExportsData = currentEnergyData.energyImportsExports
  const timeSeriesData = currentEnergyData.energyConsumptionTimeSeries

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <Button variant="ghost" onClick={onBackToWelcome} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">EnergyGuessr</h1>
              <p className="text-muted-foreground">Round {currentRound + 1} of 5</p>
            </div>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Top row: Back button and Logo */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBackToWelcome} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
            
            {/* Bottom row: Round indicator and Progress bar */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">
                Round {currentRound + 1} of 5
              </div>
              <div className="flex-1 ml-4">
                <Progress value={progress} className="h-2" />
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
                      key={country.zone}
                      onClick={() => setSelectedCountry(country.zone)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        selectedCountry === country.zone
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
                      Energy consumption by source for 2023
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            Measured in terms of primary energy using the substitution method. Data source: Energy
                            Institute - Statistical Review of World Energy (2024). Note: &quot;Other renewables&quot; include
                            geothermal, biomass, and waste energy. OurWorldinData.org/energy | CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={consumptionData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
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

                {/* Electricity Production 2023 */}
                <AccordionItem value="production">
                  <AccordionTrigger
                    className={`${visibleCharts >= 2 ? "" : "opacity-50 pointer-events-none"}`}
                    disabled={visibleCharts < 2}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Electricity production by source for 2023
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            Measured in terawatt-hours. Data source: Ember (2025); Energy Institute - Statistical Review
                            of World Energy (2024). Note: &quot;Other renewables&quot; include geothermal, wave, and tidal.
                            OurWorldinData.org/energy | CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
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
                      Energy imports & exports
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            Energy trade, measured as the percentage of energy use. Positive values indicate a country
                            or region is a net importer of energy. Negative numbers indicate a country or region is a
                            net exporter. Data source: IEA and OECD, via World Bank (2025). OurWorldinData.org/energy |
                            CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={importsExportsData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                          <XAxis dataKey="year" />
                          <YAxis label={{ value: "% of energy use", angle: -90, position: "insideLeft" }} />
                          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
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
                          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Energy Consumption Time Series */}
                <AccordionItem value="timeseries">
                  <AccordionTrigger
                    className={`${visibleCharts >= 4 ? "" : "opacity-50 pointer-events-none"}`}
                    disabled={visibleCharts < 4}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Energy consumption by source over time
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs">
                            Measured in terms of primary energy using the substitution method. Data source: Energy
                            Institute - Statistical Review of World Energy (2024). Note: &quot;Other renewables&quot; include
                            geothermal, biomass, and waste energy. OurWorldinData.org/energy | CC BY
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                          <XAxis dataKey="year" />
                          <YAxis label={{ value: "TWh", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="oil"
                            stackId="1"
                            stroke={energyColors.oil}
                            fill={energyColors.oil}
                          />
                          <Area
                            type="monotone"
                            dataKey="gas"
                            stackId="1"
                            stroke={energyColors.gas}
                            fill={energyColors.gas}
                          />
                          <Area
                            type="monotone"
                            dataKey="coal"
                            stackId="1"
                            stroke={energyColors.coal}
                            fill={energyColors.coal}
                          />
                          <Area
                            type="monotone"
                            dataKey="nuclear"
                            stackId="1"
                            stroke={energyColors.nuclear}
                            fill={energyColors.nuclear}
                          />
                          <Area
                            type="monotone"
                            dataKey="hydro"
                            stackId="1"
                            stroke={energyColors.hydro}
                            fill={energyColors.hydro}
                          />
                          <Area
                            type="monotone"
                            dataKey="wind"
                            stackId="1"
                            stroke={energyColors.wind}
                            fill={energyColors.wind}
                          />
                          <Area
                            type="monotone"
                            dataKey="solar"
                            stackId="1"
                            stroke={energyColors.solar}
                            fill={energyColors.solar}
                          />
                          <Area
                            type="monotone"
                            dataKey="biofuels"
                            stackId="1"
                            stroke={energyColors.biofuels}
                            fill={energyColors.biofuels}
                          />
                          <Area
                            type="monotone"
                            dataKey="other renewables"
                            stackId="1"
                            stroke={energyColors["other renewables"]}
                            fill={energyColors["other renewables"]}
                          />
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
