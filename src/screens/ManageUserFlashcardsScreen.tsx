import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Flashcard = { question: string; answer: string };

const ManageUserFlashcardsScreen = ({ route, navigation }: any) => {
  const { username } = route.params;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const normalizedUsername = username.trim().toLowerCase();
  const STORAGE_KEY = `FLASHCARDS_${normalizedUsername}`;

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      setFlashcards(data ? JSON.parse(data) : []);
    };
    load();
  }, [STORAGE_KEY]);

  const handleAdd = async () => {
    if (!question || !answer) return;
    const newCards = [...flashcards, { question, answer }];
    setFlashcards(newCards);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
    setQuestion('');
    setAnswer('');
  };

  const handleDelete = async (idx: number) => {
    const newCards = flashcards.filter((_, i) => i !== idx);
    setFlashcards(newCards);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards for {normalizedUsername}</Text>
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
      <Button title="Add Flashcard" onPress={handleAdd} />
      <FlatList
        data={flashcards}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cardRow}>
            <View style={styles.cardBox}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(index)}>
              <Text style={styles.deleteBtn}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafd' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 18, color: '#007aff' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardBox: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 14, marginRight: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  question: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  answer: { color: '#00796b', fontSize: 16, fontWeight: '600', marginTop: 4 },
  deleteBtn: { color: '#c00', fontWeight: 'bold', fontSize: 22, padding: 4 },
});

export default ManageUserFlashcardsScreen;
