import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '@/src/services/api';
import { Expense } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ExpensesScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: () => getExpenses(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const renderExpense = ({ item }: { item: Expense }) => (
    <Animated.View entering={FadeInDown.duration(300).delay(100 * parseInt(item.id))}>
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-4 shadow-md"
        onPress={() => router.push({ pathname: '/(tabs)/expense-detail', params: { id: item.id } })}
      >
        <Text className="text-gray-800 text-lg font-semibold">{item.name}</Text>
        <Text className="text-blue-500 text-base">${parseFloat(item.amount).toFixed(2)}</Text>
        <Text className="text-gray-600 text-sm">{item.category || 'No Category'}</Text>
        <Text className="text-gray-500 text-xs">
          {item.date ? new Date(item.date).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3B82F6', '#1E3A8A']}
        className="h-1/4 rounded-b-3xl justify-center items-center p-4"
      >
        <Animated.Text
          entering={FadeInUp.duration(300)}
          className="text-white text-3xl font-bold text-center"
        >
          Your Expenses
        </Animated.Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInDown.duration(300).delay(200)}
        className="flex-1 px-6 -mt-8"
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center mt-4">
            <Text className="text-white text-lg">Loading expenses...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center mt-4">
            <Text className="text-white text-lg">Error loading expenses.</Text>
          </View>
        ) : expenses.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-4">
            <Text className="text-white text-lg">No expenses found.</Text>
          </View>
        ) : (
          <FlatList
            data={expenses}
            renderItem={renderExpense}
            keyExtractor={(item) => item.id}
            className="flex-1"
          />
        )}
      </Animated.View>
    </View>
  );
}