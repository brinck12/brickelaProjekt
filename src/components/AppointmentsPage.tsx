import Navbar from "./Navbar";
import AccountDetails from "./AccountDetails";
import AppointmentHistory from "./AppointmentHistory";

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-barber-primary">
      <Navbar />
      <div className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 md:mb-8 text-barber-accent">
            Profilom
          </h1>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <AccountDetails />
            <AppointmentHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
