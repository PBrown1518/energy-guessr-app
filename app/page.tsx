"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Zap, Target, BarChart3, TrendingUp, Clock } from "lucide-react"
import GameScreen from "@/components/game-screen"
import AboutPage from "@/components/about-page"
import ResultsScreen from "@/components/results-screen"

interface GameResult {
  country: string
  flag: string
  isCorrect: boolean
  points: number
  chartsViewed: number
}

export default function EnergyGuessr() {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "game" | "about" | "results">("welcome")
  const [gameResults, setGameResults] = useState<GameResult[]>([])

  const handleStartGame = () => {
    setCurrentScreen("game")
    setGameResults([])
  }

  const handleGameComplete = (results: GameResult[]) => {
    setGameResults(results)
    setCurrentScreen("results")
  }

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome")
  }

  if (currentScreen === "game") {
    return <GameScreen onGameComplete={handleGameComplete} onBackToWelcome={handleBackToWelcome} />
  }

  if (currentScreen === "about") {
    return <AboutPage onBack={handleBackToWelcome} />
  }

  if (currentScreen === "results") {
    return <ResultsScreen results={gameResults} onPlayAgain={handleStartGame} onBackToWelcome={handleBackToWelcome} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent leading-tight pb-1">
              EnergyGuessr
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Guess the country based on real global energy data!</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={handleStartGame}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Zap className="mr-2 h-5 w-5" />
            Start Game
          </Button>
          <Button
            onClick={() => setCurrentScreen("about")}
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg font-semibold border-2 hover:bg-gray-50"
          >
            <Info className="mr-2 h-5 w-5" />
            About
          </Button>
        </div>

        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Target className="h-6 w-6 text-blue-500" />
              How to Play
            </CardTitle>
            <CardDescription className="text-base">
              Analyse real energy data to identify countries around the world
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Choose Your Country</h3>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll see 4 countries with flags. Pick which one matches the energy data shown.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Analyse the Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Study up to 4 different energy visualisations to help make your decision.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Strategic Guessing</h3>
                    <p className="text-sm text-muted-foreground">
                      Guess early for more points, or reveal more data for better accuracy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Score Points</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete 5 rounds and maximise your score up to 500 points!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Four Types of Energy Visualisations:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-blue-800">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm">Energy Consumption 2023</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">Electricity Production 2023</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Energy Imports & Exports</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Energy Mix Over Time</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Scoring System:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-green-800">
                  <div className="text-center">
                    <div className="font-bold text-lg">100</div>
                    <div>After 1 chart</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">75</div>
                    <div>After 2 charts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">50</div>
                    <div>After 3 charts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">25</div>
                    <div>After 4 charts</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
