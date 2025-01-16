export interface Appointment {
  id: number;
  barberName: string;
  date: string;
  time: string;
  status: "Foglalt" | "Teljesítve" | "Lemondva";
  service: string;
  note?: string;
}
