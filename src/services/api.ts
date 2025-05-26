import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, SignupCredentials } from '../types/user';

const API_URL = 'http://localhost:3000';

export const loginUser = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      params: { email: credentials.email, password: credentials.password },
    });
    const user = response.data.length > 0 ? response.data[0] : null;
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const signupUser = async (credentials: SignupCredentials): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      ...credentials,
      id: Math.random().toString(36).substr(2, 9),
    });
    const user = response.data;
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Signup error:', error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem('user');
};

export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user from storage:', error);
    return null;
  }
};