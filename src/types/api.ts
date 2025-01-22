import { Appointment } from "./appointment";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  appointments?: T extends Appointment[] ? Appointment[] : never;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    Keresztnev: string;
    Email: string;
    Telefonszam: string;
    Osztaly: string;
  };
}

export interface BookingData {
  barberId: string | number;
  serviceId: string | number;
  date: string;
  time: string;
  userId?: number;
  megjegyzes?: string;
}
