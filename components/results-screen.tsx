"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, RotateCcw, Home, Star, Target } from "lucide-react"
import { useEffect, useState } from "react"

interface ResultsScreenProps {
  results: GameResult[]
  onPlayAgain: () => void
  onBackToWelcome: () => void
}

interface GameResult {
  country: string
  flag: string
  isCorrect: boolean
  points: number
  chartsViewed: number
  playerGuess: string
  playerGuessFlag: string
  correctAnswer: string
  correctAnswerFlag: string
}

// Country descriptions for educational context
const COUNTRY_DESCRIPTIONS: { [key: string]: string } = {
  'United States': 'Texas produces more wind power than most countries, while California leads in solar generation.',
  'China': 'China installs more solar panels each year than the rest of the world combined but still consumes half the world\'s coal.',
  'India': 'India is one of the fastest-growing solar markets, rapidly transitioning from coal dependency.',
  'Russia': 'Before 2022, Russia supplied over 40% of the European Union\'s natural gas and remains a top energy exporter.',
  'Germany': 'Germany is a global leader in wind and solar and has phased out nuclear power as part of its Energiewende transition.',
  'France': 'France generates nearly 70% of its electricity from nuclear power, making it one of the cleanest grids in Europe.',
  'Japan': 'After the Fukushima disaster, Japan shifted from nuclear to become one of the world\'s largest LNG importers.',
  'Brazil': 'Brazil generates most of its electricity from hydropower and uses sugarcane ethanol extensively as transport fuel.',
  'Canada': 'Canada\'s provinces have distinct energy mixes, from hydro-rich Quebec to fossil-fueled Alberta, and it is a major exporter.',
  'Saudi Arabia': 'Despite being a top oil producer, Saudi Arabia is investing heavily in solar as part of its Vision 2030 plan.',
  'Norway': 'Nearly 100% of Norway\'s electricity comes from hydropower, yet it is also one of the world\'s largest fossil fuel exporters.',
  'United Kingdom': 'The UK has largely eliminated coal from its grid and is now a global leader in offshore wind capacity.',
  'Australia': 'Australia has the world\'s highest rooftop solar penetration per capita and remains a major coal exporter.',
  'South Africa': 'South Africa gets more than 80% of its electricity from coal but is facing a major energy reliability crisis.',
  'Mexico': 'Mexico\'s energy mix includes oil, gas, and hydro, and recent reforms have created tension between clean energy and state control.',
  'United Arab Emirates': 'The UAE built the Arab world\'s first nuclear power plant and hosts one of the world\'s largest solar farms.',
  'Qatar': 'Qatar is one of the world\'s top exporters of liquefied natural gas and plays a major role in global gas markets.',
  'Iceland': 'Iceland generates nearly all its electricity and heating from renewable hydro and geothermal sources.',
  'Denmark': 'Denmark often produces more electricity from wind than it consumes, leading global wind penetration rates.',
  'Vietnam': 'Vietnam experienced one of the fastest solar booms in history, adding gigawatts of capacity in just two years.',
  'Chile': 'Chile\'s Atacama Desert offers some of the best solar conditions on Earth and is a key site for green hydrogen projects.',
  'Indonesia': 'Indonesia is the world\'s second-largest geothermal producer but still relies heavily on coal-fired power.',
  'Turkey': 'Turkey is expanding its renewable sector while serving as a crucial energy transit hub between Asia and Europe.',
  'Iran': 'Iran has vast oil and gas reserves and maintains some of the world\'s highest energy subsidies for domestic use.',
  'Finland': 'Finland recently activated Europe\'s largest nuclear reactor, covering around 14% of the country\'s electricity demand.',
  'Sweden': 'Sweden\'s electricity mix is almost entirely fossil-free, dominated by hydro, nuclear, and wind power.',
  'Pakistan': 'Pakistan is increasingly turning to solar and hydropower to reduce its reliance on imported fossil fuels.',
  'Bangladesh': 'Bangladesh has rapidly increased electricity access and is deploying solar home systems in rural areas.',
  'South Korea': 'South Korea operates a nuclear-heavy grid and is investing in hydrogen as a key future energy carrier.',
  'Italy': 'Italy imports more than 10% of its electricity due to a complete phaseout of nuclear power after public referenda.',
  'Spain': 'Spain generates more electricity from wind than any other source and has a well-developed solar sector.',
  'Ukraine': 'Ukraine relies heavily on nuclear power and is undergoing major grid changes due to the war and shifting gas imports.',
  'Poland': 'Poland still derives around 70% of its electricity from coal but is planning its first nuclear power stations.',
  'Netherlands': 'The Netherlands is a key gas trading hub for Europe and is rapidly scaling up offshore wind projects.',
  'Belgium': 'Belgium is phasing out nuclear by 2035 but currently generates nearly half of its electricity from nuclear plants.',
  'Greece': 'Greece is accelerating its coal phaseout and has become a Mediterranean leader in wind and solar deployment.',
  'Portugal': 'Portugal once ran entirely on renewable electricity for four consecutive days, driven by wind and hydro.',
  'Morocco': 'Morocco is home to one of the world\'s largest solar power stations and aims to be a regional energy exporter.',
  'Algeria': 'Algeria is a major natural gas supplier to Europe and has underutilized solar potential in the Sahara.',
  'Egypt': 'Egypt is building out solar and wind rapidly while increasing its electricity exports to neighboring countries.',
  'Kazakhstan': 'Kazakhstan\'s power system is heavily coal-based, but the country is expanding renewables and nuclear options.',
  'Uzbekistan': 'Uzbekistan is modernizing its power sector with plans for solar, wind, and its first nuclear power plant.',
  'Thailand': 'Thailand relies on imported natural gas but is one of Southeast Asia\'s fastest movers in solar adoption.',
  'Malaysia': 'Malaysia combines gas, coal, and hydro to power its economy and is becoming a regional hub for data center energy needs.',
  'Philippines': 'The Philippines is a global leader in geothermal energy and is scaling up solar despite frequent natural disasters.',
  'New Zealand': 'New Zealand generates over 80% of its electricity from renewables, mainly hydro and geothermal, with ambitious decarbonization goals.',
  'Israel': 'Israel leads in rooftop solar and solar water heating adoption and is expanding grid-scale solar rapidly.',
  'Colombia': 'Colombia relies heavily on hydropower but is diversifying into wind and solar to address climate-related drought risks.'
}

// Firework component
const Fireworks = () => {
  const [fireworks, setFireworks] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  useEffect(() => {
    const createFirework = () => {
      const newFirework = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.6,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)]
      }
      setFireworks(prev => [...prev, newFirework])
      
      // Remove firework after animation
      setTimeout(() => {
        setFireworks(prev => prev.filter(fw => fw.id !== newFirework.id))
      }, 2000)
    }

    // Create fireworks at intervals
    const interval = setInterval(createFirework, 300)
    
    // Stop creating fireworks after 5 seconds
    const stopTimeout = setTimeout(() => {
      clearInterval(interval)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(stopTimeout)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute animate-ping"
          style={{
            left: firework.x,
            top: firework.y,
            animationDuration: '2s',
            animationIterationCount: 1
          }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: firework.color }}
          />
        </div>
      ))}
    </div>
  )
}

export default function ResultsScreen({ results, onPlayAgain, onBackToWelcome }: ResultsScreenProps) {
  const totalScore = results.reduce((sum, result) => sum + (result.points || 0), 0)
  const maxPossibleScore = 500
  const averageScore = Math.round((totalScore / maxPossibleScore) * 100)
  const totalCorrect = results.reduce((sum, result) => sum + (result.isCorrect ? 1 : 0), 0)
  const totalRounds = results.length
  const totalPossible = totalRounds
  const totalGraphsViewed = results.reduce((sum, result) => sum + (result.chartsViewed || 0), 0)
  const overallAccuracy = Math.round((totalCorrect / totalPossible) * 100)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're an energy expert! 🌟"
    if (score >= 80) return "Excellent work! You know your energy sources! ⚡"
    if (score >= 70) return "Great job! You have solid energy knowledge! 👍"
    if (score >= 60) return "Good effort! Keep learning about energy! 📚"
    if (score >= 50) return "Not bad! There's room for improvement! 💪"
    return "Keep practicing! Energy knowledge takes time to build! 🎯"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-8 pb-8">
      {/* Fireworks for perfect score */}
      {totalScore === 500 && <Fireworks />}
      
      <div className="max-w-4xl mx-auto px-4 min-h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Game Complete!
            </h1>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Your Final Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {totalScore}/500
            </div>
            <p className="text-xl text-muted-foreground">
              {totalCorrect} out of {totalRounds} correct guesses
            </p>
            <p className={`text-lg font-semibold ${getScoreColor(averageScore)}`}>{getScoreMessage(averageScore)}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <Button
            onClick={onBackToWelcome}
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg font-semibold border-2 hover:bg-gray-50"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
        </div>

        {/* Round by Round Results */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Round by Round Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-2xl mt-1">{result.flag}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{result.country}</h3>
                        <p className="text-sm text-muted-foreground">Round {index + 1}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${result.isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {result.points} pts
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.isCorrect ? "✓ Correct" : "✗ Incorrect"} ({result.chartsViewed} chart
                        {result.chartsViewed > 1 ? "s" : ""})
                      </p>
                    </div>
                  </div>
                  {result.isCorrect && COUNTRY_DESCRIPTIONS[result.country] && (
                    <div className="w-full p-3 bg-white rounded-lg border border-green-100">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <span className="font-medium text-green-700">Did you know?</span> {COUNTRY_DESCRIPTIONS[result.country]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalGraphsViewed}</div>
                <p className="text-sm text-blue-800 font-medium">Total Charts Viewed</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{overallAccuracy}%</div>
                <p className="text-sm text-green-800 font-medium">Overall Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
