import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { signupUser } from '../../services/api';
import { SignupCredentials } from '../../types/user';

export default function SignupScreen() {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleSignup = async () => {
    const user = await signupUser(credentials);
    if (user) {
      Alert.alert('Success', 'Account created successfully!');
      router.push("/(tabs)");
    } else {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-6 justify-center">
      <Text className="text-white text-3xl font-bold text-center mb-8">Create Account</Text>
      <Input
        label="Name"
        value={credentials.name}
        onChangeText={(text) => setCredentials({ ...credentials, name: text })}
        placeholder="Enter your name"
      />
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
      <Button title="Sign Up" onPress={handleSignup} />
      <Link href="/auth/signup" asChild>
        <Text className="text-white text-center mt-4">
          Already have an account? <Text className="text-blue-400">Login</Text>
        </Text>
      </Link>
    </View>
  );
}