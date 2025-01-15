export interface User {
  id: string;
  Email: string;
  Osztaly: "admin" | "user";
  Keresztnev: string;
  Telefonszam: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
