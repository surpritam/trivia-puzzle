import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TriviaQuestion, WordPuzzle, UserStats } from '../types';
import { puzzleData } from '../data';
import { ScoreUtils, TextUtils, ValidationUtils } from '../utils';
import StorageService from '../services/StorageService';

type DailyPuzzleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DailyPuzzle'>;

const DailyPuzzleScreen: React.FC = () => {
  const navigation = useNavigation<DailyPuzzleScreenNavigationProp>();
  
  const [dailyContent, setDailyContent] = useState<TriviaQuestion | WordPuzzle | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  
  // Trivia-specific state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  // Word puzzle-specific state
  const [userAnswer, setUserAnswer] = useState('');
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // Common state
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadDailyPuzzle();
  }, []);

  const loadDailyPuzzle = async () => {
    try {
      const stats = await StorageService.getInstance().getUserStats();
      const completed = await StorageService.getInstance().isDailyPuzzleCompleted();
      const content = puzzleData.getDailyPuzzle();
      
      setUserStats(stats);
      setIsCompleted(completed);
      setDailyContent(content);
      
      if (completed) {
        setShowResult(true);
        setIsCorrect(true);
      }
    } catch (error) {
      console.error('Error loading daily puzzle:', error);
      Alert.alert('Error', 'Failed to load daily puzzle');
    }
  };

  const handleTriviaSubmit = async () => {
    if (!dailyContent || !userStats || selectedAnswer === null) return;
    
    const triviaQuestion = dailyContent as TriviaQuestion;
    const correct = selectedAnswer === triviaQuestion.correctAnswer;
    
    await processAnswer(correct);
  };

  const handleWordPuzzleSubmit = async () => {
    if (!dailyContent || !userStats) return;

    const validation = ValidationUtils.validateAnswerInput(userAnswer);
    if (!validation.isValid) {
      Alert.alert('Invalid Input', validation.message);
      return;
    }

    const wordPuzzle = dailyContent as WordPuzzle;
    const correct = TextUtils.answersMatch(userAnswer, wordPuzzle.answer);
    
    await processAnswer(correct);
  };

  const processAnswer = async (correct: boolean) => {
    if (!dailyContent || !userStats) return;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // Calculate score with daily puzzle bonus
      let scoreResult = ScoreUtils.calculateScore(
        true,
        dailyContent.difficulty,
        userStats.currentStreak,
        true // isDailyPuzzle = true for bonus
      );

      // Apply hint penalty for word puzzles
      if (puzzleData.isWordPuzzle(dailyContent) && hintsUsed > 0) {
        const hintPenalty = Math.floor(scoreResult.points * 0.2 * hintsUsed);
        scoreResult.points = Math.max(1, scoreResult.points - hintPenalty);
        scoreResult.totalScore = scoreResult.points + scoreResult.streakBonus;
      }

      // Update user stats
      try {
        const updatedStats = await StorageService.getInstance().updateStats(
          true,
          scoreResult.points,
          scoreResult.streakBonus,
          puzzleData.isWordPuzzle(dailyContent)
        );
        
        // Mark daily puzzle as completed
        await StorageService.getInstance().markDailyPuzzleCompleted();
        
        setUserStats(updatedStats);
        setIsCompleted(true);
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    }
  };

  const handleGetHint = () => {
    if (!dailyContent || !puzzleData.isWordPuzzle(dailyContent)) return;
    
    const wordPuzzle = dailyContent as WordPuzzle;
    if (currentHintIndex >= wordPuzzle.hints.length) return;
    
    setCurrentHintIndex(currentHintIndex + 1);
    setHintsUsed(hintsUsed + 1);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScrambledDisplay = (puzzle: WordPuzzle) => {
    if (puzzle.type === 'scrambled') {
      return TextUtils.scrambleText(puzzle.answer);
    }
    return null;
  };

  const getPuzzleTypeDisplay = (type: string) => {
    switch (type) {
      case 'riddle': return '🤔 Daily Riddle';
      case 'scrambled': return '🔀 Daily Scrambled Word';
      case 'anagram': return '🔄 Daily Anagram';
      default: return '🧩 Daily Puzzle';
    }
  };

  if (!dailyContent || !userStats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading daily puzzle...</Text>
      </View>
    );
  }

  const isTriviaQuestion = puzzleData.isTriviaQuestion(dailyContent);
  const isWordPuzzle = puzzleData.isWordPuzzle(dailyContent);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Daily Puzzle</Text>
        <Text style={styles.dateText}>{getTodayDate()}</Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✅ Completed</Text>
          </View>
        )}
      </View>

      {/* Puzzle Card */}
      <View style={styles.puzzleCard}>
        <View style={styles.puzzleHeader}>
          <Text style={styles.puzzleTypeText}>
            {isTriviaQuestion ? '🧠 Daily Trivia' : getPuzzleTypeDisplay((dailyContent as WordPuzzle).type)}
          </Text>
          <View style={styles.bonusContainer}>
            <Text style={styles.bonusText}>🏆 +50% Bonus Points!</Text>
          </View>
        </View>
        
        <Text style={[
          styles.difficultyBadge,
          { backgroundColor: ScoreUtils.getDifficultyColor(dailyContent.difficulty) }
        ]}>
          {dailyContent.difficulty.toUpperCase()} DIFFICULTY
        </Text>
        
        <Text style={styles.questionText}>
          {isTriviaQuestion ? (dailyContent as TriviaQuestion).question : (dailyContent as WordPuzzle).question}
        </Text>

        {/* Trivia Options */}
        {isTriviaQuestion && (
          <View style={styles.optionsContainer}>
            {(dailyContent as TriviaQuestion).options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === (dailyContent as TriviaQuestion).correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== (dailyContent as TriviaQuestion).correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => setSelectedAnswer(index)}
                disabled={showResult || isCompleted}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText,
                  showResult && index === (dailyContent as TriviaQuestion).correctAnswer && styles.correctOptionText,
                ]}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Word Puzzle Content */}
        {isWordPuzzle && (
          <>
            {/* Scrambled word display */}
            {(dailyContent as WordPuzzle).type === 'scrambled' && (
              <View style={styles.scrambledContainer}>
                <Text style={styles.scrambledLabel}>Scrambled letters:</Text>
                <Text style={styles.scrambledText}>
                  {getScrambledDisplay(dailyContent as WordPuzzle)?.toUpperCase()}
                </Text>
              </View>
            )}

            {/* Hints Section */}
            {currentHintIndex > 0 && (
              <View style={styles.hintsContainer}>
                <Text style={styles.hintsTitle}>Hints:</Text>
                {(dailyContent as WordPuzzle).hints.slice(0, currentHintIndex).map((hint, index) => (
                  <Text key={index} style={styles.hintText}>
                    💡 {hint}
                  </Text>
                ))}
              </View>
            )}

            {/* Answer Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Answer:</Text>
              <TextInput
                style={styles.answerInput}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Type your answer here..."
                autoCapitalize="none"
                autoCorrect={false}
                editable={!showResult && !isCompleted}
              />
            </View>
          </>
        )}

        {/* Action Buttons */}
        {!showResult && !isCompleted && (
          <View style={styles.actionContainer}>
            {isWordPuzzle && (
              <TouchableOpacity
                style={[
                  styles.hintButton,
                  currentHintIndex >= (dailyContent as WordPuzzle).hints.length && styles.disabledButton
                ]}
                onPress={handleGetHint}
                disabled={currentHintIndex >= (dailyContent as WordPuzzle).hints.length}
              >
                <Text style={styles.hintButtonText}>
                  Get Hint ({currentHintIndex}/{(dailyContent as WordPuzzle).hints.length})
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                (isTriviaQuestion && selectedAnswer === null) && styles.disabledButton,
                (isWordPuzzle && !userAnswer.trim()) && styles.disabledButton
              ]}
              onPress={isTriviaQuestion ? handleTriviaSubmit : handleWordPuzzleSubmit}
              disabled={
                (isTriviaQuestion && selectedAnswer === null) ||
                (isWordPuzzle && !userAnswer.trim())
              }
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Result Display */}
        {(showResult || isCompleted) && (
          <View style={styles.resultContainer}>
            <Text style={[
              styles.resultText,
              { color: isCorrect ? '#10b981' : '#ef4444' }
            ]}>
              {isCorrect ? '✅ Correct! Daily puzzle completed!' : '❌ Incorrect'}
            </Text>
            
            {isWordPuzzle && (
              <Text style={styles.correctAnswerText}>
                Correct answer: <Text style={styles.answerHighlight}>{(dailyContent as WordPuzzle).answer}</Text>
              </Text>
            )}
            
            {isCorrect && (
              <Text style={styles.scoreText}>
                +{ScoreUtils.calculateScore(true, dailyContent.difficulty, userStats.currentStreak, true).totalScore} points!
                <Text style={styles.bonusText}> (Daily bonus included!)</Text>
                {isWordPuzzle && hintsUsed > 0 && (
                  <Text style={styles.penaltyText}> (-{hintsUsed} hint penalty)</Text>
                )}
              </Text>
            )}
            
            <Text style={styles.explanationText}>
              {isTriviaQuestion ? (dailyContent as TriviaQuestion).explanation : (dailyContent as WordPuzzle).explanation}
            </Text>
            
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Progress Info */}
      <View style={styles.progressInfo}>
        <Text style={styles.progressTitle}>Your Daily Progress</Text>
        <Text style={styles.progressText}>
          {isCompleted 
            ? "Great job! You've completed today's puzzle. Come back tomorrow for a new challenge!" 
            : "Complete today's special puzzle to earn bonus points and maintain your streak!"
          }
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#64748b',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 10,
  },
  completedBadge: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  completedText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  puzzleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  puzzleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  puzzleTypeText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  bonusContainer: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bonusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  correctOption: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  incorrectOption: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#1e40af',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#047857',
    fontWeight: '600',
  },
  scrambledContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  scrambledLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
  },
  scrambledText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: 3,
  },
  hintsContainer: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  hintsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: '#78350f',
    marginBottom: 5,
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  answerInput: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  hintButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  hintButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 15,
    flex: 2,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 10,
  },
  answerHighlight: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scoreText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  bonusText: {
    color: '#f59e0b',
  },
  penaltyText: {
    color: '#f59e0b',
  },
  explanationText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default DailyPuzzleScreen;