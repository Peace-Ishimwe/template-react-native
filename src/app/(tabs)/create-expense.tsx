import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createExpense } from '@/src/services/api';

export default function CreateExpenseScreen() {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const router = useRouter();

  const handleCreateExpense = async () => {
    if (!name || !amount || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await createExpense({
        name,
        amount: amount,
        description,
      });
      Alert.alert('Success', 'Expense created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create expense. Please try again.');
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Create Expense</Text>
       <TextInput
        className="border p-2 mb-4"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border p-2 mb-4"
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        className="border p-2 mb-4"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Save Expense" onPress={handleCreateExpense} />
    </View>
  );
}