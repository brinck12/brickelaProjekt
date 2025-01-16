export interface User {
  id: number;
  Keresztnev: string;
  Email: string;
  Telefonszam: string;
  Osztaly: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
