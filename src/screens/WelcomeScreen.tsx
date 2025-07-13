import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const WelcomeScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to Flashcards App!</Text>
    <Text style={styles.subtitle}>Practice, Learn, and Succeed 🚀</Text>
    <Button title="Get Started" onPress={() => navigation.replace('Login')} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafd', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#007aff', marginBottom: 18, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#333', marginBottom: 32, textAlign: 'center' },
});

export default WelcomeScreen;
