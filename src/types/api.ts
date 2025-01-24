import { Appointment } from "./appointment";
import { User } from "./user";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  appointments?: T extends Appointment[] ? Appointment[] : never;
  token?: string;
  user?: T extends User ? User : never;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface BookingData {
  barberId: string | number;
  serviceId: string | number;
  date: string;
  time: string;
  userId?: number;
  megjegyzes?: string;
}

export interface ApiError {
  success: false;
  message: string;
  status?: number;
}
