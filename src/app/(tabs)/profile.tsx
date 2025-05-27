import React from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/Button';
import { cn } from '@/src/utils/cn';
import { getExpenses } from '@/src/services/api';
import { Expense } from '@/src/types';
import { Alert } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: () => getExpenses(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to logout');
    }
  };

  // Calculate financial insights
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const expenseCount = expenses.length;
  const favoriteCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.entries(favoriteCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Placeholder join date (since user schema doesn't include it)
  const joinDate = new Date().toLocaleDateString(); 

  if (!user) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" />
        <Text className="text-white text-base text-center">Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      {/* Gradient Header */}
      <LinearGradient
        colors={['#3B82F6', '#1E3A8A']}
        className="h-1/3 rounded-b-3xl justify-center items-center"
      >
        <Animated.View entering={FadeInUp.duration(500)} className="flex flex-col items-center">
          <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mb-4">
            <FontAwesome name="user" size={48} color="#3B82F6" />
          </View>
          <Text className="text-white text-2xl font-bold">{user.username || 'User'}</Text>
          <Text className="text-white text-sm opacity-80">Your Financial Profile</Text>
        </Animated.View>
      </LinearGradient>

      {/* Main Content */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(200)}
        className="flex-1 px-6 -mt-8"
      >
        <ScrollView>
          {/* Profile Details Card */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(400)}
            className="bg-white rounded-xl p-6 shadow-md mb-6"
          >
            <Text className="text-gray-800 text-lg font-semibold mb-4">Profile Details</Text>
            <View className="mb-4">
              <Text className="text-gray-600 text-sm">Username</Text>
              <Text className="text-gray-800 text-base">{user.username}</Text>
            </View>
            <View className="mb-4">
              <Text className="text-gray-600 text-sm">Email</Text>
              <Text className="text-gray-800 text-base">{user.username}</Text>
            </View>
            <View className="mb-4">
              <Text className="text-gray-600 text-sm">Joined</Text>
              <Text className="text-gray-800 text-base">{joinDate}</Text>
            </View>
          </Animated.View>

          {/* Financial Insights Card */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(600)}
            className="bg-white rounded-xl p-6 shadow-md mb-6"
          >
            <Text className="text-gray-800 text-lg font-semibold mb-4">Financial Insights</Text>
            {isLoading ? (
              <Text className="text-gray-500 text-sm">Loading insights...</Text>
            ) : error ? (
              <Text className="text-gray-500 text-sm">Error loading insights.</Text>
            ) : (
              <>
                <View className="mb-4 flex-row justify-between">
                  <View>
                    <Text className="text-gray-600 text-sm">Total Expenses</Text>
                    <Text className="text-blue-500 text-base font-semibold">${totalExpenses.toFixed(2)}</Text>
                  </View>
                  <FontAwesome name="dollar" size={20} color="#3B82F6" />
                </View>
                <View className="mb-4 flex-row justify-between">
                  <View>
                    <Text className="text-gray-600 text-sm">Number of Expenses</Text>
                    <Text className="text-blue-500 text-base font-semibold">{expenseCount}</Text>
                  </View>
                  <FontAwesome name="list" size={20} color="#3B82F6" />
                </View>
                <View className="mb-4 flex-row justify-between">
                  <View>
                    <Text className="text-gray-600 text-sm">Favorite Category</Text>
                    <Text className="text-blue-500 text-base font-semibold">{topCategory}</Text>
                  </View>
                  <FontAwesome name="tag" size={20} color="#3B82F6" />
                </View>
              </>
            )}
          </Animated.View>

          {/* Logout Button */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(800)}
            className="mb-6"
          >
            <Button
              title="Logout"
              onPress={handleLogout}
              className={cn(
                'bg-red-500',
                'transition-all duration-200 active:scale-95'
              )}
            />
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}