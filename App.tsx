import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './src/types';
import StorageService from './src/services/StorageService';
import LLMService from './src/services/LLMService';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TriviaScreen from './src/screens/TriviaScreen';
import WordPuzzleScreen from './src/screens/WordPuzzleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DailyPuzzleScreen from './src/screens/DailyPuzzleScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    // Initialize services
    const initializeApp = async () => {
      try {
        // Reset daily puzzle status if it's a new day
        await StorageService.getInstance().resetDailyPuzzleIfNewDay();
        
        // Initialize LLM service (placeholder for future implementation)
        await LLMService.getInstance().initialize();
        
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Trivia Puzzle',
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen 
          name="Trivia" 
          component={TriviaScreen}
          options={{ 
            title: 'Trivia Quiz',
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen 
          name="WordPuzzle" 
          component={WordPuzzleScreen}
          options={{ 
            title: 'Word Puzzles',
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            title: 'Settings',
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen 
          name="DailyPuzzle" 
          component={DailyPuzzleScreen}
          options={{ 
            title: 'Daily Puzzle',
            headerTitleAlign: 'center'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}