import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'FLASHCARDS_USERS';

const AddUserScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');

  const handleAdd = async () => {
    if (!username) return;
    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: string[] = data ? JSON.parse(data) : [];
    if (users.includes(username)) {
      Alert.alert('User already exists');
      return;
    }
    users.push(username);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add User</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Button title="Add User" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 24, fontSize: 18 },
});

export default AddUserScreen;
