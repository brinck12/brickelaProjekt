import AppointmentCard from "./AppointmentCard";
import { useAppointments } from "../hooks/useAppointments";

export default function AppointmentHistory() {
  const { appointments, loading, error } = useAppointments();

  return (
    <div className="bg-barber-dark rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-serif font-bold mb-6 text-barber-accent">
        Időpont Előzmények
      </h2>

      {loading && <p className="text-barber-light">Betöltés...</p>}

      {error && <p className="text-red-400">{error}</p>}

      <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-barber-accent scrollbar-track-barber-primary hover:scrollbar-thumb-barber-secondary">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
        {!loading && appointments.length === 0 && (
          <p className="text-barber-light">Nincsenek időpontok.</p>
        )}
      </div>
    </div>
  );
}
