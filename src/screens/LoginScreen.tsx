import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import type { UserType } from '../../App';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'superadmin'>('user');

  const PASSWORDS = {
    user: 'user123',
    admin: 'admin123',
    superadmin: 'super123',
  };

  const handleLogin = () => {
    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername || !password) return;
    if (password !== PASSWORDS[role]) {
      Alert.alert('Incorrect password');
      return;
    }
    onLogin({ username: normalizedUsername, role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.roleRow}>
        <TouchableOpacity onPress={() => setRole('user')} style={[styles.roleBtn, role === 'user' && styles.selectedRole]}>
          <Text style={role === 'user' ? styles.selectedRoleText : styles.roleText}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('admin')} style={[styles.roleBtn, role === 'admin' && styles.selectedRole]}>
          <Text style={role === 'admin' ? styles.selectedRoleText : styles.roleText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('superadmin')} style={[styles.roleBtn, role === 'superadmin' && styles.selectedRole]}>
          <Text style={role === 'superadmin' ? styles.selectedRoleText : styles.roleText}>Superadmin</Text>
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 24, fontSize: 18 },
  roleRow: { flexDirection: 'row', marginBottom: 24 },
  roleBtn: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#007aff', marginHorizontal: 8 },
  selectedRole: { backgroundColor: '#007aff' },
  roleText: { color: '#007aff', fontWeight: 'bold' },
  selectedRoleText: { color: '#fff', fontWeight: 'bold' },
});

export default LoginScreen;
