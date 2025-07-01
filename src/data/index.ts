import { TriviaQuestion, WordPuzzle, Difficulty } from '../types';
import { triviaQuestions } from './triviaQuestions';
import { wordPuzzles } from './wordPuzzles';
import { RandomUtils } from '../utils';

export class PuzzleDataService {
  private static instance: PuzzleDataService;

  static getInstance(): PuzzleDataService {
    if (!PuzzleDataService.instance) {
      PuzzleDataService.instance = new PuzzleDataService();
    }
    return PuzzleDataService.instance;
  }

  // Get trivia questions by difficulty
  getTriviaQuestions(difficulty?: Difficulty): TriviaQuestion[] {
    if (difficulty) {
      return triviaQuestions.filter(q => q.difficulty === difficulty);
    }
    return triviaQuestions;
  }

  // Get word puzzles by difficulty
  getWordPuzzles(difficulty?: Difficulty): WordPuzzle[] {
    if (difficulty) {
      return wordPuzzles.filter(p => p.difficulty === difficulty);
    }
    return wordPuzzles;
  }

  // Get random trivia question
  getRandomTriviaQuestion(difficulty?: Difficulty): TriviaQuestion | null {
    const questions = this.getTriviaQuestions(difficulty);
    if (questions.length === 0) return null;
    return RandomUtils.getRandomElement(questions);
  }

  // Get random word puzzle
  getRandomWordPuzzle(difficulty?: Difficulty): WordPuzzle | null {
    const puzzles = this.getWordPuzzles(difficulty);
    if (puzzles.length === 0) return null;
    return RandomUtils.getRandomElement(puzzles);
  }

  // Get daily puzzle (deterministic based on date)
  getDailyPuzzle(): TriviaQuestion | WordPuzzle {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Alternate between trivia and word puzzles based on day
    const isTrivia = dayOfYear % 2 === 0;
    
    if (isTrivia) {
      const questions = this.getTriviaQuestions();
      return questions[dayOfYear % questions.length];
    } else {
      const puzzles = this.getWordPuzzles();
      return puzzles[dayOfYear % puzzles.length];
    }
  }

  // Check if content is trivia question
  isTriviaQuestion(content: TriviaQuestion | WordPuzzle): content is TriviaQuestion {
    return 'options' in content && 'correctAnswer' in content;
  }

  // Check if content is word puzzle
  isWordPuzzle(content: TriviaQuestion | WordPuzzle): content is WordPuzzle {
    return 'type' in content && 'answer' in content && 'hints' in content;
  }

  // Get content by ID
  getContentById(id: string): TriviaQuestion | WordPuzzle | null {
    const trivia = triviaQuestions.find(q => q.id === id);
    if (trivia) return trivia;
    
    const puzzle = wordPuzzles.find(p => p.id === id);
    if (puzzle) return puzzle;
    
    return null;
  }

  // Get statistics about available content
  getContentStats() {
    const triviaByDifficulty = {
      easy: this.getTriviaQuestions('easy').length,
      medium: this.getTriviaQuestions('medium').length,
      hard: this.getTriviaQuestions('hard').length
    };

    const puzzlesByDifficulty = {
      easy: this.getWordPuzzles('easy').length,
      medium: this.getWordPuzzles('medium').length,
      hard: this.getWordPuzzles('hard').length
    };

    const puzzlesByType = {
      riddle: wordPuzzles.filter(p => p.type === 'riddle').length,
      scrambled: wordPuzzles.filter(p => p.type === 'scrambled').length,
      anagram: wordPuzzles.filter(p => p.type === 'anagram').length
    };

    return {
      totalTrivia: triviaQuestions.length,
      totalPuzzles: wordPuzzles.length,
      totalContent: triviaQuestions.length + wordPuzzles.length,
      triviaByDifficulty,
      puzzlesByDifficulty,
      puzzlesByType
    };
  }

  // Search content by text
  searchContent(query: string): (TriviaQuestion | WordPuzzle)[] {
    const lowercaseQuery = query.toLowerCase();
    const results: (TriviaQuestion | WordPuzzle)[] = [];

    // Search trivia questions
    const matchingTrivia = triviaQuestions.filter(q => 
      q.question.toLowerCase().includes(lowercaseQuery) ||
      q.category.toLowerCase().includes(lowercaseQuery) ||
      q.explanation.toLowerCase().includes(lowercaseQuery)
    );

    // Search word puzzles
    const matchingPuzzles = wordPuzzles.filter(p =>
      p.question.toLowerCase().includes(lowercaseQuery) ||
      p.answer.toLowerCase().includes(lowercaseQuery) ||
      p.explanation.toLowerCase().includes(lowercaseQuery) ||
      p.hints.some(hint => hint.toLowerCase().includes(lowercaseQuery))
    );

    return [...matchingTrivia, ...matchingPuzzles];
  }

  // Get content for practice mode (mixed difficulty)
  getPracticeContent(count: number = 10): (TriviaQuestion | WordPuzzle)[] {
    const allContent = [...triviaQuestions, ...wordPuzzles];
    const shuffled = RandomUtils.shuffleArray(allContent);
    return shuffled.slice(0, count);
  }

  // Get content for specific category (trivia only)
  getTriviaByCategory(category: string): TriviaQuestion[] {
    return triviaQuestions.filter(q => 
      q.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get available categories
  getAvailableCategories(): string[] {
    const categories = new Set(triviaQuestions.map(q => q.category));
    return Array.from(categories).sort();
  }

  // Validate content structure
  validateContent(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate trivia questions
    triviaQuestions.forEach((q, index) => {
      if (!q.id || !q.question || !q.options || q.options.length !== 4) {
        errors.push(`Trivia question ${index + 1}: Invalid structure`);
      }
      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        errors.push(`Trivia question ${index + 1}: Invalid correct answer index`);
      }
    });

    // Validate word puzzles
    wordPuzzles.forEach((p, index) => {
      if (!p.id || !p.question || !p.answer || !p.hints || p.hints.length === 0) {
        errors.push(`Word puzzle ${index + 1}: Invalid structure`);
      }
      if (!['riddle', 'scrambled', 'anagram'].includes(p.type)) {
        errors.push(`Word puzzle ${index + 1}: Invalid type`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const puzzleData = PuzzleDataService.getInstance();

// Export individual arrays for direct access
export { triviaQuestions, wordPuzzles };