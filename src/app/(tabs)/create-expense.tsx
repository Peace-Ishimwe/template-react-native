import React, { useState } from 'react';
import { View, Text, Alert, StatusBar } from 'react-native';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Expense } from '@/src/types';

interface ExpenseForm {
  name: string;
  amount: string;
  description: string;
  category: string;
  date: string;
  title: string;
  note: string;
}

interface FormErrors {
  name: string;
  amount: string;
  description: string;
  category: string;
  date: string;
  title: string;
  note: string;
}

export default function CreateExpenseScreen() {
  const [expense, setExpense] = useState<ExpenseForm>({
    name: '',
    amount: '',
    description: '',
    category: '',
    date: '',
    title: '',
    note: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    amount: '',
    description: '',
    category: '',
    date: '',
    title: '',
    note: '',
  });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const categories: string[] = ['Food', 'Shopping', 'Entertainment', 'Clothes', 'Housing', 'Other'];

  const mutation = useMutation<Expense, Error, Omit<Expense, 'id' | 'createdAt'>>({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      Alert.alert('Success', 'Expense created successfully!');
      router.push('/(tabs)/expenses');
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to create expense');
    },
  });

  const validateInputs = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {
      name: '',
      amount: '',
      description: '',
      category: '',
      date: '',
      title: '',
      note: '',
    };

    // Name: Required, 2-50 chars, alphanumeric with spaces
    if (!expense.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s]{2,50}$/.test(expense.name)) {
      newErrors.name = 'Name must be 2-50 characters, alphanumeric with spaces';
      isValid = false;
    }

    // Amount: Required, positive number, max 10 digits (2 decimals)
    if (!expense.amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(expense.amount) || parseFloat(expense.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number with up to 2 decimals';
      isValid = false;
    } else if (parseFloat(expense.amount) > 99999999.99) {
      newErrors.amount = 'Amount cannot exceed $99,999,999.99';
      isValid = false;
    }

    // Description: Required, 5-100 chars, alphanumeric with spaces/punctuation
    if (!expense.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s,.!?]{5,100}$/.test(expense.description)) {
      newErrors.description = 'Description must be 5-100 characters, alphanumeric with spaces/punctuation';
      isValid = false;
    }

    // Category: Optional, must be valid if provided
    if (expense.category && !categories.includes(expense.category)) {
      newErrors.category = 'Invalid category selected';
      isValid = false;
    }

    // Date: Required, past or present
    if (!expense.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    } else {
      const selectedDate = new Date(expense.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
        isValid = false;
      }
    }

    // Title: Optional, 1-50 chars if provided
    if (expense.title && !/^[a-zA-Z0-9\s]{1,50}$/.test(expense.title)) {
      newErrors.title = 'Title must be 1-50 characters, alphanumeric with spaces';
      isValid = false;
    }

    // Note: Optional, 1-250 chars if provided
    if (expense.note && !/^[a-zA-Z0-9\s,.!?]{1,250}$/.test(expense.note)) {
      newErrors.note = 'Note must be 1-250 characters, alphanumeric with spaces/punctuation';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmDate = (date: Date): void => {
    setExpense({ ...expense, date: date.toISOString() });
    setIsDatePickerVisible(false);
  };

  const handleCreate = (): void => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an expense');
      return;
    }

    if (!validateInputs()) {
      Alert.alert('Error', 'Please correct the errors in the form');
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
        className="flex-1 px-6 -mt-8 pb-4"
      >
        <KeyboardAwareScrollView
          className="bg-white rounded-xl p-6 shadow-md"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 40,
          }}
          enableOnAndroid={true}
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Input
              label="Name"
              value={expense.name}
              onChangeText={(text: string) => setExpense({ ...expense, name: text })}
              placeholder="Enter expense name"
              editable={!mutation.isPending}
              className={cn('text-base', mutation.isPending && 'opacity-70')}
            />
            {errors.name ? <Text className="text-red-500 text-xs mt-1">{errors.name}</Text> : null}
          </View>
          <View>
            <Input
              label="Amount"
              value={expense.amount}
              onChangeText={(text: string) => setExpense({ ...expense, amount: text })}
              placeholder="Enter amount"
              keyboardType="numeric"
              editable={!mutation.isPending}
              className={cn('text-base', mutation.isPending && 'opacity-70')}
            />
            {errors.amount ? <Text className="text-red-500 text-xs mt-1">{errors.amount}</Text> : null}
          </View>
          <View>
            <Input
              label="Description"
              value={expense.description}
              onChangeText={(text: string) => setExpense({ ...expense, description: text })}
              placeholder="Enter description"
              editable={!mutation.isPending}
              className={cn('text-base', mutation.isPending && 'opacity-70')}
            />
            {errors.description ? <Text className="text-red-500 text-xs mt-1">{errors.description}</Text> : null}
          </View>
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-2">Category</Text>
            <Picker
              selectedValue={expense.category}
              onValueChange={(value: string) => setExpense({ ...expense, category: value })}
              enabled={!mutation.isPending}
              style={{ backgroundColor: '#F3F4F6', borderRadius: 8 }}
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
            {errors.category ? <Text className="text-red-500 text-xs mt-1">{errors.category}</Text> : null}
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
            {errors.date ? <Text className="text-red-500 text-xs mt-1">{errors.date}</Text> : null}
          </View>
          <View>
            <Input
              label="Title (Optional)"
              value={expense.title}
              onChangeText={(text: string) => setExpense({ ...expense, title: text })}
              placeholder="Enter title"
              editable={!mutation.isPending}
              className={cn('text-base', mutation.isPending && 'opacity-70')}
            />
            {errors.title ? <Text className="text-red-500 text-xs mt-1">{errors.title}</Text> : null}
          </View>
          <View>
            <Input
              label="Note (Optional)"
              value={expense.note}
              onChangeText={(text: string) => setExpense({ ...expense, note: text })}
              placeholder="Enter note"
              multiline
              editable={!mutation.isPending}
              className={cn('text-base', mutation.isPending && 'opacity-70')}
            />
            {errors.note ? <Text className="text-red-500 text-xs mt-1">{errors.note}</Text> : null}
          </View>
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
        </KeyboardAwareScrollView>
      </Animated.View>
    </View>
  );
}