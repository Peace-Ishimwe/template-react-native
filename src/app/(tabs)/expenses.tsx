import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
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

  const {
    data: expenses = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery<Expense[]>({
    queryKey: ['expenses', user?.id],
    queryFn: getExpenses,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const renderExpense = ({ item, index }: { item: Expense; index: number }) => (
    <Animated.View 
      entering={FadeInDown.duration(300).delay(100 * index)}
      key={item.id}
    >
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-4 shadow-md"
        onPress={() => router.push({ 
          pathname: '/(tabs)/expense-detail', 
          params: { id: item.id } 
        })}
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between items-start">
          <Text 
            className="text-gray-800 text-lg font-semibold flex-1" 
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-blue-500 text-base font-medium">
            ${parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        <Text className="text-gray-600 text-sm mt-1">
          {item.category || 'No Category'}
        </Text>
        <Text className="text-gray-500 text-xs mt-1">
          {item.date ? new Date(item.date).toLocaleDateString() : 
           new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-white text-lg mt-4">Loading your expenses...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Failed to load expenses</Text>
          <Text className="text-gray-400 text-sm mt-2">
            Please check your connection and try again
          </Text>
        </View>
      );
    }

    if (expenses.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">No expenses found</Text>
          <Text className="text-gray-400 text-sm mt-2">
            Add your first expense to get started
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isFetching ? (
            <ActivityIndicator size="small" color="#3B82F6" className="mt-4" />
          ) : null
        }
      />
    );
  };

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
        {renderContent()}
      </Animated.View>
    </View>
  );
}