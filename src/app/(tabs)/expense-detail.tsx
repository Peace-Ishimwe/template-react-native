import React from 'react';
import { View, Text, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/src/components/Button';
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
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (error || !expense) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">Expense not found.</Text>
      </View>
    );
  }

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
          Expense Details
        </Animated.Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInDown.duration(300).delay(200)}
        className="flex-1 px-6 -mt-8"
      >
        <View className="bg-white rounded-xl p-6 shadow-md">
          <Text className="text-gray-800 text-lg font-semibold mb-2">{expense.name}</Text>
          <Text className="text-blue-500 text-base mb-2">${parseFloat(expense.amount).toFixed(2)}</Text>
          <Text className="text-gray-600 text-sm mb-2">Description: {expense.description}</Text>
          {expense.category && (
            <Text className="text-gray-600 text-sm mb-2">Category: {expense.category}</Text>
          )}
          <Text className="text-gray-600 text-sm mb-2">
            Date: {expense.date ? new Date(expense.date).toLocaleDateString() : new Date(expense.createdAt).toLocaleDateString()}
          </Text>
          {expense.title && (
            <Text className="text-gray-600 text-sm mb-2">Title: {expense.title}</Text>
          )}
          {expense.note && (
            <Text className="text-gray-600 text-sm mb-2">Note: {expense.note}</Text>
          )}
          <Button
            title="Delete Expense"
            onPress={handleDelete}
            disabled={mutation.isPending}
            className={cn(
              'bg-red-500 mt-4',
              'transition-all duration-200 active:scale-95',
              mutation.isPending && 'opacity-50'
            )}
          />
        </View>
      </Animated.View>
    </View>
  );
}