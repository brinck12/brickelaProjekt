export interface Appointment {
  id: number;
  barberName: string;
  date: string;
  time: string;
  status: "Foglalt" | "Teljesítve" | "Lemondva";
  service: string;
  note?: string;
  UgyfelID?: number;
  FodraszID?: number;
  SzolgaltatasID?: number;
  FoglalasDatum: string;
  FoglalasIdo: string;
  Allapot: "Foglalt" | "Teljesítve" | "Lemondva";
  Megjegyzes?: string;
  LetrehozasIdopontja: string;
  barberId: number;
  serviceId: number;
  userId: number;
}

export interface AppointmentCreation {
  barberId: number;
  serviceId: number;
  date: string;
  time: string;
  megjegyzes?: string;
}

export interface AppointmentAvailability {
  date: string;
  barberId: number;
  availableSlots: string[];
}

export interface RecentAppointment {
  id: number;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: string;
  note?: string;
  barberId?: number;
  barberName?: string;
}
