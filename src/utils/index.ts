import { Difficulty, ScoreResult } from '../types';

export class ScoreUtils {
  // Base points for different difficulty levels
  private static readonly DIFFICULTY_POINTS = {
    easy: 10,
    medium: 20,
    hard: 30
  };

  // Streak bonus calculation
  private static readonly STREAK_THRESHOLDS = [
    { threshold: 3, bonus: 0.1 },  // 10% bonus at 3 streak
    { threshold: 5, bonus: 0.25 }, // 25% bonus at 5 streak
    { threshold: 10, bonus: 0.5 }, // 50% bonus at 10 streak
    { threshold: 20, bonus: 1.0 }  // 100% bonus at 20 streak
  ];

  static calculateScore(
    isCorrect: boolean,
    difficulty: Difficulty,
    currentStreak: number,
    isDailyPuzzle: boolean = false
  ): ScoreResult {
    if (!isCorrect) {
      return {
        points: 0,
        streakBonus: 0,
        totalScore: 0,
        newStreak: 0
      };
    }

    const basePoints = this.DIFFICULTY_POINTS[difficulty];
    const newStreak = currentStreak + 1;
    
    // Calculate streak bonus
    let streakMultiplier = 0;
    for (const threshold of this.STREAK_THRESHOLDS) {
      if (newStreak >= threshold.threshold) {
        streakMultiplier = threshold.bonus;
      }
    }

    const streakBonus = Math.floor(basePoints * streakMultiplier);
    let finalPoints = basePoints;

    // Daily puzzle bonus (50% extra points)
    if (isDailyPuzzle) {
      finalPoints = Math.floor(finalPoints * 1.5);
    }

    return {
      points: finalPoints,
      streakBonus,
      totalScore: finalPoints + streakBonus,
      newStreak
    };
  }

  static getStreakBonusText(streak: number): string {
    if (streak < 3) return '';
    if (streak < 5) return '+10% Streak Bonus!';
    if (streak < 10) return '+25% Streak Bonus!';
    if (streak < 20) return '+50% Streak Bonus!';
    return '+100% Streak Bonus! 🔥';
  }

  static getDifficultyColor(difficulty: Difficulty): string {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#2196F3';
    }
  }

  static getDifficultyIcon(difficulty: Difficulty): string {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  }
}

export class TextUtils {
  // Normalize text for answer comparison
  static normalizeAnswer(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  // Check if two answers are equivalent
  static answersMatch(userAnswer: string, correctAnswer: string): boolean {
    const normalizedUser = this.normalizeAnswer(userAnswer);
    const normalizedCorrect = this.normalizeAnswer(correctAnswer);
    
    // Exact match
    if (normalizedUser === normalizedCorrect) {
      return true;
    }

    // Check if user answer contains the correct answer (for partial credit)
    if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
      // Only allow partial match if the length difference is reasonable
      const lengthDiff = Math.abs(normalizedUser.length - normalizedCorrect.length);
      return lengthDiff <= 3;
    }

    return false;
  }

  // Get hint text with progressive revelation
  static getProgressiveHint(hints: string[], hintIndex: number): string {
    if (hintIndex >= hints.length) {
      return hints[hints.length - 1] || 'No more hints available';
    }
    return hints[hintIndex];
  }

  // Scramble text (for scrambled word puzzles)
  static scrambleText(text: string): string {
    const chars = text.toLowerCase().split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }

  // Format time duration
  static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Truncate text with ellipsis
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }
}

export class DateUtils {
  // Check if date is today
  static isToday(dateString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  }

  // Get days since date
  static daysSince(dateString: string): number {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Format date for display
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get today's date string
  static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }
}

export class ValidationUtils {
  // Validate difficulty
  static isValidDifficulty(difficulty: string): difficulty is Difficulty {
    return ['easy', 'medium', 'hard'].includes(difficulty);
  }

  // Validate answer input
  static validateAnswerInput(input: string): { isValid: boolean; message?: string } {
    if (!input || input.trim().length === 0) {
      return { isValid: false, message: 'Please enter an answer' };
    }

    if (input.trim().length < 2) {
      return { isValid: false, message: 'Answer must be at least 2 characters' };
    }

    if (input.length > 100) {
      return { isValid: false, message: 'Answer is too long (max 100 characters)' };
    }

    return { isValid: true };
  }

  // Validate trivia option selection
  static validateTriviaSelection(selection: number, optionsCount: number): boolean {
    return selection >= 0 && selection < optionsCount;
  }
}

export class RandomUtils {
  // Get random element from array
  static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Shuffle array
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get random number in range
  static getRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Get random boolean with probability
  static getRandomBoolean(probability: number = 0.5): boolean {
    return Math.random() < probability;
  }
}