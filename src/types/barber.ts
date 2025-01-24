export interface Barber {
  id: number;
  nev: string;
  kep: string;
  evtapasztalat: string;
  specializacio: string;
  reszletek: string;
  startTime: string;
  endTime: string;
  Keresztnev: string;
  Vezeteknev: string;
  KezdesIdo: string;
  BefejezesIdo: string;
}

export interface BarberSchedule {
  startTime: string;
  endTime: string;
  bookedTimes: string[];
}
