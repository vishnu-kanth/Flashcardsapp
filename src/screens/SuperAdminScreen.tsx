import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SuperAdminScreenProps {
  navigation: any;
  onLogout: () => void;
}

const SuperAdminScreen: React.FC<SuperAdminScreenProps> = ({ navigation, onLogout }) => {
  const [users, setUsers] = useState<string[]>([]);
  const USERS_KEY = 'FLASHCARDS_USERS';

  useEffect(() => {
    const loadUsers = async () => {
      const data = await AsyncStorage.getItem(USERS_KEY);
      setUsers(data ? JSON.parse(data) : []);
    };
    const unsubscribe = navigation.addListener('focus', loadUsers);
    loadUsers();
    return unsubscribe;
  }, [navigation]);

  const handleSelectUser = (username: string) => {
    navigation.navigate('ManageUserFlashcards', { username });
  };

  const handleAddUser = () => {
    navigation.navigate('AddUser');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Superadmin Panel</Text>
        <Button title="Logout" onPress={onLogout} />
      </View>
      <Text style={styles.sectionTitle}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={u => u}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userBtn}
            onPress={() => handleSelectUser(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.userText}>{item}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addUserBtn} onPress={handleAddUser} activeOpacity={0.8}>
            <Text style={styles.addUserText}>+ Add User</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafd' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#007aff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#007aff' },
  userBtn: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#007aff', marginHorizontal: 6, backgroundColor: '#fff' },
  selectedUserBtn: { backgroundColor: '#007aff' },
  userText: { color: '#007aff', fontWeight: 'bold' },
  selectedUserText: { color: '#fff', fontWeight: 'bold' },
  addUserBtn: { padding: 10, borderRadius: 8, backgroundColor: '#00c853', marginLeft: 10 },
  addUserText: { color: '#fff', fontWeight: 'bold' },
});

export default SuperAdminScreen;
