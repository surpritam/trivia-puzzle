import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats, GameSettings, Difficulty } from '../types';

class StorageService {
  private static instance: StorageService;
  
  // Storage keys
  private readonly STATS_KEY = 'user_stats';
  private readonly SETTINGS_KEY = 'game_settings';
  private readonly DAILY_PUZZLE_KEY = 'daily_puzzle_date';

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Default values
  private getDefaultStats(): UserStats {
    return {
      totalScore: 0,
      currentStreak: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      triviaAccuracy: 0,
      puzzleAccuracy: 0,
      dailyPuzzleComplete: false,
      lastPlayedDate: new Date().toISOString().split('T')[0]
    };
  }

  private getDefaultSettings(): GameSettings {
    return {
      difficulty: 'medium' as Difficulty,
      soundEnabled: true,
      vibrationEnabled: true,
      darkMode: false,
      hintsEnabled: true
    };
  }

  // User Stats Management
  async getUserStats(): Promise<UserStats> {
    try {
      const stats = await AsyncStorage.getItem(this.STATS_KEY);
      if (stats) {
        return JSON.parse(stats);
      }
      return this.getDefaultStats();
    } catch (error) {
      console.error('Error loading user stats:', error);
      return this.getDefaultStats();
    }
  }

  async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  async updateStats(
    isCorrect: boolean,
    points: number,
    streakBonus: number,
    isPuzzle: boolean = false
  ): Promise<UserStats> {
    const currentStats = await this.getUserStats();
    
    const newStats: UserStats = {
      ...currentStats,
      totalScore: currentStats.totalScore + points + streakBonus,
      totalQuestions: currentStats.totalQuestions + 1,
      correctAnswers: isCorrect ? currentStats.correctAnswers + 1 : currentStats.correctAnswers,
      currentStreak: isCorrect ? currentStats.currentStreak + 1 : 0,
      lastPlayedDate: new Date().toISOString().split('T')[0]
    };

    // Calculate accuracy
    if (isPuzzle) {
      const puzzleTotal = Math.floor(currentStats.totalQuestions * 0.5); // Assuming 50% are puzzles
      newStats.puzzleAccuracy = puzzleTotal > 0 ? (currentStats.correctAnswers / puzzleTotal) * 100 : 0;
    } else {
      const triviaTotal = Math.ceil(currentStats.totalQuestions * 0.5); // Assuming 50% are trivia
      newStats.triviaAccuracy = triviaTotal > 0 ? (currentStats.correctAnswers / triviaTotal) * 100 : 0;
    }

    await this.saveUserStats(newStats);
    return newStats;
  }

  // Game Settings Management
  async getGameSettings(): Promise<GameSettings> {
    try {
      const settings = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (settings) {
        return JSON.parse(settings);
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading game settings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveGameSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving game settings:', error);
    }
  }

  // Daily Puzzle Management
  async isDailyPuzzleCompleted(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastCompleted = await AsyncStorage.getItem(this.DAILY_PUZZLE_KEY);
      return lastCompleted === today;
    } catch (error) {
      console.error('Error checking daily puzzle status:', error);
      return false;
    }
  }

  async markDailyPuzzleCompleted(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(this.DAILY_PUZZLE_KEY, today);
      
      // Update stats
      const stats = await this.getUserStats();
      stats.dailyPuzzleComplete = true;
      await this.saveUserStats(stats);
    } catch (error) {
      console.error('Error marking daily puzzle as completed:', error);
    }
  }

  // Reset daily puzzle status (for new day)
  async resetDailyPuzzleIfNewDay(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stats = await this.getUserStats();
      
      if (stats.lastPlayedDate !== today) {
        stats.dailyPuzzleComplete = false;
        stats.lastPlayedDate = today;
        await this.saveUserStats(stats);
      }
    } catch (error) {
      console.error('Error resetting daily puzzle:', error);
    }
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.STATS_KEY,
        this.SETTINGS_KEY,
        this.DAILY_PUZZLE_KEY
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default StorageService;