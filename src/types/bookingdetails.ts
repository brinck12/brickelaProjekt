export interface BookingDetails {
  barberName?: string;
  serviceName?: string;
  date: string;
  time: string;
  service?: {
    duration?: number;
    price?: number;
    name?: string;
  };
  megjegyzes?: string;
}
