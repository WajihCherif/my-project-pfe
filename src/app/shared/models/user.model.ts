export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password?: string;
  role: string;
}
