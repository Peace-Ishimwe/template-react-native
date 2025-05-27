import React from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/contexts/AuthContext';
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
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <Text className="text-white text-base text-center" style={{ fontFamily: 'CircularStd-Book' }}>
          Please log in to view your profile
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      {/* Gradient Header */}
      <LinearGradient
        colors={['#1DB954', '#121212']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="h-1/4 justify-center items-center"
      >
        <Animated.View entering={FadeInUp.duration(400)} className="flex flex-col items-center">
          <View className="w-24 h-24 bg-[#2A2A2A] rounded-full justify-center items-center mb-4">
            <FontAwesome name="user" size={40} color="#1DB954" />
          </View>
          <Text className="text-white text-3xl font-bold" style={{ fontFamily: 'CircularStd-Black' }}>
            {user.username || 'User'}
          </Text>
          <Text className="text-[#B3B3B3] text-sm opacity-80" style={{ fontFamily: 'CircularStd-Book' }}>
            Your Financial Profile
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Main Content */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
        className="flex-1 px-6 -mt-8"
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Profile Details Card */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(400)}
            className="bg-[#1E1E1E] rounded-2xl p-6 shadow-md mb-6"
          >
            <Text className="text-white text-lg font-semibold mb-4" style={{ fontFamily: 'CircularStd-Medium' }}>
              Profile Details
            </Text>
            <View className="mb-4">
              <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                Username
              </Text>
              <Text className="text-white text-base" style={{ fontFamily: 'CircularStd-Medium' }}>
                {user.username}
              </Text>
            </View>
            <View className="mb-4">
              <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                Email
              </Text>
              <Text className="text-white text-base" style={{ fontFamily: 'CircularStd-Medium' }}>
                {user.username}
              </Text>
            </View>
            <View className="mb-4">
              <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                Joined
              </Text>
              <Text className="text-white text-base" style={{ fontFamily: 'CircularStd-Medium' }}>
                {joinDate}
              </Text>
            </View>
          </Animated.View>

          {/* Financial Insights Card */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(600)}
            className="bg-[#1E1E1E] rounded-2xl p-6 shadow-md mb-6"
          >
            <Text className="text-white text-lg font-semibold mb-4" style={{ fontFamily: 'CircularStd-Medium' }}>
              Financial Insights
            </Text>
            {isLoading ? (
              <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                Loading insights...
              </Text>
            ) : error ? (
              <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                Error loading insights.
              </Text>
            ) : (
              <>
                <View className="mb-4 flex-row justify-between items-center">
                  <View>
                    <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                      Total Expenses
                    </Text>
                    <Text className="text-[#1DB954] text-base font-semibold" style={{ fontFamily: 'CircularStd-Medium' }}>
                      ${totalExpenses.toFixed(2)}
                    </Text>
                  </View>
                  <FontAwesome name="dollar" size={20} color="#1DB954" />
                </View>
                <View className="mb-4 flex-row justify-between items-center">
                  <View>
                    <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                      Number of Expenses
                    </Text>
                    <Text className="text-[#1DB954] text-base font-semibold" style={{ fontFamily: 'CircularStd-Medium' }}>
                      {expenseCount}
                    </Text>
                  </View>
                  <FontAwesome name="list" size={20} color="#1DB954" />
                </View>
                <View className="mb-4 flex-row justify-between items-center">
                  <View>
                    <Text className="text-[#B3B3B3] text-sm" style={{ fontFamily: 'CircularStd-Book' }}>
                      Favorite Category
                    </Text>
                    <Text className="text-[#1DB954] text-base font-semibold" style={{ fontFamily: 'CircularStd-Medium' }}>
                      {topCategory}
                    </Text>
                  </View>
                  <FontAwesome name="tag" size={20} color="#1DB954" />
                </View>
              </>
            )}
          </Animated.View>

          {/* Logout Button */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(800)}
            className="mb-6"
          >
            <TouchableOpacity
              onPress={handleLogout}
              className={cn(
                'bg-[#FF453A] rounded-full py-3',
                'transition-all duration-200 active:scale-95'
              )}
            >
              <Text className="text-white text-center text-lg font-semibold" style={{ fontFamily: 'CircularStd-Medium' }}>
                Logout
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}