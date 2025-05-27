import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { getExpenses } from '@/src/services/api';
import { Expense } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, [user]);

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
          <Text className="text-white text-center mt-4">Loading...</Text>
        ) : expenses.length === 0 ? (
          <Text className="text-white text-center mt-4">No expenses found.</Text>
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