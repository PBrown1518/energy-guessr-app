# 🌍 EnergyGuessr

A simple educational web game that challenges players to identify countries based on real global energy data fetched from Our World in Data (OWID) APIs. Test your knowledge of energy patterns, renewable adoption, and energy policies across different nations!

![EnergyGuessr Game](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## About the Game
The main reason I built this game was to explore what was currently possible for a PM armed with AI development tools. I had heard impressive things about the likes of v0 and Cursor, so I wanted to see for myself. But I hoped that I could also make something that I (and perhaps others) would find interesting. So I combined my interests in global energy, data analysis & trivia games in order to come up with the concept for this game.

Players are challenged to guess the correct country using their data detective skills, and hopefully will learn sometihng about country energy profiles, fossil fuel dependency & energy policy along the way. Players can choose to reveal up to 4 visualisations to help with their decision, but they are rewarded for guessing early!

### How to Play

1. **Choose Your Country**: You'll see 4 countries with flags. Pick which one matches the energy data shown.
2. **Analyze the Data**: Study up to 4 different energy visualizations to help make your decision.
3. **Strategic Guessing**: Guess early for more points, or reveal more data for better accuracy.
4. **Score Points**: Complete 5 rounds and maximize your score up to 500 points!

### Scoring System

- **100 points**: After viewing 1 chart
- **75 points**: After viewing 2 charts  
- **50 points**: After viewing 3 charts
- **25 points**: After viewing 4 charts

## Features
- **Multiple Choice Interface**: Choose from 4 countries with flag representations
- **Progressive Data Revelation**: Unlock up to 4 energy visualizations per round
- **Real-time Scoring**: Immediate feedback and point calculation
- **Strategic Decision Making**: Balance speed vs. accuracy for optimal scoring
- **Firework Celebrations**: Special animations for perfect scores (500 points)

### Energy Data Visualizations
- **Energy Consumption 2023**: Primary energy consumption by source
- **Electricity Production 2023**: Electricity generation by source
- **Energy Imports & Exports**: Trade balance over time
- **Energy Mix Over Time**: Historical energy consumption trends

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm** or **yarn**: Package manager
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/energy-guessr.git
   cd energy-guessr/energy-guessr-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to start playing!

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start

# Run linting
npm run lint
```

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.2.4**: React framework with App Router
- **React 19.0.0**: UI library with latest features
- **TypeScript 5.0**: Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS 4.0**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library

### Data Visualization
- **Recharts 3.0**: Composable charting library
- **Responsive Charts**: Adaptive visualizations for all screen sizes

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundler for development

### Deployment
- **Firebase**: Hosting and deployment platform

## 📁 Project Structure

```
energy-guessr-app/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Welcome page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── game-screen.tsx   # Main game interface
│   ├── results-screen.tsx # Game results and statistics
│   └── about-page.tsx    # About and information page
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🎨 Key Components

### Game Screen (`game-screen.tsx`)
- **Country Selection**: Interactive multiple-choice interface
- **Data Visualization**: Progressive chart revelation system
- **Scoring Logic**: Real-time point calculation
- **Responsive Layout**: Desktop and mobile optimizations

### Results Screen (`results-screen.tsx`)
- **Score Display**: Final score with performance analysis
- **Round-by-Round Results**: Detailed breakdown of each round
- **Performance Metrics**: Accuracy and charts viewed statistics
- **Celebration Animations**: Fireworks for perfect scores

### About Page (`about-page.tsx`)
- **Game Information**: Educational value and learning objectives
- **Technical Details**: Implementation overview
- **Data Sources**: Attribution and acknowledgments
- **Developer Information**: Contact and contribution details

## 📊 Data Sources

The game uses real-world energy statistics from:

- **Our World in Data**: Comprehensive global energy statistics
- **Energy Institute**: Statistical Review of World Energy (2024)
- **Ember**: Electricity production data
- **International Energy Agency (IEA)**: Energy trade and policy data

## 🤝 Contributing

I welcome contributions & improvements to EnergyGuessr!

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 🙏 Acknowledgments

### Data Sources
- **Our World in Data** for comprehensive global energy statistics
- **Energy Institute** for the Statistical Review of World Energy (2024)
- **Ember** for electricity production data
- **International Energy Agency (IEA)** and **OECD** for energy trade data