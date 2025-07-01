export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  explanation: string;
  category: string;
}

export interface WordPuzzle {
  id: string;
  type: 'riddle' | 'scrambled' | 'anagram';
  question: string;
  answer: string;
  hints: string[];
  difficulty: Difficulty;
  explanation: string;
}

export interface UserStats {
  totalScore: number;
  currentStreak: number;
  correctAnswers: number;
  totalQuestions: number;
  triviaAccuracy: number;
  puzzleAccuracy: number;
  dailyPuzzleComplete: boolean;
  lastPlayedDate: string;
}

export interface GameSettings {
  difficulty: Difficulty;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  hintsEnabled: boolean;
}

export interface ScoreResult {
  points: number;
  streakBonus: number;
  totalScore: number;
  newStreak: number;
}

export interface LLMResponse {
  success: boolean;
  content?: TriviaQuestion | WordPuzzle;
  error?: string;
}

export interface LLMPromptTemplate {
  type: 'trivia' | 'word_puzzle';
  difficulty: Difficulty;
  category?: string;
  template: string;
}

export type RootStackParamList = {
  Home: undefined;
  Trivia: { difficulty?: Difficulty };
  WordPuzzle: { difficulty?: Difficulty };
  Settings: undefined;
  DailyPuzzle: undefined;
};