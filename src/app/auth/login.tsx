import React, { useState } from 'react';
import { View, Text, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { cn } from '@/src/utils/cn';
import { useAuth } from '@/src/contexts/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    username: string;
    password: string;
  }>({
    username: '',
    password: '',
  });
  const { login } = useAuth();

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
    };

    // Username: Required, 4-20 chars, alphanumeric with underscores/hyphens
    if (!credentials.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_-]{4,20}$/.test(credentials.username)) {
      newErrors.username = 'Username must be 4-20 characters, alphanumeric with underscores or hyphens';
      isValid = false;
    }

    // Password: Optional (since API uses username-only), 6-12 chars if provided
    if (credentials.password && !/^[a-zA-Z0-9!@#$%^&*]{6,12}$/.test(credentials.password)) {
      newErrors.password = 'Password must be 6-12 characters, alphanumeric with special characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      Alert.alert('Error', 'Please correct the errors in the form');
      return;
    }

    try {
      await login(credentials);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3B82F6', '#1E3A8A']}
        className="h-1/5 rounded-b-3xl justify-center items-center p-4"
      >
        <Animated.Text
          entering={FadeInUp.duration(300)}
          className="text-white text-3xl font-bold text-center"
        >
          Personal Finance Tracker
        </Animated.Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInDown.duration(300).delay(200)}
        className="flex-1 px-6 -mt-8"
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingBottom: 40,
          }}
          enableOnAndroid={true}
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-xl p-6 shadow-md">
            <Text className="text-gray-800 text-2xl font-semibold text-center mb-6">
              Log In
            </Text>
            <View>
              <Input
                label="Username"
                value={credentials.username}
                onChangeText={(text) => setCredentials({ ...credentials, username: text })}
                placeholder="Enter your username"
                className={cn('text-base')}
              />
              {errors.username ? <Text className="text-red-500 text-xs mt-1">{errors.username}</Text> : null}
            </View>
            <View>
              <Input
                label="Password"
                value={credentials.password}
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                placeholder="Enter your password"
                secureTextEntry
                className={cn('text-base')}
              />
              {errors.password ? <Text className="text-red-500 text-xs mt-1">{errors.password}</Text> : null}
            </View>
            <Button
              title="Login"
              onPress={handleLogin}
              className={cn(
                'bg-blue-500 mt-6',
                'transition-all duration-200 active:scale-95'
              )}
            />
          </View>
        </KeyboardAwareScrollView>
      </Animated.View>
    </View>
  );
}