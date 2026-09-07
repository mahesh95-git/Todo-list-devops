export interface User {
  id: number;
  email: string;
  name?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  id: number;
  email: string;
  name?: string | null;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}
