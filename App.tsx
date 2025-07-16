/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashcardsListScreen from './src/screens/FlashcardsListScreen';
import AddFlashcardScreen from './src/screens/AddFlashcardScreen';
import LoginScreen from './src/screens/LoginScreen';
import SuperAdminScreen from './src/screens/SuperAdminScreen';
import AddUserScreen from './src/screens/AddUserScreen';
import ManageUserFlashcardsScreen from './src/screens/ManageUserFlashcardsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ThankYouScreen from './src/screens/ThankYouScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  FlashcardsList: undefined;
  AddFlashcard: undefined;
  SuperAdmin: undefined;
  AddUser: undefined;
  ManageUserFlashcards: { username: string };
  ThankYou: undefined;
};

export type UserType = { username: string; role: 'admin' | 'user' | 'superadmin' };

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return (
      <NavigationContainer>
        <Stack.Navigator id={undefined}>
          <Stack.Screen name="Welcome" options={{ headerShown: false }}>
            {props => <WelcomeScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} onLogin={u => { setUser(u); setShowWelcome(false); }} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  if (user.role === 'superadmin') {
    return (
      <NavigationContainer>
        <Stack.Navigator id={undefined}>
          <Stack.Screen name="SuperAdmin" options={{ headerShown: false }}>
            {props => <SuperAdminScreen {...props} onLogout={() => setUser(null)} />}
          </Stack.Screen>
          <Stack.Screen name="AddUser" component={AddUserScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ManageUserFlashcards" component={ManageUserFlashcardsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined}>
        <Stack.Screen name="FlashcardsList" options={{ headerShown: false }}>
          {props => <FlashcardsListScreen {...props} user={user} onLogout={() => setUser(null)} />}
        </Stack.Screen>
        {user.role === 'admin' && (
          <Stack.Screen name="AddFlashcard" options={{ headerShown: false }}>
            {props => <AddFlashcardScreen {...props} user={user} />}
          </Stack.Screen>
        )}
        <Stack.Screen name="ThankYou" options={{ headerShown: false }}>
          {props => <ThankYouScreen {...props} onLogout={() => setUser(null)} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
