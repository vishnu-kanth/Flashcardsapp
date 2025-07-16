import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a5acd" />
      
      {/* @ts-ignore */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.heroIcon}>🎓</Text>
          </View>
          
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>Flashcards App!</Text>
          <Text style={styles.subtitle}>
            Practice, Learn, and Succeed 🚀{'\n'}
            Your journey to knowledge starts here
          </Text>
        </View>

        {/* Feature highlights */}
        <View style={styles.featuresContainer}>
          {[
            { icon: '📖', text: 'Interactive Learning' },
            { icon: '🏆', text: 'Track Progress' },
            { icon: '🎯', text: 'Achieve Goals' }
          ].map((feature, index) => (
            <View
              key={index}
              style={styles.featureItem}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>🚀 Get Started</Text>
        </TouchableOpacity>

        {/* Decorative footer */}
        <Text style={styles.footerText}>Begin Your Learning Adventure</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#6a5acd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    width: '100%',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroIcon: {
    fontSize: 60,
  },
  title: { 
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: { 
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 50,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 60,
    paddingHorizontal: 16,
  },
  featureItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    width: (width - 80) / 3, // Equal width for all three items
    height: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  getStartedButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    minWidth: 250,
  },
  getStartedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default WelcomeScreen;
