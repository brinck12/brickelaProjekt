import React from "react";
import { MapPin, Phone, Mail, Clock, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

interface ContactItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ContactItem({ icon, children }: ContactItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-barber-accent">{icon}</div>
      <div className="text-barber-light">{children}</div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-barber-primary">
        <Navbar />

        {/* Hero Section */}
        <div className="relative h-[80vh] overflow-hidden">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("http://localhost/project/src/imgs/homepage.avif")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-barber-dark/70 to-barber-primary/90" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
            {/* Decorative elements */}
            <div className="mb-8">
              <Scissors
                className="h-16 w-16 mx-auto mb-4 text-barber-accent rotate-45"
                strokeWidth={1.5}
              />
              <div className="h-px w-24 bg-barber-accent mx-auto" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-barber-light font-serif">
              BrickEla Cuts
            </h1>
            <p className="text-xl md:text-2xl text-barber-secondary mb-8 font-light">
              KLASSZIKUS ÉS MODERN STÍLUSOK
            </p>
            <button
              onClick={() => navigate("/services")}
              className="px-8 py-3 bg-barber-accent text-barber-primary font-semibold 
                       hover:bg-barber-secondary transition-colors duration-300
                       border-2 border-barber-accent hover:border-barber-secondary"
            >
              FOGLALÁS
            </button>
          </div>
        </div>

        {/* About Section with vintage styling */}
        <div id="story" className="bg-barber-pattern py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-barber-accent mb-4">
                Történetünk
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-barber-secondary" />
                <span className="text-barber-secondary">ALAPÍTVA 2024</span>
                <div className="h-px w-12 bg-barber-secondary" />
              </div>
            </div>

            <p className="text-barber-light text-lg leading-relaxed text-center">
              A BrickEla Cuts 1950-ben alakult, és több mint 70 éve a közösség
              alapköve. Ami egy szerény, egy székkel rendelkező borbélyüzletként
              indult, mára egy prémium fodrászati célponttá vált, miközben
              megőrizte elkötelezettségét a minőség és a hagyományos
              szolgáltatás iránt.
            </p>
            <p className="text-barber-light text-lg leading-relaxed text-center">
              Mesterek borbélyaink a hagyományos technikákat ötvözik a modern
              stílusokkal, hogy mindig tökéletes frizurát adjanak. Büszkék
              vagyunk arra, hogy egy olyan vendégszerető légkört teremtünk, ahol
              a vendégek nyugodtan pihenhetnek és élvezhetik az autentikus
              borbély élményt.
            </p>
          </div>
        </div>

        {/* Services Preview */}
        <div className="py-20 bg-barber-dark">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-serif text-barber-accent text-center mb-12">
              Szolgáltatásaink
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Classic Cut Card */}
              <div className="group relative overflow-hidden">
                <img
                  src="http://localhost/project/src/imgs/display1.avif"
                  alt="Klasszikus Hajvágás"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-barber-dark/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-serif text-barber-accent mb-2">
                    Klasszikus Vágás
                  </h3>
                  <p className="text-barber-light/80 text-sm mb-4">
                    Hagyományos vágás precizitással és stílussal
                  </p>
                  <p className="text-barber-secondary font-semibold">
                    12.000 Ft-tól
                  </p>
                </div>
              </div>

              {/* Beard Grooming Card */}
              <div className="group relative overflow-hidden">
                <img
                  src="http://localhost/project/src/imgs/display2.avif"
                  alt="Szakállformázás"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-barber-dark/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-serif text-barber-accent mb-2">
                    Szakállformázás
                  </h3>
                  <p className="text-barber-light/80 text-sm mb-4">
                    Szakértő szakállformázás és ápolás
                  </p>
                  <p className="text-barber-secondary font-semibold">
                    8.000 Ft-tól
                  </p>
                </div>
              </div>

              {/* Hot Towel Shave Card */}
              <div className="group relative overflow-hidden">
                <img
                  src="http://localhost/project/src/imgs/display3.avif"
                  alt="Meleg Törölközős Borotválás"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-barber-dark/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-serif text-barber-accent mb-2">
                    Meleg Törölközős Borotválás
                  </h3>
                  <p className="text-barber-light/80 text-sm mb-4">
                    Luxus hagyományos borotválás
                  </p>
                  <p className="text-barber-secondary font-semibold">
                    15.000 Ft-tól
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section with vintage styling */}
        <div className="max-w-6xl mx-auto py-8 md:py-16 px-4">
          <div
            id="contact"
            className="bg-barber-dark p-6 md:p-8 rounded-lg shadow-lg scroll-mt-20"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-barber-accent">
              Kapcsolat & Helyszín
            </h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <ContactItem icon={<MapPin />}>
                  123 Fő utca, Belváros, Város 12345
                </ContactItem>
                <ContactItem icon={<Phone />}>(555) 123-4567</ContactItem>
              </div>
              <div className="space-y-4">
                <ContactItem icon={<Mail />}>info@brickelacuts.com</ContactItem>
                <ContactItem icon={<Clock />}>
                  <div>
                    <p>H-P: 9:00 - 20:00</p>
                    <p>Szo: 9:00 - 18:00</p>
                    <p>V: Zárva</p>
                  </div>
                </ContactItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
