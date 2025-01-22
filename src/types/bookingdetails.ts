export interface BookingDetails {
  barberName?: string;
  serviceName?: string;
  date: string;
  time: string;
  service?: {
    duration?: number;
  };
}
