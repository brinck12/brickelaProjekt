import { X } from "lucide-react";

interface EditFormData {
  date: string;
  time: string;
  status: string;
  note: string;
}

interface EditAppointmentModalProps {
  formData: EditFormData;
  onFormChange: (data: Partial<EditFormData>) => void;
  onSave: () => void;
  onClose: () => void;
}

export function EditAppointmentModal({
  formData,
  onFormChange,
  onSave,
  onClose,
}: EditAppointmentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-barber-dark p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-barber-accent">
            Foglalás szerkesztése
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
            <label className="text-barber-light text-sm block mb-1">
              Dátum
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => onFormChange({ date: e.target.value })}
              className="w-full px-3 py-2 rounded bg-barber-primary text-white focus:outline-none focus:ring-2 focus:ring-barber-accent"
            />
          </div>
          <div>
            <label className="text-barber-light text-sm block mb-1">
              Időpont
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => onFormChange({ time: e.target.value })}
              className="w-full px-3 py-2 rounded bg-barber-primary text-white focus:outline-none focus:ring-2 focus:ring-barber-accent"
            />
          </div>
          <div>
            <label className="text-barber-light text-sm block mb-1">
              Státusz
            </label>
            <select
              value={formData.status}
              onChange={(e) => onFormChange({ status: e.target.value })}
              className="w-full px-3 py-2 rounded bg-barber-primary text-white focus:outline-none focus:ring-2 focus:ring-barber-accent"
            >
              <option value="teljesítve">Teljesítve</option>
              <option value="foglalt">Foglalt</option>
              <option value="lemondva">Lemondva</option>
            </select>
          </div>
          <div>
            <label className="text-barber-light text-sm block mb-1">
              Megjegyzés
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => onFormChange({ note: e.target.value })}
              className="w-full px-3 py-2 rounded bg-barber-primary text-white focus:outline-none focus:ring-2 focus:ring-barber-accent resize-none h-24"
              placeholder="Add a note..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-barber-primary text-white hover:bg-barber-primary/90 transition-colors"
            >
              Mégsem
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded bg-barber-accent text-white hover:bg-barber-accent/90 transition-colors"
            >
              Változtatások mentése
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
