import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '@/src/services/api';
import { Expense } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { cn } from '@/src/utils/cn';

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
      entering={FadeInDown.duration(400).delay(100 * index)}
      key={item.id}
    >
      <TouchableOpacity
        className="bg-[#1E1E1E] rounded-2xl p-4 mb-4 shadow-md"
        onPress={() => router.push({ 
          pathname: '/(tabs)/expense-detail', 
          params: { id: item.id } 
        })}
        activeOpacity={0.8}
      >
        <View className="flex-row justify-between items-start">
          <Text 
            className="text-white text-lg font-semibold flex-1" 
            numberOfLines={1}
            style={{ fontFamily: 'CircularStd-Medium' }}
          >
            {item.name}
          </Text>
          <Text className="text-[#1DB954] text-base font-medium" style={{ fontFamily: 'CircularStd-Medium' }}>
            ${parseFloat(item.amount).toFixed(2)}
          </Text>
        </View>
        <Text className="text-[#B3B3B3] text-sm mt-1" style={{ fontFamily: 'CircularStd-Book' }}>
          {item.category || 'No Category'}
        </Text>
        <Text className="text-[#B3B3B3] text-xs mt-1" style={{ fontFamily: 'CircularStd-Book' }}>
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
          <ActivityIndicator size="large" color="#1DB954" />
          <Text className="text-white text-lg mt-4" style={{ fontFamily: 'CircularStd-Book' }}>
            Loading your expenses...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg" style={{ fontFamily: 'CircularStd-Book' }}>
            Failed to load expenses
          </Text>
          <Text className="text-[#B3B3B3] text-sm mt-2" style={{ fontFamily: 'CircularStd-Book' }}>
            Please check your connection and try again
          </Text>
        </View>
      );
    }

    if (expenses.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg" style={{ fontFamily: 'CircularStd-Book' }}>
            No expenses found
          </Text>
          <Text className="text-[#B3B3B3] text-sm mt-2" style={{ fontFamily: 'CircularStd-Book' }}>
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
            <ActivityIndicator size="small" color="#1DB954" className="mt-4" />
          ) : null
        }
      />
    );
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
          style={{ fontFamily: 'CircularStd-Black' }}
        >
          Your Expenses
        </Animated.Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
        className="flex-1 px-6 -mt-8"
      >
        {renderContent()}
      </Animated.View>
    </View>
  );
}