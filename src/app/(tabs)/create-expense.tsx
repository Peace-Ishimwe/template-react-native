import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { cn } from '@/src/utils/cn';
import { createExpense } from '@/src/services/api';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '@/src/contexts/AuthContext';

export default function CreateExpenseScreen() {
  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    description: '',
    category: '',
    date: '',
    title: '',
    note: '',
  });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const categories = ['Food', 'Shopping', 'Entertainment', 'Clothes', 'Housing', 'Other'];

  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      Alert.alert('Success', 'Expense created successfully!');
      router.push('/(tabs)/expenses');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create expense');
    },
  });

  const handleConfirmDate = (date: Date) => {
    setExpense({ ...expense, date: date.toISOString() });
    setIsDatePickerVisible(false);
  };

  const handleCreate = () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an expense');
      return;
    }

    if (!expense.name || !expense.amount || !expense.description) {
      Alert.alert('Error', 'Please fill in name, amount, and description');
      return;
    }

    if (isNaN(parseFloat(expense.amount))) {
      Alert.alert('Error', 'Amount must be a valid number');
      return;
    }

    mutation.mutate({
      name: expense.name,
      amount: expense.amount,
      description: expense.description,
      category: expense.category || undefined,
      date: expense.date || undefined,
      title: expense.title || undefined,
      note: expense.note || undefined,
    });
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3B82F6', '#1E3A8A']}
        className="h-1/5 rounded-b-3xl justify-center items-center p-4"
      >
        <Animated.Text
          entering={FadeInUp.duration(300)}
          className="text-white text-3xl font-bold text-center"
        >
          Add New Expense
        </Animated.Text>
      </LinearGradient>

      <Animated.View
        entering={FadeInDown.duration(300).delay(200)}
        className="flex-1 px-6 -mt-8 pb-6"
      >
        <ScrollView className="bg-white rounded-xl p-6 shadow-md">
          <Input
            label="Name"
            value={expense.name}
            onChangeText={(text) => setExpense({ ...expense, name: text })}
            placeholder="Enter expense name"
            editable={!mutation.isPending}
            className={cn('text-base', mutation.isPending && 'opacity-70')}
          />
          <Input
            label="Amount"
            value={expense.amount}
            onChangeText={(text) => setExpense({ ...expense, amount: text })}
            placeholder="Enter amount"
            keyboardType="numeric"
            editable={!mutation.isPending}
            className={cn('text-base', mutation.isPending && 'opacity-70')}
          />
          <Input
            label="Description"
            value={expense.description}
            onChangeText={(text) => setExpense({ ...expense, description: text })}
            placeholder="Enter description"
            editable={!mutation.isPending}
            className={cn('text-base', mutation.isPending && 'opacity-70')}
          />
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-2">Category</Text>
            <Picker
              selectedValue={expense.category}
              onValueChange={(value) => setExpense({ ...expense, category: value })}
              enabled={!mutation.isPending}
              style={{ backgroundColor: '#F3F4F6', borderRadius: 8 }}
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-2">Date</Text>
            <Button
              title={expense.date ? new Date(expense.date).toLocaleDateString() : 'Select Date'}
              onPress={() => setIsDatePickerVisible(true)}
              disabled={mutation.isPending}
              className={cn('bg-gray-200', mutation.isPending && 'opacity-50')}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={() => setIsDatePickerVisible(false)}
            />
          </View>
          <Input
            label="Title (Optional)"
            value={expense.title}
            onChangeText={(text) => setExpense({ ...expense, title: text })}
            placeholder="Enter title"
            editable={!mutation.isPending}
            className={cn('text-base', mutation.isPending && 'opacity-70')}
          />
          <Input
            label="Note (Optional)"
            value={expense.note}
            onChangeText={(text) => setExpense({ ...expense, note: text })}
            placeholder="Enter note"
            multiline
            editable={!mutation.isPending}
            className={cn('text-base', mutation.isPending && 'opacity-70')}
          />
          <Button
            title="Create Expense"
            onPress={handleCreate}
            disabled={mutation.isPending}
            className={cn(
              'bg-blue-500 mt-4',
              'transition-all duration-200 active:scale-95',
              mutation.isPending && 'opacity-50'
            )}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
}