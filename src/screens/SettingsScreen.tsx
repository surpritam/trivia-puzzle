import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, GameSettings, UserStats, Difficulty } from '../types';
import { ScoreUtils, DateUtils } from '../utils';
import { puzzleData } from '../data';
import StorageService from '../services/StorageService';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [contentStats, setContentStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const gameSettings = await StorageService.getInstance().getGameSettings();
      const userStats = await StorageService.getInstance().getUserStats();
      const dataStats = puzzleData.getContentStats();
      
      setSettings(gameSettings);
      setStats(userStats);
      setContentStats(dataStats);
    } catch (error) {
      console.error('Error loading settings data:', error);
      Alert.alert('Error', 'Failed to load settings');
    }
  };

  const updateSetting = async <K extends keyof GameSettings>(
    key: K, 
    value: GameSettings[K]
  ) => {
    if (!settings) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await StorageService.getInstance().saveGameSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.getInstance().clearAllData();
              Alert.alert('Success', 'Progress has been reset');
              navigation.navigate('Home');
            } catch (error) {
              console.error('Error resetting progress:', error);
              Alert.alert('Error', 'Failed to reset progress');
            }
          }
        }
      ]
    );
  };

  if (!settings || !stats || !contentStats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Game Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings</Text>
        
        {/* Difficulty Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Default Difficulty</Text>
          <View style={styles.difficultySelector}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyOption,
                  settings.difficulty === diff && styles.selectedDifficulty,
                  { backgroundColor: ScoreUtils.getDifficultyColor(diff) }
                ]}
                onPress={() => updateSetting('difficulty', diff)}
              >
                <Text style={styles.difficultyText}>
                  {ScoreUtils.getDifficultyIcon(diff)} {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sound Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(value) => updateSetting('soundEnabled', value)}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={settings.soundEnabled ? '#ffffff' : '#9ca3af'}
          />
        </View>

        {/* Vibration Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Vibration</Text>
          <Switch
            value={settings.vibrationEnabled}
            onValueChange={(value) => updateSetting('vibrationEnabled', value)}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={settings.vibrationEnabled ? '#ffffff' : '#9ca3af'}
          />
        </View>

        {/* Dark Mode Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={settings.darkMode ? '#ffffff' : '#9ca3af'}
          />
        </View>

        {/* Hints Setting */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Hints</Text>
          <Switch
            value={settings.hintsEnabled}
            onValueChange={(value) => updateSetting('hintsEnabled', value)}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={settings.hintsEnabled ? '#ffffff' : '#9ca3af'}
          />
        </View>
      </View>

      {/* Progress Statistics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalScore}</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.correctAnswers}</Text>
            <Text style={styles.statLabel}>Correct Answers</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalQuestions}</Text>
            <Text style={styles.statLabel}>Total Questions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                : 0}%
            </Text>
            <Text style={styles.statLabel}>Overall Accuracy</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {DateUtils.isToday(stats.lastPlayedDate) ? 'Today' : DateUtils.formatDate(stats.lastPlayedDate)}
            </Text>
            <Text style={styles.statLabel}>Last Played</Text>
          </View>
        </View>
      </View>

      {/* Content Statistics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Content</Text>
        
        <View style={styles.contentStats}>
          <View style={styles.contentStatItem}>
            <Text style={styles.contentStatLabel}>Total Trivia Questions</Text>
            <Text style={styles.contentStatValue}>{contentStats.totalTrivia}</Text>
          </View>
          
          <View style={styles.contentStatItem}>
            <Text style={styles.contentStatLabel}>Total Word Puzzles</Text>
            <Text style={styles.contentStatValue}>{contentStats.totalPuzzles}</Text>
          </View>
          
          <View style={styles.contentStatItem}>
            <Text style={styles.contentStatLabel}>Total Content</Text>
            <Text style={styles.contentStatValue}>{contentStats.totalContent}</Text>
          </View>

          {/* Difficulty Breakdown */}
          <View style={styles.difficultyBreakdown}>
            <Text style={styles.breakdownTitle}>By Difficulty:</Text>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <View key={diff} style={styles.difficultyBreakdownItem}>
                <Text style={[
                  styles.difficultyBreakdownLabel,
                  { color: ScoreUtils.getDifficultyColor(diff) }
                ]}>
                  {ScoreUtils.getDifficultyIcon(diff)} {diff.charAt(0).toUpperCase() + diff.slice(1)}:
                </Text>
                <Text style={styles.difficultyBreakdownValue}>
                  {contentStats.triviaByDifficulty[diff]} trivia, {contentStats.puzzlesByDifficulty[diff]} puzzles
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.actionButtonText}>🏠 Back to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={handleResetProgress}
        >
          <Text style={[styles.actionButtonText, styles.resetButtonText]}>🔄 Reset All Progress</Text>
        </TouchableOpacity>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Trivia Puzzle Game v1.0.0{'\n'}
            Built with React Native & TypeScript{'\n'}
            Offline-first design with local storage{'\n'}
            {'\n'}
            Ready for AI integration with LLM service interface.
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
  section: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedDifficulty: {
    transform: [{ scale: 1.1 }],
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
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
  contentStats: {
    gap: 10,
  },
  contentStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contentStatLabel: {
    fontSize: 14,
    color: '#374151',
  },
  contentStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  difficultyBreakdown: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  difficultyBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  difficultyBreakdownLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBreakdownValue: {
    fontSize: 12,
    color: '#64748b',
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ef4444',
  },
  resetButtonText: {
    color: '#ffffff',
  },
  infoContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default SettingsScreen;