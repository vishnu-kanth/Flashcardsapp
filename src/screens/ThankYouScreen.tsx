import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

interface ThankYouScreenProps {
  navigation: any;
  onLogout: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ navigation, onLogout }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Congratulations! 🎉</Text>
    <Text style={styles.subtitle}>You have completed all the flashcards. Great job!</Text>
    <Button title="Go to Home" onPress={onLogout} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafd', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#00c853', marginBottom: 18, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#333', marginBottom: 32, textAlign: 'center' },
});

export default ThankYouScreen;
