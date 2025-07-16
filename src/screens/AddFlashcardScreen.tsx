import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserType } from '../../App';

const { width } = Dimensions.get('window');

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
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAdd = async () => {
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      Alert.alert('Access Denied', 'Only admins can add flashcards');
      return;
    }
    
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Validation Error', 'Please fill in both question and answer');
      return;
    }

    setIsLoading(true);
    try {
      const data = await AsyncStorage.getItem(SHARED_KEY);
      const flashcards: Flashcard[] = data ? JSON.parse(data) : [];
      flashcards.push({ question: question.trim(), answer: answer.trim() });
      await AsyncStorage.setItem(SHARED_KEY, JSON.stringify(flashcards));
      
      Alert.alert(
        'Success! 🎉', 
        'Flashcard created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create flashcard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6a5acd" />
      
      {/* @ts-ignore */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>✨ Create Flashcard</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>📝 Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your question here..."
              placeholderTextColor="rgba(106, 90, 205, 0.5)"
              value={question}
              onChangeText={setQuestion}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{question.length}/200</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>💡 Answer</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the answer here..."
              placeholderTextColor="rgba(106, 90, 205, 0.5)"
              value={answer}
              onChangeText={setAnswer}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{answer.length}/200</Text>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              (!question.trim() || !answer.trim() || isLoading) && styles.createButtonDisabled
            ]}
            onPress={handleAdd}
            disabled={!question.trim() || !answer.trim() || isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? '⏳ Creating...' : '🚀 Create Flashcard'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for Great Flashcards:</Text>
          <Text style={styles.tipText}>• Keep questions clear and specific</Text>
          <Text style={styles.tipText}>• Make answers concise but complete</Text>
          <Text style={styles.tipText}>• Use simple language that's easy to understand</Text>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#6a5acd',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholder: {
    width: 80,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a5acd',
    marginBottom: 12,
  },
  input: { 
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    maxHeight: 120,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  charCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#adb5bd',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default AddFlashcardScreen;
