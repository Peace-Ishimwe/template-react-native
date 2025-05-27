export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Expense {
  id: string;
  createdAt: string;
  name: string;
  amount: string;
  description: string;
  userId?: string;
  category?: string;
  date?: string;
  title?: string;
  note?: string;
}