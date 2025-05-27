import React, { useState } from 'react';
import { View, Text, Alert, StatusBar, TouchableOpacity } from 'react-native';
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

    if (!credentials.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
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
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <LinearGradient
        colors={['#1DB954', '#121212']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="h-1/4 justify-center items-center p-4"
      >
        <Animated.Text
          entering={FadeInUp.duration(400)}
          className="text-white text-4xl font-bold text-center"
          style={{ fontFamily: 'CircularStd-Black' }} // Assuming a custom font similar to Spotify's Circular
        >
          Finance Tracker
        </Animated.Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
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
          <View className="bg-[#1E1E1E] rounded-2xl p-6 shadow-md">
            <Text className="text-white text-2xl font-semibold text-center mb-6" style={{ fontFamily: 'CircularStd-Medium' }}>
              Log In
            </Text>
            <View className="mb-4">
              <Input
                label="Username"
                value={credentials.username}
                onChangeText={(text) => setCredentials({ ...credentials, username: text })}
                placeholder="Enter your username"
                placeholderTextColor="#B3B3B3"
                className={cn('text-base text-white bg-[#2A2A2A] rounded-lg p-3')}
                style={{ fontFamily: 'CircularStd-Book' }}
              />
              {errors.username ? <Text className="text-[#FF453A] text-xs mt-1">{errors.username}</Text> : null}
            </View>
            <View className="mb-4">
              <Input
                label="Password"
                value={credentials.password}
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                placeholder="Enter your password"
                placeholderTextColor="#B3B3B3"
                secureTextEntry
                className={cn('text-base text-white bg-[#2A2A2A] rounded-lg p-3')}
                style={{ fontFamily: 'CircularStd-Book' }}
              />
              {errors.password ? <Text className="text-[#FF453A] text-xs mt-1">{errors.password}</Text> : null}
            </View>
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              className={cn(
                'bg-[#1DB954] rounded-full py-3 mt-6',
                'transition-all duration-200 active:scale-95'
              )}
            >
              <Text className="text-white text-center text-lg font-semibold" style={{ fontFamily: 'CircularStd-Medium' }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </Animated.View>
    </View>
  );
}