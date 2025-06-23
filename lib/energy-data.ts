// Energy data service for fetching real data from Our World in Data
export interface EnergyConsumptionData {
  country: string
  code: string
  year: number
  oil: number
  coal: number
  gas: number
  nuclear: number
  hydro: number
  wind: number
  solar: number
  biofuels: number
  other_renewables: number
}

export interface ElectricityProductionData {
  country: string
  code: string
  year: number
  coal: number
  gas: number
  oil: number
  nuclear: number
  hydro: number
  wind: number
  solar: number
  bioenergy: number
  other: number
}

export interface EnergyTradeData {
  country: string
  code: string
  year: number
  importPercentage: number
}

export interface EnergyTimeSeriesData {
  country: string
  code: string
  year: number
  oil: number
  coal: number
  gas: number
  nuclear: number
  hydro: number
  wind: number
  solar: number
  biofuels: number
  other_renewables: number
}

export interface CombinedEnergyData {
  consumption: EnergyConsumptionData
  production: ElectricityProductionData
  trade: EnergyTradeData[]
  timeSeries: EnergyTimeSeriesData[]
}

// List of countries supported in the game
export const SUPPORTED_COUNTRIES = [
  'USA', 'CHN', 'IND', 'RUS', 'DEU', 'FRA', 'JPN', 'BRA', 'CAN', 'SAU', 'NOR', 'GBR', 'AUS', 'ZAF', 'MEX', 'ARE', 'QAT', 'ISL', 'DNK', 'VNM', 'CHL', 'IDN', 'TUR', 'IRN', 'FIN', 'SWE', 'PAK', 'BGD', 'KOR', 'ITA', 'ESP', 'UKR', 'POL', 'NLD', 'BEL', 'GRC', 'PRT', 'MAR', 'DZA', 'EGY', 'KAZ', 'UZB', 'THA', 'MYS', 'PHL', 'NZL', 'ISR', 'COL'
]

// Country name mapping for display
export const COUNTRY_NAMES: { [key: string]: string } = {
  'USA': 'United States',
  'CHN': 'China',
  'IND': 'India',
  'RUS': 'Russia',
  'DEU': 'Germany',
  'FRA': 'France',
  'JPN': 'Japan',
  'BRA': 'Brazil',
  'CAN': 'Canada',
  'SAU': 'Saudi Arabia',
  'NOR': 'Norway',
  'GBR': 'United Kingdom',
  'AUS': 'Australia',
  'ZAF': 'South Africa',
  'MEX': 'Mexico',
  'ARE': 'United Arab Emirates',
  'QAT': 'Qatar',
  'ISL': 'Iceland',
  'DNK': 'Denmark',
  'VNM': 'Vietnam',
  'CHL': 'Chile',
  'IDN': 'Indonesia',
  'TUR': 'Turkey',
  'IRN': 'Iran',
  'FIN': 'Finland',
  'SWE': 'Sweden',
  'PAK': 'Pakistan',
  'BGD': 'Bangladesh',
  'KOR': 'South Korea',
  'ITA': 'Italy',
  'ESP': 'Spain',
  'UKR': 'Ukraine',
  'POL': 'Poland',
  'NLD': 'Netherlands',
  'BEL': 'Belgium',
  'GRC': 'Greece',
  'PRT': 'Portugal',
  'MAR': 'Morocco',
  'DZA': 'Algeria',
  'EGY': 'Egypt',
  'KAZ': 'Kazakhstan',
  'UZB': 'Uzbekistan',
  'THA': 'Thailand',
  'MYS': 'Malaysia',
  'PHL': 'Philippines',
  'NZL': 'New Zealand',
  'ISR': 'Israel',
  'COL': 'Colombia'
}

// Fetch energy consumption data from Our World in Data
export async function fetchEnergyConsumptionData(): Promise<{ [countryCode: string]: EnergyConsumptionData }> {
  try {
    const response = await fetch(
      'https://ourworldindata.org/grapher/energy-consumption-by-source-and-country.csv?v=1&csvType=full&useColumnShortNames=true',
      {
        headers: {
          'User-Agent': 'Our World In Data data fetch/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch energy consumption data: ${response.status}`)
    }
    
    const csvText = await response.text()
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')
    
    // Find column indices
    const columnIndices = {
      entity: headers.findIndex(h => h === 'Entity'),
      code: headers.findIndex(h => h === 'Code'),
      year: headers.findIndex(h => h === 'Year'),
      oil: headers.findIndex(h => h === 'oil_consumption_twh'),
      coal: headers.findIndex(h => h === 'coal_consumption_twh'),
      gas: headers.findIndex(h => h === 'gas_consumption_twh'),
      nuclear: headers.findIndex(h => h === 'nuclear_consumption_equivalent_twh'),
      hydro: headers.findIndex(h => h === 'hydro_consumption_equivalent_twh'),
      wind: headers.findIndex(h => h === 'wind_consumption_equivalent_twh'),
      solar: headers.findIndex(h => h === 'solar_consumption_equivalent_twh'),
      biofuels: headers.findIndex(h => h === 'biofuels_consumption_twh'),
      other_renewables: headers.findIndex(h => h === 'other_renewables_consumption_equivalent_twh')
    }

    // Process CSV data
    const processedData: { [countryCode: string]: EnergyConsumptionData } = {}
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',')
      if (line.length < headers.length) continue

      const countryCode = line[columnIndices.code]
      const year = parseInt(line[columnIndices.year])

      // Only process supported countries and 2023 data
      if (!SUPPORTED_COUNTRIES.includes(countryCode) || year !== 2023) continue

      // Parse numeric values, defaulting to 0 if not available
      const parseValue = (index: number) => {
        const value = line[index]
        return value && value !== '' ? parseFloat(value) : 0
      }

      processedData[countryCode] = {
        country: line[columnIndices.entity],
        code: countryCode,
        year: year,
        oil: parseValue(columnIndices.oil),
        coal: parseValue(columnIndices.coal),
        gas: parseValue(columnIndices.gas),
        nuclear: parseValue(columnIndices.nuclear),
        hydro: parseValue(columnIndices.hydro),
        wind: parseValue(columnIndices.wind),
        solar: parseValue(columnIndices.solar),
        biofuels: parseValue(columnIndices.biofuels),
        other_renewables: parseValue(columnIndices.other_renewables)
      }
    }
    
    return processedData
  } catch (error) {
    console.error('Error fetching energy consumption data:', error)
    throw error
  }
}

// Fetch electricity production data from Our World in Data
export async function fetchElectricityProductionData(): Promise<{ [countryCode: string]: ElectricityProductionData }> {
  try {
    const response = await fetch(
      'https://ourworldindata.org/grapher/electricity-prod-source-stacked.csv?v=1&csvType=full&useColumnShortNames=true',
      {
        headers: {
          'User-Agent': 'Our World In Data data fetch/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch electricity production data: ${response.status}`)
    }
    
    const csvText = await response.text()
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')
    
    // Find column indices
    const columnIndices = {
      entity: headers.findIndex(h => h === 'Entity'),
      code: headers.findIndex(h => h === 'Code'),
      year: headers.findIndex(h => h === 'Year'),
      coal: headers.findIndex(h => h === 'coal_generation__twh_chart_electricity_prod_source_stacked'),
      gas: headers.findIndex(h => h === 'gas_generation__twh_chart_electricity_prod_source_stacked'),
      oil: headers.findIndex(h => h === 'oil_generation__twh_chart_electricity_prod_source_stacked'),
      nuclear: headers.findIndex(h => h === 'nuclear_generation__twh_chart_electricity_prod_source_stacked'),
      hydro: headers.findIndex(h => h === 'hydro_generation__twh_chart_electricity_prod_source_stacked'),
      wind: headers.findIndex(h => h === 'wind_generation__twh_chart_electricity_prod_source_stacked'),
      solar: headers.findIndex(h => h === 'solar_generation__twh_chart_electricity_prod_source_stacked'),
      bioenergy: headers.findIndex(h => h === 'bioenergy_generation__twh_chart_electricity_prod_source_stacked'),
      other: headers.findIndex(h => h === 'other_renewables_excluding_bioenergy_generation__twh_chart_electricity_prod_source_stacked')
    }

    // Process CSV data
    const processedData: { [countryCode: string]: ElectricityProductionData } = {}
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',')
      if (line.length < headers.length) continue

      const countryCode = line[columnIndices.code]
      const year = parseInt(line[columnIndices.year])

      // Only process supported countries and 2023 data
      if (!SUPPORTED_COUNTRIES.includes(countryCode) || year !== 2023) continue

      // Parse numeric values, defaulting to 0 if not available
      const parseValue = (index: number) => {
        const value = line[index]
        return value && value !== '' ? parseFloat(value) : 0
      }

      processedData[countryCode] = {
        country: line[columnIndices.entity],
        code: countryCode,
        year: year,
        coal: parseValue(columnIndices.coal),
        gas: parseValue(columnIndices.gas),
        oil: parseValue(columnIndices.oil),
        nuclear: parseValue(columnIndices.nuclear),
        hydro: parseValue(columnIndices.hydro),
        wind: parseValue(columnIndices.wind),
        solar: parseValue(columnIndices.solar),
        bioenergy: parseValue(columnIndices.bioenergy),
        other: parseValue(columnIndices.other)
      }
    }
    
    return processedData
  } catch (error) {
    console.error('Error fetching electricity production data:', error)
    throw error
  }
}

// Fetch both energy consumption and electricity production data
export async function fetchAllEnergyData(): Promise<{ [countryCode: string]: CombinedEnergyData }> {
  try {
    // Fetch all data in parallel
    const [consumptionData, productionData, tradeData, timeSeriesData] = await Promise.all([
      fetchEnergyConsumptionData(),
      fetchElectricityProductionData(),
      fetchEnergyTradeData(),
      fetchEnergyTimeSeriesData()
    ])

    // Combine the data
    const combinedData: { [countryCode: string]: CombinedEnergyData } = {}
    
    for (const countryCode of SUPPORTED_COUNTRIES) {
      if (consumptionData[countryCode] && productionData[countryCode]) {
        combinedData[countryCode] = {
          consumption: consumptionData[countryCode],
          production: productionData[countryCode],
          trade: tradeData[countryCode] || [],
          timeSeries: timeSeriesData[countryCode] || []
        }
      }
    }
    
    return combinedData
  } catch (error) {
    console.error('Error fetching combined energy data:', error)
    throw error
  }
}

// Cache for energy data
let cachedData: { [countryCode: string]: CombinedEnergyData } | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function getEnergyData(): Promise<{ [countryCode: string]: CombinedEnergyData }> {
  const now = Date.now()
  
  // Return cached data if it's still valid
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData
  }

  // Fetch fresh data
  const data = await fetchAllEnergyData()
  
  // Cache the new data
  cachedData = data
  cacheTimestamp = now
  
  return data
}

export async function fetchEnergyTradeData(): Promise<{ [countryCode: string]: EnergyTradeData[] }> {
  try {
    const response = await fetch(
      'https://ourworldindata.org/grapher/energy-imports-and-exports-energy-use.csv?v=1&csvType=full&useColumnShortNames=true',
      {
        headers: {
          'User-Agent': 'Our World In Data data fetch/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch energy trade data: ${response.status}`)
    }
    
    const csvText = await response.text()
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')
    
    // Find column indices
    const columnIndices = {
      entity: headers.findIndex(h => h === 'Entity'),
      code: headers.findIndex(h => h === 'Code'),
      year: headers.findIndex(h => h === 'Year'),
      importPercentage: headers.findIndex(h => h === 'eg_imp_cons_zs')
    }

    // Process CSV data
    const processedData: { [countryCode: string]: EnergyTradeData[] } = {}
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',')
      if (line.length < headers.length) continue

      const countryCode = line[columnIndices.code]
      const year = parseInt(line[columnIndices.year])
      const importPercentage = parseFloat(line[columnIndices.importPercentage])

      // Only process supported countries and valid data
      if (!SUPPORTED_COUNTRIES.includes(countryCode) || isNaN(year) || isNaN(importPercentage)) continue

      // Initialize array for country if it doesn't exist
      if (!processedData[countryCode]) {
        processedData[countryCode] = []
      }

      processedData[countryCode].push({
        country: line[columnIndices.entity],
        code: countryCode,
        year: year,
        importPercentage: importPercentage
      })
    }
    
    // Sort each country's data by year
    for (const countryCode in processedData) {
      processedData[countryCode].sort((a, b) => a.year - b.year)
    }
    
    return processedData
  } catch (error) {
    console.error('Error fetching energy trade data:', error)
    throw error
  }
}

export async function fetchEnergyTimeSeriesData(): Promise<{ [countryCode: string]: EnergyTimeSeriesData[] }> {
  try {
    const response = await fetch(
      'https://ourworldindata.org/grapher/energy-consumption-by-source-and-country.csv?v=1&csvType=full&useColumnShortNames=true',
      {
        headers: {
          'User-Agent': 'Our World In Data data fetch/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch energy time series data: ${response.status}`)
    }
    
    const csvText = await response.text()
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')
    
    // Find column indices
    const columnIndices = {
      entity: headers.findIndex(h => h === 'Entity'),
      code: headers.findIndex(h => h === 'Code'),
      year: headers.findIndex(h => h === 'Year'),
      oil: headers.findIndex(h => h === 'oil_consumption_twh'),
      coal: headers.findIndex(h => h === 'coal_consumption_twh'),
      gas: headers.findIndex(h => h === 'gas_consumption_twh'),
      nuclear: headers.findIndex(h => h === 'nuclear_consumption_equivalent_twh'),
      hydro: headers.findIndex(h => h === 'hydro_consumption_equivalent_twh'),
      wind: headers.findIndex(h => h === 'wind_consumption_equivalent_twh'),
      solar: headers.findIndex(h => h === 'solar_consumption_equivalent_twh'),
      biofuels: headers.findIndex(h => h === 'biofuels_consumption_twh'),
      other_renewables: headers.findIndex(h => h === 'other_renewables_consumption_equivalent_twh')
    }

    // Process CSV data
    const processedData: { [countryCode: string]: EnergyTimeSeriesData[] } = {}
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',')
      if (line.length < headers.length) continue

      const countryCode = line[columnIndices.code]
      const year = parseInt(line[columnIndices.year])

      // Only process supported countries
      if (!SUPPORTED_COUNTRIES.includes(countryCode) || isNaN(year)) continue

      // Parse numeric values, defaulting to 0 if not available
      const parseValue = (index: number) => {
        const value = line[index]
        return value && value !== '' ? parseFloat(value) : 0
      }

      // Initialize array for country if it doesn't exist
      if (!processedData[countryCode]) {
        processedData[countryCode] = []
      }

      processedData[countryCode].push({
        country: line[columnIndices.entity],
        code: countryCode,
        year: year,
        oil: parseValue(columnIndices.oil),
        coal: parseValue(columnIndices.coal),
        gas: parseValue(columnIndices.gas),
        nuclear: parseValue(columnIndices.nuclear),
        hydro: parseValue(columnIndices.hydro),
        wind: parseValue(columnIndices.wind),
        solar: parseValue(columnIndices.solar),
        biofuels: parseValue(columnIndices.biofuels),
        other_renewables: parseValue(columnIndices.other_renewables)
      })
    }
    
    // Sort each country's data by year
    for (const countryCode in processedData) {
      processedData[countryCode].sort((a, b) => a.year - b.year)
    }
    
    return processedData
  } catch (error) {
    console.error('Error fetching energy time series data:', error)
    throw error
  }
} 