import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  StatusBar 
} from 'react-native';

interface ThankYouScreenProps {
  navigation: any;
  onLogout: () => void;
}

const { width, height } = Dimensions.get('window');

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ navigation, onLogout }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const trophyRotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Confetti animations
  const confetti1 = useRef(new Animated.Value(0)).current;
  const confetti2 = useRef(new Animated.Value(0)).current;
  const confetti3 = useRef(new Animated.Value(0)).current;
  const confetti4 = useRef(new Animated.Value(0)).current;
  const confetti5 = useRef(new Animated.Value(0)).current;
  const confetti6 = useRef(new Animated.Value(0)).current;

  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
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

    // Trophy rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyRotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(trophyRotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for title
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle bounce animation for title
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Confetti celebration animations
    const startConfetti = () => {
      const confettiAnimations = [confetti1, confetti2, confetti3, confetti4, confetti5, confetti6];
      
      confettiAnimations.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 3000 + (index * 200),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    // Start confetti after main animation
    setTimeout(startConfetti, 500);

    // Show fireworks effect
    setTimeout(() => setShowFireworks(true), 1000);
    setTimeout(() => setShowFireworks(false), 4000);
  }, []);

  const bounceTranslate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const trophyRotate = trophyRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Confetti Layer */}
      <View style={styles.confettiContainer}>
        {/* Confetti pieces */}
        <Animated.Text 
          style={[
            styles.confetti, 
            { 
              left: '10%',
              opacity: confetti1.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: confetti1.interpolate({ inputRange: [0, 1], outputRange: [-50, height + 100] }) },
                { rotate: confetti1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
              ]
            }
          ]}
        >
          🎉
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.confetti, 
            { 
              left: '25%',
              opacity: confetti2.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: confetti2.interpolate({ inputRange: [0, 1], outputRange: [-50, height + 100] }) },
                { rotate: confetti2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
              ]
            }
          ]}
        >
          🎊
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.confetti, 
            { 
              left: '40%',
              opacity: confetti3.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: confetti3.interpolate({ inputRange: [0, 1], outputRange: [-50, height + 100] }) },
                { rotate: confetti3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
              ]
            }
          ]}
        >
          ⭐
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.confetti, 
            { 
              left: '60%',
              opacity: confetti4.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: confetti4.interpolate({ inputRange: [0, 1], outputRange: [-50, height + 100] }) },
                { rotate: confetti4.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
              ]
            }
          ]}
        >
          🎉
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.confetti, 
            { 
              left: '75%',
              opacity: confetti5.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: confetti5.interpolate({ inputRange: [0, 1], outputRange: [-50, height + 100] }) },
                { rotate: confetti5.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
              ]
            }
          ]}
        >
          ✨
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.confetti, 
            { 
              left: '90%',
              opacity: confetti6.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: confetti6.interpolate({ inputRange: [0, 1], outputRange: [-50, height + 100] }) },
                { rotate: confetti6.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
              ]
            }
          ]}
        >
          🎊
        </Animated.Text>
      </View>

      {/* Fireworks Effect */}
      {showFireworks && (
        <View style={styles.fireworksContainer}>
          <Animated.View style={[styles.firework, { top: '20%', left: '20%', opacity: sparkleOpacity }]}>
            <Text style={styles.fireworkText}>💥</Text>
          </Animated.View>
          <Animated.View style={[styles.firework, { top: '15%', right: '25%', opacity: sparkleOpacity }]}>
            <Text style={styles.fireworkText}>🌟</Text>
          </Animated.View>
          <Animated.View style={[styles.firework, { top: '25%', left: '70%', opacity: sparkleOpacity }]}>
            <Text style={styles.fireworkText}>✨</Text>
          </Animated.View>
          <Animated.View style={[styles.firework, { bottom: '60%', left: '15%', opacity: sparkleOpacity }]}>
            <Text style={styles.fireworkText}>🎆</Text>
          </Animated.View>
          <Animated.View style={[styles.firework, { bottom: '65%', right: '20%', opacity: sparkleOpacity }]}>
            <Text style={styles.fireworkText}>🎇</Text>
          </Animated.View>
        </View>
      )}
      
      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Sparkle effects around trophy */}
        <View style={styles.sparkleContainer}>
          <Animated.Text style={[styles.sparkle, { top: 20, left: 20, opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>✨</Animated.Text>
          <Animated.Text style={[styles.sparkle, { top: 30, right: 15, opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>⭐</Animated.Text>
          <Animated.Text style={[styles.sparkle, { bottom: 40, left: 10, opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>💫</Animated.Text>
          <Animated.Text style={[styles.sparkle, { bottom: 20, right: 25, opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>✨</Animated.Text>
        </View>

        {/* Centered Trophy Icon */}
        <Animated.View
          style={[
            styles.trophyContainer,
            {
              transform: [
                { translateY: bounceTranslate },
                { rotate: trophyRotate },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.trophyBackground}>
            <Text style={styles.trophy}>🏆</Text>
          </View>
        </Animated.View>

        {/* Main Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [
                { translateY: bounceTranslate },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          Congratulations!
        </Animated.Text>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.subtitle}>
            🎉 Well Done! 🎉
          </Text>
          <Text style={styles.description}>
            You've successfully completed all flashcards!
          </Text>
          <Text style={styles.encouragement}>
            Keep up the amazing work! 🌟
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={onLogout}
          activeOpacity={0.8}
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>🏠 Go to Home</Text>
          </View>
        </TouchableOpacity>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <Text style={styles.decorativeText}>Keep Learning! Keep Growing! 📚✨</Text>
        </View>
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
    paddingHorizontal: 32,
    paddingVertical: 60,
    width: '100%',
  },
  trophyContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  trophyBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  trophy: {
    fontSize: 72,
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
    width: '100%',
  },
  subtitle: {
    fontSize: 26,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 18,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
    lineHeight: 26,
  },
  encouragement: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
  },
  homeButton: {
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 40,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    minWidth: 240,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  decorativeContainer: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
  },
  decorativeText: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.85,
  },
  // Celebration Animation Styles
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    fontSize: 30,
    zIndex: 2,
  },
  fireworksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  firework: {
    position: 'absolute',
    zIndex: 2,
  },
  fireworkText: {
    fontSize: 40,
    textAlign: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 25,
    zIndex: 4,
  },
});

export default ThankYouScreen;
