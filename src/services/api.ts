import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, User } from '@/src/types';

const API_BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const loginUser = async (username: string): Promise<User[]> => {
  const response = await api.get<User[]>(`/users?username=${username}`);
  if (response.data[0]) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data[0]));
  }
  return response.data;
};

export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error retrieving user from storage:', error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  const response = await api.put<User>(`/users/${userId}`, updates);
  await AsyncStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem('user');
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  const user = await getStoredUser();
  const response = await api.post<Expense>('/expenses', {
    ...expense,
    createdAt: new Date().toISOString(),
    userId: user?.id,
  });
  return response.data;
};

export const getExpenses = async (): Promise<Expense[]> => {
  const user = await getStoredUser();
  const response = await api.get<Expense[]>(`/users/${user?.id}/expenses`);
  return response.data;
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  const response = await api.get<Expense>(`/expenses/${id}`);
  return response.data;
};

export const updateExpense = async (id: string, expense: any): Promise<Expense> => {
  const response = await api.put<Expense>(`/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};

export default api;