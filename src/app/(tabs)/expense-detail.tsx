import React from 'react';
import { View, Text, Alert, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/src/utils/cn';
import { getExpenseById, deleteExpense } from '@/src/services/api';
import { Expense } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: expense, isLoading, error } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpenseById(id!),
    enabled: !!id && !!user,
  });

  const mutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      Alert.alert('Success', 'Expense deleted successfully!');
      router.push('/(tabs)/expenses');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to delete expense');
    },
  });

  const handleDelete = () => {
    if (!id) return;
    mutation.mutate(id);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <Text className="text-white text-lg" style={{ fontFamily: 'CircularStd-Book' }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (error || !expense) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <Text className="text-white text-lg" style={{ fontFamily: 'CircularStd-Book' }}>
          Expense not found.
        </Text>
      </View>
    );
  }

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
          Expense Details
        </Animated.Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
        className="flex-1 px-6 -mt-8"
      >
        <View className="bg-[#1E1E1E] rounded-2xl p-6 shadow-md">
          <Text className="text-white text-lg font-semibold mb-2" style={{ fontFamily: 'CircularStd-Medium' }}>
            {expense.name}
          </Text>
          <Text className="text-[#1DB954] text-base mb-2" style={{ fontFamily: 'CircularStd-Medium' }}>
            ${parseFloat(expense.amount).toFixed(2)}
          </Text>
          <Text className="text-[#B3B3B3] text-sm mb-2" style={{ fontFamily: 'CircularStd-Book' }}>
            Description: {expense.description}
          </Text>
          {expense.category && (
            <Text className="text-[#B3B3B3] text-sm mb-2" style={{ fontFamily: 'CircularStd-Book' }}>
              Category: {expense.category}
            </Text>
          )}
          <Text className="text-[#B3B3B3] text-sm mb-2" style={{ fontFamily: 'CircularStd-Book' }}>
            Date: {expense.date ? new Date(expense.date).toLocaleDateString() : new Date(expense.createdAt).toLocaleDateString()}
          </Text>
          {expense.title && (
            <Text className="text-[#B3B3B3] text-sm mb-2" style={{ fontFamily: 'CircularStd-Book' }}>
              Title: {expense.title}
            </Text>
          )}
          {expense.note && (
            <Text className="text-[#B3B3B3] text-sm mb-2" style={{ fontFamily: 'CircularStd-Book' }}>
              Note: {expense.note}
            </Text>
          )}
          <TouchableOpacity
            onPress={handleDelete}
            disabled={mutation.isPending}
            className={cn(
              'bg-[#FF453A] rounded-full py-3 mt-4',
              'transition-all duration-200 active:scale-95',
              mutation.isPending && 'opacity-50'
            )}
          >
            <Text className="text-white text-center text-lg font-semibold" style={{ fontFamily: 'CircularStd-Medium' }}>
              Delete Expense
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}