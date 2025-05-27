import React, { useState } from 'react';
import { View, Text, Alert, StatusBar } from 'react-native';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
     await login(credentials);
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-6 justify-center">
      <StatusBar />
      <Text className="text-white text-3xl font-bold text-center mb-8">
        Welcome to Personal Finance Tracker
      </Text>
      <Input
        label="Username"
        value={credentials.username}
        onChangeText={(text) => setCredentials({ ...credentials, username: text })}
        placeholder="Enter your username"
      />
      <Input
        label="Password"
        value={credentials.password}
        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}