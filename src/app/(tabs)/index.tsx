import React from 'react';
import { View, Text, Alert } from 'react-native';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/contexts/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <ProtectedRoute>
      <View className="flex-1 bg-gray-100 p-6 justify-center items-center">
        <Text className="text-3xl font-bold mb-4">Welcome, {user?.name}!</Text>
        <Text className="text-lg mb-8">You are now logged in.</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ProtectedRoute>
  );
}