export interface User {
  id: number;
  Keresztnev: string;
  Vezeteknev: string;
  Email: string;
  Telefonszam: string;
  Osztaly: "Adminisztrátor" | "Felhasználó";
  RegisztracioIdopontja: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  telefonszam: string;
}

export interface UserUpdateData {
  Keresztnev: string;
  Email: string;
  Telefonszam: string;
}
