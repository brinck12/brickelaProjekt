import AppointmentCard from "./AppointmentCard";
import { useAppointments } from "../hooks/useAppointments";

export default function AppointmentHistory() {
  const { appointments } = useAppointments();

  return (
    <div className="bg-barber-dark rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-serif font-bold mb-6 text-barber-accent">
        Időpont Előzmények
      </h2>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
