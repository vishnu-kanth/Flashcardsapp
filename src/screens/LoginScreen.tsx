import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import type { UserType } from '../../App';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

const { width } = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'superadmin'>('user');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const PASSWORDS = {
    user: 'user123',
    admin: 'admin123',
    superadmin: 'super123',
  };

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
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

  const handleLogin = () => {
    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername || !password) {
      Alert.alert('Missing Information', 'Please enter both username and password');
      return;
    }
    if (password !== PASSWORDS[role]) {
      Alert.alert('Incorrect Password', 'Please check your password and try again');
      return;
    }
    onLogin({ username: normalizedUsername, role });
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
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>👤 Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔒 Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Choose your role:</Text>
            <View style={styles.roleButtons}>
              {[
                { key: 'user', label: '👤 User', color: '#4CAF50' },
                { key: 'admin', label: '⚙️ Admin', color: '#FF9800' },
                { key: 'superadmin', label: '👑 Super Admin', color: '#F44336' }
              ].map((roleOption) => (
                <TouchableOpacity
                  key={roleOption.key}
                  onPress={() => setRole(roleOption.key as any)}
                  style={[
                    styles.roleButton,
                    { backgroundColor: roleOption.color },
                    role === roleOption.key && styles.selectedRoleButton
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.roleButtonText,
                    role === roleOption.key && styles.selectedRoleText
                  ]}>
                    {roleOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>🚀 Sign In</Text>
          </TouchableOpacity>

          {/* Quick Login Guide */}
          <View style={styles.guideContainer}>
            <Text style={styles.guideTitle}>Quick Login Guide:</Text>
            <Text style={styles.guideText}>👤 User: user123</Text>
            <Text style={styles.guideText}>⚙️ Admin: admin123</Text>
            <Text style={styles.guideText}>👑 Super Admin: super123</Text>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
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
    padding: 32,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: { 
    width: '100%', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  roleButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  selectedRoleButton: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  roleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  selectedRoleText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  guideContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  guideTitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  guideText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default LoginScreen;
