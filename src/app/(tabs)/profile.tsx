import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StatusBar, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { cn } from '@/src/utils/cn';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { updateUser } from '@/src/services/api';
import { User } from '@/src/types';

export default function ProfileScreen() {
  const { user, login, logout } = useAuth();
  const [credentials, setCredentials] = useState<{
    username: string;
    currentPassword: string;
    newPassword: string;
  }>({
    username: '',
    currentPassword: '',
    newPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCredentials({
        username: user.username || '',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!credentials.username) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    if (credentials.currentPassword || credentials.newPassword) {
      if (!credentials.currentPassword || !credentials.newPassword) {
        Alert.alert('Error', 'Please provide both current and new passwords');
        return;
      }
      if (credentials.currentPassword !== user?.password) {
        Alert.alert('Error', 'Current password is incorrect');
        return;
      }
      if (credentials.newPassword.length < 6) {
        Alert.alert('Error', 'New password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);
    try {
      const updatedUser = await updateUser(user!.id, {
        username: credentials.username,
        password: credentials.newPassword || user!.password,
      });
      await login({ username: credentials.username, password: credentials.newPassword || user!.password });
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
      setCredentials({ ...credentials, currentPassword: '', newPassword: '' });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <StatusBar barStyle="dark-content" />
        <Text className="text-gray-600 text-base text-center">Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <View className="h-1/4 bg-blue-500 rounded-b-3xl justify-center items-center">
        <TouchableOpacity className="mb-2">
          <View className="w-20 h-20 bg-gray-300 rounded-full justify-center items-center">
            <FontAwesome name="user" size={40} color="#fff" />
          </View>
          {isEditing && (
            <Text className="text-white text-sm mt-1">Tap to change picture</Text>
          )}
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Your Profile</Text>
      </View>
      <View className="flex-1 px-6 -mt-8">
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Input
            label="Username"
            value={credentials.username}
            onChangeText={(text) => setCredentials({ ...credentials, username: text })}
            placeholder="Enter your username"
            editable={isEditing}
            className={cn(isEditing ? 'focus:border-blue-400' : 'opacity-70', 'text-base')}
          />
          {isEditing && (
            <>
              <Input
                label="Current Password"
                value={credentials.currentPassword}
                onChangeText={(text) => setCredentials({ ...credentials, currentPassword: text })}
                placeholder="Enter current password"
                secureTextEntry
                className={cn('text-base')}
              />
              <Input
                label="New Password"
                value={credentials.newPassword}
                onChangeText={(text) => setCredentials({ ...credentials, newPassword: text })}
                placeholder="Enter new password"
                secureTextEntry
                className={cn('text-base')}
              />
            </>
          )}
          <Button
            title={isEditing ? 'Save Changes' : 'Edit Profile'}
            onPress={handleUpdate}
            disabled={loading}
            className={cn('transition-all duration-200 active:scale-95', loading && 'opacity-50')}
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            disabled={loading}
            className={cn('bg-gray-500 mt-2', loading && 'opacity-50')}
          />
        </View>
      </View>
    </View>
  );
}