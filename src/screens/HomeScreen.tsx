import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, UserStats } from '../types';
import StorageService from '../services/StorageService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isDailyCompleted, setIsDailyCompleted] = useState(false);

  const loadUserData = async () => {
    try {
      const userStats = await StorageService.getInstance().getUserStats();
      const dailyCompleted = await StorageService.getInstance().isDailyPuzzleCompleted();
      
      setStats(userStats);
      setIsDailyCompleted(dailyCompleted);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trivia Puzzle</Text>
        <Text style={styles.subtitle}>Test your knowledge offline</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalScore}</Text>
          <Text style={styles.statLabel}>Total Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.correctAnswers}</Text>
          <Text style={styles.statLabel}>Correct Answers</Text>
        </View>
      </View>

      {/* Game Modes */}
      <View style={styles.gameModesContainer}>
        {/* Daily Puzzle */}
        <TouchableOpacity
          style={[
            styles.gameModeButton,
            styles.dailyPuzzleButton,
            isDailyCompleted && styles.completedButton
          ]}
          onPress={() => navigation.navigate('DailyPuzzle')}
        >
          <View style={styles.gameModeContent}>
            <Text style={styles.gameModeTitle}>Daily Puzzle</Text>
            <Text style={styles.gameModeSubtitle}>
              {isDailyCompleted ? '✓ Completed today' : 'Special daily challenge'}
            </Text>
          </View>
          <Text style={styles.gameModeIcon}>🏆</Text>
        </TouchableOpacity>

        {/* Trivia Quiz */}
        <TouchableOpacity
          style={[styles.gameModeButton, styles.triviaButton]}
          onPress={() => navigation.navigate('Trivia')}
        >
          <View style={styles.gameModeContent}>
            <Text style={styles.gameModeTitle}>Trivia Quiz</Text>
            <Text style={styles.gameModeSubtitle}>Multiple choice questions</Text>
          </View>
          <Text style={styles.gameModeIcon}>🧠</Text>
        </TouchableOpacity>

        {/* Word Puzzles */}
        <TouchableOpacity
          style={[styles.gameModeButton, styles.wordPuzzleButton]}
          onPress={() => navigation.navigate('WordPuzzle')}
        >
          <View style={styles.gameModeContent}>
            <Text style={styles.gameModeTitle}>Word Puzzles</Text>
            <Text style={styles.gameModeSubtitle}>Riddles and word games</Text>
          </View>
          <Text style={styles.gameModeIcon}>🔤</Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          style={[styles.gameModeButton, styles.settingsButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.gameModeContent}>
            <Text style={styles.gameModeTitle}>Settings</Text>
            <Text style={styles.gameModeSubtitle}>Configure your game</Text>
          </View>
          <Text style={styles.gameModeIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Summary */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Your Progress</Text>
        <View style={styles.progressStats}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Total Questions</Text>
            <Text style={styles.progressValue}>{stats.totalQuestions}</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Accuracy</Text>
            <Text style={styles.progressValue}>
              {stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                : 0}%
            </Text>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  gameModesContainer: {
    marginBottom: 30,
  },
  gameModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyPuzzleButton: {
    backgroundColor: '#6366f1',
  },
  triviaButton: {
    backgroundColor: '#ec4899',
  },
  wordPuzzleButton: {
    backgroundColor: '#10b981',
  },
  settingsButton: {
    backgroundColor: '#8b5cf6',
  },
  completedButton: {
    opacity: 0.7,
  },
  gameModeContent: {
    flex: 1,
  },
  gameModeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  gameModeSubtitle: {
    fontSize: 14,
    color: '#f1f5f9',
  },
  gameModeIcon: {
    fontSize: 32,
  },
  progressContainer: {
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
    marginBottom: 15,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default HomeScreen;