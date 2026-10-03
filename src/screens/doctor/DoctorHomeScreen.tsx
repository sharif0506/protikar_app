import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LoginResponse } from '../../services/authService';
import Colors from '../../theme/colors';

interface Props {
  authData: LoginResponse;
  onLogout: () => void;
}

export default function DoctorHomeScreen({ authData, onLogout }: Props) {
  const { user } = authData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.role}>Doctor</Text>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.info}>{user.email}</Text>
          <Text style={styles.info}>{user.phoneNumber}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    gap: 8,
  },
  role: { fontSize: 13, color: Colors.primary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  name: { fontSize: 22, fontWeight: '700', color: Colors.main },
  info: { fontSize: 15, color: Colors.secondary },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: Colors.white },
});
