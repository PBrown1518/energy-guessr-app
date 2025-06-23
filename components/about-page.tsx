"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, Linkedin, Mail, Zap } from "lucide-react"

interface AboutPageProps {
  onBack: () => void
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="p-3 z-10">
            <ArrowLeft className="h-10 w-10 md:h-4 md:w-4" />
            <span className="hidden md:inline ml-2">Back to Menu</span>
          </Button>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="w-14 md:w-20"></div> {/* Spacer for centering */}
        </div>

        <div className="space-y-8">
          {/* Game Description */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">About the Game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                EnergyGuessr is an educational game designed to test and improve your knowledge of global energy
                consumption patterns. By presenting real-world energy data from different countries, the game helps
                players understand the diverse energy landscapes around the world.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The game uses data sourced from Our World in Data, which provides comprehensive energy statistics
                including consumption patterns, electricity production, energy trade, and historical trends. Players are
                challenged to identify countries based on their unique energy profiles, learning about renewable energy
                adoption, fossil fuel dependency, and energy policy impacts across different nations.
              </p>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Frontend Technologies</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Next.js 14 with App Router</li>
                    <li>• React with TypeScript</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Recharts for data visualisation</li>
                    <li>• HTML5 Drag and Drop API</li>
                    <li>• shadcn/ui component library</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Features</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Interactive multiple-choice interface</li>
                    <li>• Real-time score calculation</li>
                    <li>• Responsive design</li>
                    <li>• Smooth animations and transitions</li>
                    <li>• Educational energy data visualisation</li>
                    <li>• Multi-round gameplay system</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">About the Developer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    This game was created as an educational tool to promote awareness about global energy consumption
                    and the transition to renewable energy sources. The developer is passionate about combining
                    technology with environmental education to create engaging learning experiences.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The project demonstrates modern web development practices including responsive design, interactive
                    user interfaces, and data visualisation techniques. It serves as both an educational game and a
                    showcase of technical capabilities.
                  </p>
                </div>
                <div className="md:w-80">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg text-white">
                    <h3 className="font-semibold text-lg mb-4">Connect with the Developer</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Github className="h-5 w-5" />
                        <span>github.com/yourusername</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Linkedin className="h-5 w-5" />
                        <span>linkedin.com/in/yourprofile</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5" />
                        <span>your.email@example.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Data Sources & Acknowledgments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The energy data used in this game is based on real-world statistics from Our World in Data, which
                aggregates information from leading energy organisations including the Energy Institute, Ember, and the
                International Energy Agency (IEA). While the specific values are adapted for gameplay purposes, they
                reflect realistic energy mix proportions and trends.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Special Thanks:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Our World in Data for comprehensive global energy statistics</li>
                  <li>• Energy Institute - Statistical Review of World Energy (2024)</li>
                  <li>• Ember for electricity production data</li>
                  <li>• International Energy Agency (IEA) and OECD for energy trade data</li>
                  <li>• Open-source community for the amazing tools and libraries</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Data Attribution:</h4>
                <p className="text-green-800 text-sm">
                  All energy data is sourced from OurWorldinData.org/energy under Creative Commons BY license. The data
                  represents primary energy consumption using the substitution method, electricity production in
                  terawatt-hours, and energy trade as percentage of total energy use.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
