import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getExpenseById } from '@/src/services/api';
import { Expense } from '@/src/types';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (id) {
      fetchExpense();
    }
  }, [id]);

  const fetchExpense = async () => {
    try {
      const data = await getExpenseById(id);
      setExpense(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expense details. Please try again.');
    }
  };

  if (!expense) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Expense Details</Text>
      <Text>Amount: ${expense.amount}</Text>
      <Text>Category: {expense.name}</Text>
      <Text>Description: {expense.description || 'N/A'}</Text>
    </View>
  );
}