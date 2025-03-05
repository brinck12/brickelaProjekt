import { X } from "lucide-react";
import { RecentAppointment } from "../../types/appointment";

interface ViewAppointmentModalProps {
  appointment: RecentAppointment;
  onClose: () => void;
}

export function ViewAppointmentModal({
  appointment,
  onClose,
}: ViewAppointmentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-barber-dark p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-barber-accent">
            Foglalás részletei
          </h3>
          <button
            onClick={onClose}
            className="text-barber-light hover:text-barber-accent"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-barber-light text-sm">Ügyfél</label>
            <p className="text-white font-medium">{appointment.customerName}</p>
          </div>
          <div>
            <label className="text-barber-light text-sm">Szolgáltatás</label>
            <p className="text-white font-medium">{appointment.service}</p>
          </div>
          <div>
            <label className="text-barber-light text-sm">Borbély</label>
            <p className="text-white font-medium">
              {appointment.barberName || "Nincs hozzárendelve"}
            </p>
          </div>
          <div>
            <label className="text-barber-light text-sm">Dátum és idő</label>
            <p className="text-white font-medium">
              {appointment.date} at {appointment.time}
            </p>
          </div>
          <div>
            <label className="text-barber-light text-sm">Állapot</label>
            <p className="text-white font-medium">{appointment.status}</p>
          </div>
          {appointment.note && (
            <div>
              <label className="text-barber-light text-sm">Megjegyzés</label>
              <p className="text-white font-medium">{appointment.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
