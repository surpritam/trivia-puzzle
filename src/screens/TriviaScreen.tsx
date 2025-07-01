import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TriviaQuestion, Difficulty, UserStats } from '../types';
import { puzzleData } from '../data';
import { ScoreUtils } from '../utils';
import StorageService from '../services/StorageService';

type TriviaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Trivia'>;
type TriviaScreenRouteProp = RouteProp<RootStackParamList, 'Trivia'>;

const TriviaScreen: React.FC = () => {
  const navigation = useNavigation<TriviaScreenNavigationProp>();
  const route = useRoute<TriviaScreenRouteProp>();
  
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

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
      
      loadNewQuestion(targetDifficulty);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load game data');
    }
  };

  const loadNewQuestion = (targetDifficulty: Difficulty) => {
    const question = puzzleData.getRandomTriviaQuestion(targetDifficulty);
    if (!question) {
      Alert.alert('Error', 'No questions available for this difficulty');
      return;
    }
    
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion || !userStats) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Calculate score
    const scoreResult = ScoreUtils.calculateScore(
      correct,
      currentQuestion.difficulty,
      userStats.currentStreak
    );

    // Update user stats
    try {
      const updatedStats = await StorageService.getInstance().updateStats(
        correct,
        scoreResult.points,
        scoreResult.streakBonus,
        false // isTrivia = false means this is trivia, not word puzzle
      );
      setUserStats(updatedStats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handleNextQuestion = () => {
    loadNewQuestion(difficulty);
  };

  const handleChangeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    loadNewQuestion(newDifficulty);
  };

  if (!currentQuestion || !userStats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading question...</Text>
      </View>
    );
  }

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

      {/* Question Card */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          <Text style={[
            styles.difficultyBadge,
            { backgroundColor: ScoreUtils.getDifficultyColor(currentQuestion.difficulty) }
          ]}>
            {currentQuestion.difficulty.toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                showResult && index === currentQuestion.correctAnswer && styles.correctOption,
                showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && styles.incorrectOption,
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
                showResult && index === currentQuestion.correctAnswer && styles.correctOptionText,
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        {!showResult ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedAnswer === null && styles.disabledButton
            ]}
            onPress={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={[
              styles.resultText,
              { color: isCorrect ? '#10b981' : '#ef4444' }
            ]}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </Text>
            
            {isCorrect && (
              <Text style={styles.scoreText}>
                +{ScoreUtils.calculateScore(true, currentQuestion.difficulty, userStats.currentStreak).totalScore} points!
                {userStats.currentStreak >= 3 && (
                  <Text style={styles.bonusText}>
                    {' '}{ScoreUtils.getStreakBonusText(userStats.currentStreak + 1)}
                  </Text>
                )}
              </Text>
            )}
            
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>Next Question</Text>
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
  questionCard: {
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
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryText: {
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
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 15,
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
  scoreText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 10,
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

export default TriviaScreen;