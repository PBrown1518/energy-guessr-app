"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, RotateCcw, Home, Star, Target } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
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
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{result.flag}</div>
                    <div>
                      <h3 className="font-semibold">{result.country}</h3>
                      <p className="text-sm text-muted-foreground">Round {index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${result.isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {result.points} pts
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.isCorrect ? "✓ Correct" : "✗ Incorrect"} ({result.chartsViewed} chart
                      {result.chartsViewed > 1 ? "s" : ""})
                    </p>
                  </div>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </div>
  )
}
