export interface Barber {
  id: number;
  nev: string;
  kep: string;
  evtapasztalat: string;
  specializacio: string;
  reszletek: string;
  startTime: number; // Starting hour (e.g., 8 for 8 AM)
  endTime: number; // Ending hour (e.g., 16 for 4 PM)
}
