import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserType } from '../../App';

interface AddFlashcardScreenProps {
  user: UserType;
  navigation: any;
}

type Flashcard = {
  question: string;
  answer: string;
};

const SHARED_KEY = 'FLASHCARDS_SHARED';

const AddFlashcardScreen: React.FC<AddFlashcardScreenProps> = ({ user, navigation }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAdd = async () => {
    if (user.role !== 'admin') {
      Alert.alert('Only admin can add flashcards');
      return;
    }
    if (!question || !answer) return;
    const data = await AsyncStorage.getItem(SHARED_KEY);
    const flashcards: Flashcard[] = data ? JSON.parse(data) : [];
    flashcards.push({ question, answer });
    await AsyncStorage.setItem(SHARED_KEY, JSON.stringify(flashcards));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Flashcard</Text>
      <TextInput
        style={styles.input}
        placeholder="Question"
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        style={styles.input}
        placeholder="Answer"
        value={answer}
        onChangeText={setAnswer}
      />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 18 },
});

export default AddFlashcardScreen;
