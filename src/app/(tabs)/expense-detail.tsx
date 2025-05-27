import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/src/components/Button';
import { cn } from '@/src/utils/cn';
import { getExpenseById, deleteExpense } from '@/src/services/api';
import { Expense } from '@/src/types';

export default function ExpenseDetailScreen() {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const fetchExpense = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getExpenseById(id);
        setExpense(data);
      } catch (error) {
        console.error('Error fetching expense:', error);
        Alert.alert('Error', 'Failed to load expense details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await deleteExpense(id);
      Alert.alert('Success', 'Expense deleted successfully!');
      router.push('/(tabs)/expenses');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete expense');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (!expense) {
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
            disabled={isLoading}
            className={cn(
              'bg-red-500 mt-4',
              'transition-all duration-200 active:scale-95',
              isLoading && 'opacity-50'
            )}
          />
        </View>
      </Animated.View>
    </View>
  );
}