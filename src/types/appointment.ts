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
