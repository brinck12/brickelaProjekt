export interface User {
  id: number;
  email: string;
  Keresztnev: string;
  Vezeteknev: string;
  Telefonszam: string;
  Osztaly: "Adminisztrátor" | "Felhasználó" | "Barber";
  UgyfelID: number;
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
  Vezeteknev: string;
  Email: string;
  Telefonszam: string;
}

export interface UserData {
  Keresztnev: string;
  Vezeteknev: string;
  Email: string;
  Telefonszam: string;
}
