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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, WordPuzzle, Difficulty, UserStats } from '../types';
import { puzzleData } from '../data';
import { ScoreUtils, TextUtils, ValidationUtils } from '../utils';
import StorageService from '../services/StorageService';

type WordPuzzleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WordPuzzle'>;
type WordPuzzleScreenRouteProp = RouteProp<RootStackParamList, 'WordPuzzle'>;

const WordPuzzleScreen: React.FC = () => {
  const navigation = useNavigation<WordPuzzleScreenNavigationProp>();
  const route = useRoute<WordPuzzleScreenRouteProp>();
  
  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const stats = await StorageService.getInstance().getUserStats();
      const settings = await StorageService.getInstance().getGameSettings();
      
      setUserStats(stats);
      
      // Use difficulty from route params or settings
      const targetDifficulty = route.params?.difficulty || settings.difficulty;
      setDifficulty(targetDifficulty);
      
      loadNewPuzzle(targetDifficulty);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load game data');
    }
  };

  const loadNewPuzzle = (targetDifficulty: Difficulty) => {
    const puzzle = puzzleData.getRandomWordPuzzle(targetDifficulty);
    if (!puzzle) {
      Alert.alert('Error', 'No puzzles available for this difficulty');
      return;
    }
    
    setCurrentPuzzle(puzzle);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setCurrentHintIndex(0);
    setHintsUsed(0);
  };

  const handleAnswerSubmit = async () => {
    if (!currentPuzzle || !userStats) return;

    const validation = ValidationUtils.validateAnswerInput(userAnswer);
    if (!validation.isValid) {
      Alert.alert('Invalid Input', validation.message);
      return;
    }

    const correct = TextUtils.answersMatch(userAnswer, currentPuzzle.answer);
    setIsCorrect(correct);
    setShowResult(true);

    // Calculate score (reduced for hints used)
    let scoreResult = ScoreUtils.calculateScore(
      correct,
      currentPuzzle.difficulty,
      userStats.currentStreak
    );

    // Reduce score for hints used
    if (hintsUsed > 0) {
      const hintPenalty = Math.floor(scoreResult.points * 0.2 * hintsUsed);
      scoreResult.points = Math.max(1, scoreResult.points - hintPenalty);
      scoreResult.totalScore = scoreResult.points + scoreResult.streakBonus;
    }

    // Update user stats
    try {
      const updatedStats = await StorageService.getInstance().updateStats(
        correct,
        scoreResult.points,
        scoreResult.streakBonus,
        true // isPuzzle = true
      );
      setUserStats(updatedStats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handleNextPuzzle = () => {
    loadNewPuzzle(difficulty);
  };

  const handleChangeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    loadNewPuzzle(newDifficulty);
  };

  const handleGetHint = () => {
    if (!currentPuzzle || currentHintIndex >= currentPuzzle.hints.length) return;
    
    setCurrentHintIndex(currentHintIndex + 1);
    setHintsUsed(hintsUsed + 1);
  };

  const getPuzzleTypeDisplay = (type: string) => {
    switch (type) {
      case 'riddle': return '🤔 Riddle';
      case 'scrambled': return '🔀 Scrambled Word';
      case 'anagram': return '🔄 Anagram';
      default: return '🧩 Puzzle';
    }
  };

  const getScrambledDisplay = (puzzle: WordPuzzle) => {
    if (puzzle.type === 'scrambled') {
      return TextUtils.scrambleText(puzzle.answer);
    }
    return null;
  };

  if (!currentPuzzle || !userStats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading puzzle...</Text>
      </View>
    );
  }

  const scrambledWord = getScrambledDisplay(currentPuzzle);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Difficulty Selector */}
      <View style={styles.difficultyContainer}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
          <TouchableOpacity
            key={diff}
            style={[
              styles.difficultyButton,
              difficulty === diff && styles.activeDifficultyButton,
              { backgroundColor: ScoreUtils.getDifficultyColor(diff) }
            ]}
            onPress={() => handleChangeDifficulty(diff)}
          >
            <Text style={styles.difficultyText}>
              {ScoreUtils.getDifficultyIcon(diff)} {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Puzzle Card */}
      <View style={styles.puzzleCard}>
        <View style={styles.puzzleHeader}>
          <Text style={styles.puzzleTypeText}>{getPuzzleTypeDisplay(currentPuzzle.type)}</Text>
          <Text style={[
            styles.difficultyBadge,
            { backgroundColor: ScoreUtils.getDifficultyColor(currentPuzzle.difficulty) }
          ]}>
            {currentPuzzle.difficulty.toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.puzzleText}>{currentPuzzle.question}</Text>
        
        {/* Scrambled word display for scrambled puzzles */}
        {scrambledWord && (
          <View style={styles.scrambledContainer}>
            <Text style={styles.scrambledLabel}>Scrambled letters:</Text>
            <Text style={styles.scrambledText}>{scrambledWord.toUpperCase()}</Text>
          </View>
        )}

        {/* Hints Section */}
        {currentHintIndex > 0 && (
          <View style={styles.hintsContainer}>
            <Text style={styles.hintsTitle}>Hints:</Text>
            {currentPuzzle.hints.slice(0, currentHintIndex).map((hint, index) => (
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
            editable={!showResult}
          />
        </View>

        {/* Action Buttons */}
        {!showResult ? (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.hintButton,
                currentHintIndex >= currentPuzzle.hints.length && styles.disabledButton
              ]}
              onPress={handleGetHint}
              disabled={currentHintIndex >= currentPuzzle.hints.length}
            >
              <Text style={styles.hintButtonText}>
                Get Hint ({currentHintIndex}/{currentPuzzle.hints.length})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                !userAnswer.trim() && styles.disabledButton
              ]}
              onPress={handleAnswerSubmit}
              disabled={!userAnswer.trim()}
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={[
              styles.resultText,
              { color: isCorrect ? '#10b981' : '#ef4444' }
            ]}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </Text>
            
            <Text style={styles.correctAnswerText}>
              Correct answer: <Text style={styles.answerHighlight}>{currentPuzzle.answer}</Text>
            </Text>
            
            {isCorrect && (
              <Text style={styles.scoreText}>
                +{ScoreUtils.calculateScore(true, currentPuzzle.difficulty, userStats.currentStreak).totalScore} points!
                {hintsUsed > 0 && (
                  <Text style={styles.penaltyText}> (-{hintsUsed} hint penalty)</Text>
                )}
                {userStats.currentStreak >= 3 && (
                  <Text style={styles.bonusText}>
                    {' '}{ScoreUtils.getStreakBonusText(userStats.currentStreak + 1)}
                  </Text>
                )}
              </Text>
            )}
            
            <Text style={styles.explanationText}>{currentPuzzle.explanation}</Text>
            
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextPuzzle}
            >
              <Text style={styles.nextButtonText}>Next Puzzle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Stats Display */}
      <View style={styles.statsDisplay}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{userStats.totalScore}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{userStats.currentStreak}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={styles.statValue}>
            {userStats.totalQuestions > 0 
              ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100)
              : 0}%
          </Text>
        </View>
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
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  difficultyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  activeDifficultyButton: {
    transform: [{ scale: 1.1 }],
  },
  difficultyText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  puzzleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  puzzleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  puzzleTypeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  puzzleText: {
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 24,
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
    padding: 12,
    flex: 1,
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
  },
  penaltyText: {
    color: '#f59e0b',
  },
  bonusText: {
    color: '#f59e0b',
  },
  explanationText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default WordPuzzleScreen;