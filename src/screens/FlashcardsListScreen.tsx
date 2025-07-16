import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserType } from '../../App';

interface FlashcardsListScreenProps {
  user: UserType;
  navigation: any;
  onLogout: () => void;
}

type Flashcard = {
  question: string;
  answer: string;
};

const SHARED_KEY = 'FLASHCARDS_SHARED';
const CARD_WIDTH = Math.min(Dimensions.get('window').width - 40, 400);

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const FlashcardsListScreen: React.FC<FlashcardsListScreenProps> = ({ user, navigation, onLogout }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const animatedValues = useRef<{ [key: number]: Animated.Value }>({}).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const STORAGE_KEY = `FLASHCARDS_${user.username}`;

  useEffect(() => {
    const loadFlashcards = async () => {
      if (user.role === 'user') {
        // Load both shared and user-specific flashcards
        const [sharedData, userData] = await Promise.all([
          AsyncStorage.getItem(SHARED_KEY),
          AsyncStorage.getItem(STORAGE_KEY),
        ]);
        const sharedCards: Flashcard[] = sharedData ? JSON.parse(sharedData) : [];
        const userCards: Flashcard[] = userData ? JSON.parse(userData) : [];
        // Merge, shared first, then user-specific
        const merged = shuffle([...sharedCards, ...userCards]);
        setFlashcards(merged);
      } else if (user.role === 'admin') {
        // Admin sees and manages shared flashcards
        const sharedData = await AsyncStorage.getItem(SHARED_KEY);
        const sharedCards: Flashcard[] = sharedData ? JSON.parse(sharedData) : [];
        setFlashcards(sharedCards);
      } else {
        // Superadmin: show only user-specific (or adjust as needed)
        const userData = await AsyncStorage.getItem(STORAGE_KEY);
        const userCards: Flashcard[] = userData ? JSON.parse(userData) : [];
        setFlashcards(userCards);
      }
      setCurrent(0);
      setFlipped({});
    };
    const unsubscribe = navigation.addListener('focus', loadFlashcards);
    loadFlashcards();
    return unsubscribe;
  }, [navigation, user.role, user.username, STORAGE_KEY]);

  useEffect(() => {
    if (flashcards.length > 0 && !animatedValues[current]) {
      animatedValues[current] = new Animated.Value(0);
    }
  }, [flashcards, current]);

  const handleFlip = (idx: number) => {
    const isFlipped = flipped[idx];
    Animated.timing(animatedValues[idx], {
      toValue: isFlipped ? 0 : 180,
      duration: 400,
      useNativeDriver: true,
    }).start();
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDelete = async (idx: number) => {
    if (user.role !== 'admin') return;
    const newFlashcards = flashcards.filter((_, i) => i !== idx);
    setFlashcards(newFlashcards);
    await AsyncStorage.setItem(SHARED_KEY, JSON.stringify(newFlashcards));
    delete animatedValues[idx];
    setFlipped((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
    if (current >= newFlashcards.length && newFlashcards.length > 0) {
      setCurrent(newFlashcards.length - 1);
    }
  };

  const handleNext = () => {
    if (current < flashcards.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -CARD_WIDTH, // slide left
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrent(c => c + 1);
        resetCurrentAnswer();
        slideAnim.setValue(CARD_WIDTH); // start from right
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      Animated.timing(slideAnim, {
        toValue: CARD_WIDTH, // slide right
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrent(c => c - 1);
        resetCurrentAnswer();
        slideAnim.setValue(-CARD_WIDTH); // start from left
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      Alert.alert('No Answer', 'Please enter your answer before submitting.');
      return;
    }

    const trimmedAnswer = currentAnswer.trim().toLowerCase();
    const correctAnswer = flashcards[current].answer.trim().toLowerCase();
    const isCorrect = trimmedAnswer === correctAnswer;

    // Store the user's answer
    setUserAnswers(prev => ({ ...prev, [current]: currentAnswer.trim() }));
    setAnswerSubmitted(prev => ({ ...prev, [current]: true }));

    // Update score
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Auto-flip the card to show the answer
    handleFlip(current);
  };

  const getAnswerStatus = (idx: number) => {
    if (!answerSubmitted[idx]) return null;
    
    const userAnswer = userAnswers[idx]?.toLowerCase().trim();
    const correctAnswer = flashcards[idx].answer.toLowerCase().trim();
    return userAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const resetCurrentAnswer = () => {
    setCurrentAnswer('');
  };

  // Reset answer when navigating to a new card
  useEffect(() => {
    setCurrentAnswer(userAnswers[current] || '');
  }, [current, userAnswers]);

  if (flashcards.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6a5acd" />
        
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>📚 Flashcards</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyTitle}>Ready to Learn?</Text>
          <Text style={styles.emptyMessage}>No flashcards yet. {user.role === 'admin' ? 'Create your first one!' : 'Ask an admin to add some!'}</Text>
          
          {user.role === 'admin' && (
            <TouchableOpacity 
              style={styles.addFirstBtn} 
              onPress={() => navigation.navigate('AddFlashcard')}
            >
              <Text style={styles.addFirstBtnText}>✨ Create First Flashcard</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const idx = current;
  const item = flashcards[idx];
  const animatedValue = animatedValues[idx] || new Animated.Value(0);
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const progress = ((current + 1) / flashcards.length) * 100;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6a5acd" />
      
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>📚 Flashcards</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Score Display - Only show for regular users */}
      {score.total > 0 && user.role === 'user' && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
          </Text>
        </View>
      )}

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{current + 1} / {flashcards.length}</Text>
      </View>

      {/* @ts-ignore */}
      <Animated.View style={{ transform: [{ translateX: slideAnim }], alignSelf: 'center' }}>
        <View style={[styles.cardWrapper, { width: CARD_WIDTH }]}> 
          {user.role === 'admin' && (
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(idx)}>
              <Text style={styles.deleteBtnText}>❌</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleFlip(idx)} activeOpacity={0.8}>
            <View style={styles.flipContainer}>
              {/* @ts-ignore */}
      <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardFront,
                  {
                    transform: [
                      { perspective: 1000 },
                      { rotateY: frontInterpolate }
                    ],
                    zIndex: flipped[idx] ? 0 : 1,
                  },
                ]}
              >
                <Text style={styles.cardLabel}>Question</Text>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.tapHint}>👆 Tap to reveal answer</Text>
              </Animated.View>
              {/* @ts-ignore */}
      <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardBack,
                  {
                    transform: [
                      { perspective: 1000 },
                      { rotateY: backInterpolate }
                    ],
                    zIndex: flipped[idx] ? 1 : 0,
                  },
                ]}
              >
                <Text style={styles.answerLabel}>Answer</Text>
                <Text style={styles.answer}>{item.answer}</Text>
                
                {/* Show answer status if submitted and user is regular user */}
                {answerSubmitted[idx] && user.role === 'user' && (
                  <View style={styles.answerStatusContainer}>
                    <Text style={styles.answerStatusLabel}>Your Answer:</Text>
                    <Text style={styles.userAnswerText}>{userAnswers[idx]}</Text>
                    <View style={[
                      styles.statusBadge,
                      getAnswerStatus(idx) === 'correct' ? styles.correctBadge : styles.incorrectBadge
                    ]}>
                      <Text style={styles.statusText}>
                        {getAnswerStatus(idx) === 'correct' ? '✅ Correct!' : '❌ Incorrect'}
                      </Text>
                    </View>
                  </View>
                )}
                
                <Text style={styles.tapHint}>👆 Tap to see question</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Answer Input Section - Only show for regular users, not admin/superadmin */}
      {!flipped[idx] && !answerSubmitted[idx] && user.role === 'user' && (
        <View style={styles.answerInputContainer}>
          <Text style={styles.inputLabel}>💭 Your Answer:</Text>
          <TextInput
            style={styles.answerInput}
            placeholder="Type your answer here..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
            multiline
            maxLength={200}
          />
          <TouchableOpacity
            style={[
              styles.submitBtn,
              !currentAnswer.trim() && styles.submitBtnDisabled
            ]}
            onPress={handleSubmitAnswer}
            disabled={!currentAnswer.trim()}
          >
            <Text style={styles.submitBtnText}>✅ Submit Answer</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.navBtn, styles.prevBtn, current === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={current === 0}
        >
          <Text style={styles.navBtnText}>← Previous</Text>
        </TouchableOpacity>
        {current < flashcards.length - 1 ? (
          <TouchableOpacity
            style={[styles.navBtn, styles.nextBtn, current === flashcards.length - 1 && styles.navBtnDisabled]}
            onPress={handleNext}
            disabled={current === flashcards.length - 1}
          >
            <Text style={styles.navBtnText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtn, styles.finishBtn]}
            onPress={() => navigation.replace('ThankYou')}
          >
            <Text style={styles.navBtnText}>🏆 Finish</Text>
          </TouchableOpacity>
        )}
      </View>

      {user.role === 'admin' && (
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddFlashcard')}>
          <Text style={styles.addBtnText}>✨ Add Flashcard</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#6a5acd' 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#ffffff' 
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  addFirstBtn: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addFirstBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressBarContainer: { 
    marginBottom: 24, 
    alignItems: 'center',
    zIndex: 1,
  },
  progressBarBg: { 
    width: '80%', 
    height: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 5, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: 10, 
    backgroundColor: '#ff6b6b', 
    borderRadius: 5 
  },
  progressText: { 
    marginTop: 8, 
    color: '#ffffff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    minHeight: 240,
    padding: 0,
    zIndex: 1,
    marginHorizontal: 10,
  },
  flipContainer: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFace: {
    width: '100%',
    height: 220,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    justifyContent: 'space-between',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardFront: {
    zIndex: 2,
    borderColor: '#6a5acd',
    borderWidth: 3,
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: 'rgba(232, 245, 232, 0.98)',
    zIndex: 1,
    transform: [{ rotateY: '180deg' }],
    borderColor: '#4caf50',
    borderWidth: 3,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a5acd',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(106, 90, 205, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    alignSelf: 'center',
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(46, 125, 50, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    alignSelf: 'center',
  },
  question: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 30,
    flex: 1,
    display: 'flex',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  answer: {
    color: '#1a5f1a',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    flex: 1,
    display: 'flex',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    minHeight: 80,
  },
  tapHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
    backgroundColor: 'rgba(106, 90, 205, 0.1)',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    minWidth: 160,
    marginTop: 8,
  },
  deleteBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deleteBtnText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  navBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  prevBtn: {
    backgroundColor: '#ff9800',
  },
  nextBtn: {
    backgroundColor: '#2196f3',
  },
  finishBtn: {
    backgroundColor: '#4caf50',
  },
  navBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  navBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignSelf: 'center',
    zIndex: 1,
  },
  scoreText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  answerInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  answerInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  answerStatusContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4caf50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 5,
  },
  answerStatusLabel: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userAnswerText: {
    color: '#333333',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  correctBadge: {
    backgroundColor: '#4caf50',
  },
  incorrectBadge: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default FlashcardsListScreen;
