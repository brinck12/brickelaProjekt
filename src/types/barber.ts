export interface Barber {
  id: number;
  nev: string;
  email: string;
  kep: string;
  evtapasztalat: string;
  specializacio: string;
  reszletek?: string;
  KezdesIdo: string;
  BefejezesIdo: string;
  Aktiv: number; // 0 vagy 1
  Keresztnev: string;
  Vezeteknev: string;
}

export interface BarberSchedule {
  startTime: string;
  endTime: string;
  bookedTimes: string[];
}
