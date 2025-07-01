# Trivia Puzzle Game

A mobile-first offline trivia and puzzle game built with React Native, TypeScript, and Expo. Features comprehensive gameplay with persistent storage and prepared structure for future AI-powered question generation.

![React Native](https://img.shields.io/badge/React%20Native-0.72.6-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue.svg)
![Expo](https://img.shields.io/badge/Expo-49.0.15-black.svg)

## 🎮 Features

### Core Gameplay
- **Trivia Quiz**: Multiple-choice questions across various categories and difficulties
- **Word Puzzles**: Riddles, scrambled words, and anagrams with progressive hints
- **Daily Puzzles**: Special daily challenges with bonus scoring
- **Difficulty Levels**: Easy, Medium, and Hard content with adaptive scoring
- **Progress Tracking**: Score, streaks, accuracy, and completion statistics

### User Experience
- **Offline-First**: Complete functionality without internet connection
- **Mobile-Optimized**: Responsive design built for mobile devices
- **Persistent Storage**: Progress and settings saved locally with AsyncStorage
- **Settings Management**: Difficulty preferences, sound, vibration, and dark mode
- **Comprehensive Statistics**: Detailed progress tracking and analytics

### Technical Features
- **TypeScript**: Full type safety and excellent IDE support
- **React Navigation**: Smooth navigation between screens
- **Scoring System**: Difficulty-based points with streak bonuses
- **Answer Validation**: Flexible text matching for word puzzles
- **LLM Integration Ready**: Complete interface for future AI integration

## 🏗️ Project Structure

```
src/
├── screens/           # Main app screens
│   ├── HomeScreen.tsx
│   ├── TriviaScreen.tsx
│   ├── WordPuzzleScreen.tsx
│   ├── SettingsScreen.tsx
│   └── DailyPuzzleScreen.tsx
├── services/          # Storage and LLM services
│   ├── StorageService.ts
│   └── LLMService.ts
├── types/            # TypeScript definitions
│   └── index.ts
├── utils/            # Helper functions
│   └── index.ts
├── data/             # Puzzle database
│   ├── triviaQuestions.ts
│   ├── wordPuzzles.ts
│   └── index.ts
└── components/       # Reusable components (ready for future)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/surpritam/trivia-puzzle.git
   cd trivia-puzzle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

## 📱 App Screens

### Home Screen
- User statistics dashboard (score, streak, accuracy)
- Navigation to all game modes
- Daily puzzle completion status
- Progress overview

### Trivia Screen
- Multiple-choice questions with 4 options
- Difficulty selector (Easy/Medium/Hard)
- Real-time scoring with streak bonuses
- Detailed explanations for learning
- Statistics tracking

### Word Puzzle Screen
- Three types: Riddles, Scrambled Words, Anagrams
- Progressive hint system
- Text input with flexible answer validation
- Hint penalty system for scoring
- Answer normalization

### Settings Screen
- Game preferences (difficulty, sound, vibration)
- Progress statistics and analytics
- Content statistics (available questions/puzzles)
- Reset progress functionality
- App information

### Daily Puzzle Screen
- Special daily challenge with bonus points
- Alternates between trivia and word puzzles
- Completion tracking
- Enhanced scoring system

## 🎯 Scoring System

### Base Points
- **Easy**: 10 points
- **Medium**: 20 points  
- **Hard**: 30 points

### Bonuses
- **Streak Bonus**: Up to 100% extra points for 10+ streak
- **Daily Puzzle**: +50% bonus points
- **Hint Penalty**: -20% per hint used (word puzzles)

### Streak Thresholds
- 3 streak: +10% bonus
- 5 streak: +25% bonus
- 10 streak: +50% bonus
- 20 streak: +100% bonus

## 📊 Content Database

### Trivia Questions
- **Total**: 15 questions across all difficulties
- **Categories**: Geography, Science, Art, History, Literature, Math, Politics
- **Structure**: Question, 4 options, correct answer, explanation, category

### Word Puzzles
- **Total**: 15 puzzles across all difficulties
- **Types**: Riddles (7), Scrambled Words (4), Anagrams (4)
- **Features**: Progressive hints, flexible answer matching, explanations

## 🔧 Configuration

### Settings Available
- **Difficulty**: Default difficulty level for new games
- **Sound**: Enable/disable sound effects
- **Vibration**: Enable/disable haptic feedback
- **Dark Mode**: UI theme preference (prepared for implementation)
- **Hints**: Enable/disable hint system

### Storage
- **AsyncStorage**: Persistent local storage for all user data
- **Settings**: Game preferences and configuration
- **Statistics**: Score, streaks, accuracy, completion tracking
- **Daily Puzzle**: Completion status with date tracking

## 🤖 AI Integration (Future)

The app is prepared for AI-powered question generation with:

### LLM Service Interface
- Complete service abstraction for llama.cpp integration
- Prompt templates for different content types
- Response parsing and validation
- Fallback system with hardcoded content

### Integration Plan
- Native module for llama.cpp
- TinyLlama or Phi-3-mini model support
- Offline question generation
- Background processing
- Quality assessment and caching

## 🧪 Testing & Validation

### Manual Testing Completed
- ✅ All screens navigate correctly
- ✅ Trivia questions display and score properly
- ✅ Word puzzles accept input and validate answers
- ✅ Settings persist across app restarts
- ✅ Progress tracking updates accurately
- ✅ Daily puzzle system works correctly

### Data Validation
- TypeScript type checking for all content
- Content structure validation
- Answer format verification
- Category and difficulty consistency

## 🛠️ Development

### Available Scripts
- `npm start`: Start Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS device/simulator
- `npm run web`: Run in web browser (for testing)

### Key Dependencies
- **React Native**: 0.72.6
- **Expo**: ~49.0.15
- **TypeScript**: ^5.1.3
- **React Navigation**: ^6.1.7
- **AsyncStorage**: 1.18.2
- **React Native Elements**: ^3.4.3

## 📋 Future Enhancements

### Planned Features
- [ ] **LLM Integration**: Implement native llama.cpp module
- [ ] **Advanced Animations**: Add micro-interactions and transitions
- [ ] **More Puzzle Types**: Crosswords, sudoku, math puzzles
- [ ] **Social Features**: Local sharing and challenges
- [ ] **Accessibility**: Screen reader support and keyboard navigation
- [ ] **Testing Suite**: Unit tests and E2E testing setup

### Technical Improvements
- [ ] **Performance**: Optimize rendering and memory usage
- [ ] **Offline Sync**: Enhanced data management
- [ ] **Analytics**: Usage tracking and insights
- [ ] **Localization**: Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Ready for production deployment and AI integration!** 🚀