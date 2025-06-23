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

// List of countries supported in the game
export const SUPPORTED_COUNTRIES = [
  'USA', 'CHN', 'JPN', 'DEU', 'RUS', 'IND', 'CAN', 'FRA', 'ITA', 'GBR', 'SAU', 'BRA', 'MEX', 'KOR', 'ESP', 'IRN', 'IDN', 'NLD', 'AUS', 'SGP', 'TWN', 'THA', 'BEL', 'TUR', 'ARG', 'EGY', 'VEN', 'SWE', 'POL', 'ARE', 'MYS', 'ZAF', 'IRQ', 'UKR', 'GRC', 'PHL', 'PAK', 'ROU', 'CHE', 'AUT', 'COL', 'DNK', 'PRT', 'KWT', 'FIN', 'CHL', 'HKG', 'DZA', 'VNM', 'ISR', 'CZE', 'NOR', 'KAZ', 'BLR', 'HUN', 'BGR', 'PER', 'MAR', 'ECU', 'IRL', 'NZL', 'SVK', 'UZB', 'QAT', 'AZE', 'OMN', 'BGD', 'TKM', 'LKA', 'LTU', 'HRV', 'LUX', 'TTO', 'CYP', 'LVA', 'SVN', 'EST', 'ISL', 'MKD'
]

// Country name mapping for display
export const COUNTRY_NAMES: { [key: string]: string } = {
  'USA': 'United States',
  'CHN': 'China',
  'JPN': 'Japan',
  'DEU': 'Germany',
  'RUS': 'Russia',
  'IND': 'India',
  'CAN': 'Canada',
  'FRA': 'France',
  'ITA': 'Italy',
  'GBR': 'United Kingdom',
  'SAU': 'Saudi Arabia',
  'BRA': 'Brazil',
  'MEX': 'Mexico',
  'KOR': 'South Korea',
  'ESP': 'Spain',
  'IRN': 'Iran',
  'IDN': 'Indonesia',
  'NLD': 'Netherlands',
  'AUS': 'Australia',
  'SGP': 'Singapore',
  'TWN': 'Taiwan',
  'THA': 'Thailand',
  'BEL': 'Belgium',
  'TUR': 'Turkey',
  'ARG': 'Argentina',
  'EGY': 'Egypt',
  'VEN': 'Venezuela',
  'SWE': 'Sweden',
  'POL': 'Poland',
  'ARE': 'United Arab Emirates',
  'MYS': 'Malaysia',
  'ZAF': 'South Africa',
  'IRQ': 'Iraq',
  'UKR': 'Ukraine',
  'GRC': 'Greece',
  'PHL': 'Philippines',
  'PAK': 'Pakistan',
  'ROU': 'Romania',
  'CHE': 'Switzerland',
  'AUT': 'Austria',
  'COL': 'Colombia',
  'DNK': 'Denmark',
  'PRT': 'Portugal',
  'KWT': 'Kuwait',
  'FIN': 'Finland',
  'CHL': 'Chile',
  'HKG': 'Hong Kong',
  'DZA': 'Algeria',
  'VNM': 'Vietnam',
  'ISR': 'Israel',
  'CZE': 'Czech Republic',
  'NOR': 'Norway',
  'KAZ': 'Kazakhstan',
  'BLR': 'Belarus',
  'HUN': 'Hungary',
  'BGR': 'Bulgaria',
  'PER': 'Peru',
  'MAR': 'Morocco',
  'ECU': 'Ecuador',
  'IRL': 'Ireland',
  'NZL': 'New Zealand',
  'SVK': 'Slovakia',
  'UZB': 'Uzbekistan',
  'QAT': 'Qatar',
  'AZE': 'Azerbaijan',
  'OMN': 'Oman',
  'BGD': 'Bangladesh',
  'TKM': 'Turkmenistan',
  'LKA': 'Sri Lanka',
  'LTU': 'Lithuania',
  'HRV': 'Croatia',
  'LUX': 'Luxembourg',
  'TTO': 'Trinidad and Tobago',
  'CYP': 'Cyprus',
  'LVA': 'Latvia',
  'SVN': 'Slovenia',
  'EST': 'Estonia',
  'ISL': 'Iceland',
  'MKD': 'North Macedonia'
}

// Fetch energy consumption data from Our World in Data
export async function fetchEnergyData(): Promise<{ [countryCode: string]: EnergyConsumptionData }> {
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
      throw new Error(`Failed to fetch data: ${response.status}`)
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
    console.error('Error fetching energy data:', error)
    throw error
  }
}

// Cache the data to avoid repeated API calls
let cachedData: { [countryCode: string]: EnergyConsumptionData } | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function getEnergyData(): Promise<{ [countryCode: string]: EnergyConsumptionData }> {
  const now = Date.now()
  
  // Return cached data if it's still valid
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData
  }

  // Fetch fresh data
  const data = await fetchEnergyData()
  
  // Cache the new data
  cachedData = data
  cacheTimestamp = now
  
  return data
} 