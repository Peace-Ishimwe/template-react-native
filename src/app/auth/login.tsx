import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types/user';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(credentials);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid email or password');
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 p-6 justify-center">
      <Text className="text-white text-3xl font-bold text-center mb-8">Welcome Back</Text>
      <Input
        label="Email"
        value={credentials.email}
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        placeholder="Enter your email"
      />
      <Input
        label="Password"
        value={credentials.password}
        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Link
        href={{
          pathname: '/auth/signup',
        }}
        asChild
      >
        <Text className="text-white text-center mt-4">
          Don't have an account? <Text className="text-blue-400">Sign Up</Text>
        </Text>
      </Link>
    </View>
  );
}