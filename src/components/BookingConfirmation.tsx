import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Home } from "lucide-react";
import { BookingDetails } from "../types/bookingdetails";
export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as BookingDetails;

  if (!booking) {
    return (
      <div className="min-h-screen bg-barber-primary flex items-center justify-center">
        <div className="text-barber-accent">No booking information found.</div>
      </div>
    );
  }

  const addToCalendar = () => {
    const startTime = `${booking.date}T${booking.time}:00`;
    const durationInMs = (booking.service?.duration || 20) * 60 * 1000; // Convert service duration to milliseconds

    // Create date objects and handle timezone
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + durationInMs);

    // Format dates in GMT+1
    const formatDateToGMTPlus1 = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };

    const formattedStartTime = formatDateToGMTPlus1(startDate);
    const formattedEndTime = formatDateToGMTPlus1(endDate);

    const text = `Fodrász időpont - ${booking.barberName}`;
    const details = `Szolgáltatás: ${booking.serviceName}\nFodrász: ${booking.barberName}`;

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      text
    )}&details=${encodeURIComponent(
      details
    )}&dates=${formattedStartTime}/${formattedEndTime}`;

    window.open(calendarUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-barber-primary p-8">
      <div className="max-w-2xl mx-auto bg-barber-dark rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-barber-accent mb-4">
            Foglalás Megerősítve!
          </h1>
          <p className="text-barber-light">
            Köszönjük a foglalást! Az alábbi időpontot lefoglaltuk Önnek:
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-barber-primary p-6 rounded-lg">
            <h2 className="text-xl font-bold text-barber-accent mb-4">
              Foglalás Részletei
            </h2>
            <div className="space-y-2 text-barber-light">
              <p>
                <span className="font-semibold">Fodrász:</span>{" "}
                {booking.barberName}
              </p>
              <p>
                <span className="font-semibold">Szolgáltatás:</span>{" "}
                {booking.serviceName}
              </p>
              <p>
                <span className="font-semibold">Dátum:</span> {booking.date}
              </p>
              <p>
                <span className="font-semibold">Időpont:</span> {booking.time}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-barber-primary hover:bg-barber-secondary/20 text-barber-light py-3 px-6 rounded-lg transition-colors"
          >
            <Home size={20} />
            Főoldal
          </button>

          <button
            onClick={addToCalendar}
            className="flex items-center justify-center gap-2 bg-barber-accent hover:bg-barber-secondary text-barber-primary py-3 px-6 rounded-lg transition-colors"
          >
            <Calendar size={20} />
            Naptárhoz Adás
          </button>
          <button
            onClick={() => navigate("/appointments")}
            className="flex items-center justify-center gap-2 bg-barber-primary hover:bg-barber-secondary/20 text-barber-light py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Foglalásaim
          </button>
        </div>
      </div>
    </div>
  );
}
