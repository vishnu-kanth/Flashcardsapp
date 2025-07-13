import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserType } from '../../App';
import { Animated as RNAnimated } from 'react-native';

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
  const animatedValues = useRef<{ [key: number]: Animated.Value }>({}).current;
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
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
      RNAnimated.timing(slideAnim, {
        toValue: -CARD_WIDTH, // slide left
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrent(c => c + 1);
        slideAnim.setValue(CARD_WIDTH); // start from right
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      RNAnimated.timing(slideAnim, {
        toValue: CARD_WIDTH, // slide right
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrent(c => c - 1);
        slideAnim.setValue(-CARD_WIDTH); // start from left
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  if (flashcards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Flashcards</Text>
          <Button title="Logout" onPress={onLogout} />
        </View>
        <Text style={styles.empty}>No flashcards yet.</Text>
        {user.role === 'admin' && (
          <Button title="Add Flashcard" onPress={() => navigation.navigate('AddFlashcard')} />
        )}
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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <Button title="Logout" onPress={onLogout} />
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{current + 1} / {flashcards.length}</Text>
      </View>
      <RNAnimated.View style={{ transform: [{ translateX: slideAnim }], alignSelf: 'center' }}>
        <View style={[styles.cardWrapper, { width: CARD_WIDTH }]}> 
          {user.role === 'admin' && (
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(idx)}>
              <Text style={{ color: '#c00', fontWeight: 'bold', fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleFlip(idx)} activeOpacity={0.8}>
            <View style={styles.flipContainer}>
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
                <Text style={styles.question}>{item.question}</Text>
              </Animated.View>
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
                <Text style={styles.answer}>{item.answer}</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </RNAnimated.View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.navBtn, current === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={current === 0}
        >
          <Text style={styles.navBtnText}>Previous</Text>
        </TouchableOpacity>
        {current < flashcards.length - 1 ? (
          <TouchableOpacity
            style={[styles.navBtn, current === flashcards.length - 1 && styles.navBtnDisabled]}
            onPress={handleNext}
            disabled={current === flashcards.length - 1}
          >
            <Text style={styles.navBtnText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: '#00c853' }]}
            onPress={() => navigation.replace('ThankYou')}
          >
            <Text style={styles.navBtnText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
      {user.role === 'admin' && (
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddFlashcard')}>
          <Text style={styles.addBtnText}>+ Add Flashcard</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafd' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#007aff' },
  progressBarContainer: { marginBottom: 18, alignItems: 'center' },
  progressBarBg: { width: '80%', height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#007aff', borderRadius: 4 },
  progressText: { marginTop: 4, color: '#007aff', fontWeight: 'bold' },
  cardWrapper: {
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#007aff',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 160,
    padding: 0,
  },
  flipContainer: {
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFace: {
    width: '100%',
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#007aff',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding: 18,
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    backgroundColor: '#e6f7ff',
    zIndex: 1,
    transform: [{ rotateY: '180deg' }],
  },
  question: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  answer: {
    color: '#00796b',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  navBtn: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 0,
    marginBottom: 0,
    shadowColor: '#007aff',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  navBtnDisabled: {
    backgroundColor: '#b0c4d6',
  },
  navBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#00c853',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 18,
    shadowColor: '#00c853',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  empty: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 18 },
});

export default FlashcardsListScreen;
