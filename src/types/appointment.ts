export interface Appointment {
  id: number;
  barberName: string;
  date: string;
  time: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  service?: string;
}