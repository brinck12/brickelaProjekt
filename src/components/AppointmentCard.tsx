import { Calendar, Clock, User } from "lucide-react";
import { Appointment } from "../types/appointment";

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div className="border border-barber-secondary/20 rounded-lg p-4 hover:border-barber-accent transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-barber-accent" />
          <span className="text-barber-light">{appointment.barberName}</span>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${
            appointment.status === "completed"
              ? "bg-green-900/50 text-green-200"
              : appointment.status === "upcoming"
              ? "bg-blue-900/50 text-blue-200"
              : "bg-red-900/50 text-red-200"
          }`}
        >
          {appointment.status === "completed"
            ? "Teljesítve"
            : appointment.status === "upcoming"
            ? "Közelgő"
            : "Törölve"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-barber-light">
          <Calendar className="w-4 h-4 text-barber-accent" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-barber-light">
          <Clock className="w-4 h-4 text-barber-accent" />
          <span>{appointment.time}</span>
        </div>
      </div>
    </div>
  );
}
