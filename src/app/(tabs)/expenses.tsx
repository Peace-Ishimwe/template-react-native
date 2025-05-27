import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getExpenses, deleteExpense } from '@/src/services/api';
import { Expense } from '@/src/types';

export default function ExpenseListScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expenses. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      Alert.alert('Success', 'Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense. Please try again.');
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between p-2 border-b">
            <TouchableOpacity
              onPress={() => router.push(`/(tabs)/expense-detail?id=${item.id}`)}
            >
              <Text>
                {item.name}: ${item.amount}
              </Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}