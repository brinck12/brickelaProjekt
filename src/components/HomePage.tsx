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
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-barber-primary/10 transition-colors duration-300">
      <div className="text-barber-accent text-xl">{icon}</div>
      <div className="text-barber-light text-lg">{children}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-serif text-barber-accent mb-4">
        {children}
      </h2>
      <div className="flex items-center justify-center gap-4">
        <div className="h-[2px] w-16 bg-barber-secondary" />
        <Scissors
          className="h-6 w-6 text-barber-secondary rotate-45"
          strokeWidth={1.5}
        />
        <div className="h-[2px] w-16 bg-barber-secondary" />
      </div>
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
        <div className="relative h-screen overflow-hidden">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed transform hover:scale-105 transition-transform duration-[3000ms]"
            style={{
              backgroundImage:
                'url("http://localhost/project/src/imgs/homepage.avif")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-barber-dark/80 to-barber-primary" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
            {/* Logo and decorative elements */}
            <div className="mb-12 animate-fade-in">
              <Scissors
                className="h-20 w-20 mx-auto mb-6 text-barber-accent rotate-45 hover:rotate-[225deg] transition-transform duration-700"
                strokeWidth={1.5}
              />
              <div className="flex items-center justify-center gap-4">
                <div className="h-[2px] w-32 bg-barber-accent" />
                <div className="h-2 w-2 bg-barber-accent rotate-45" />
                <div className="h-[2px] w-32 bg-barber-accent" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-barber-light font-serif tracking-wider">
              BrickEla Cuts
            </h1>
            <p className="text-2xl md:text-3xl text-barber-secondary mb-12 font-light tracking-[0.2em]">
              KLASSZIKUS ÉS MODERN STÍLUSOK
            </p>
            <button
              onClick={() => navigate("/services")}
              className="px-12 py-4 bg-transparent text-barber-accent text-lg font-semibold 
                       hover:bg-barber-accent hover:text-barber-primary transition-all duration-300
                       border-2 border-barber-accent hover:border-barber-accent
                       transform hover:scale-105 active:scale-95"
            >
              FOGLALÁS MOST
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="h-12 w-[2px] bg-barber-accent mx-auto" />
          </div>
        </div>

        {/* About Section */}
        <div id="story" className="bg-barber-pattern py-32">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle>Történetünk</SectionTitle>
            <div className="space-y-8 text-center">
              <p className="text-barber-light text-xl leading-relaxed">
                A BrickEla Cuts 1950-ben alakult, és több mint 70 éve a közösség
                alapköve. Ami egy szerény, egy székkel rendelkező
                borbélyüzletként indult, mára egy prémium fodrászati célponttá
                vált, miközben megőrizte elkötelezettségét a minőség és a
                hagyományos szolgáltatás iránt.
              </p>
              <p className="text-barber-light text-xl leading-relaxed">
                Mesterek borbélyaink a hagyományos technikákat ötvözik a modern
                stílusokkal, hogy mindig tökéletes frizurát adjanak. Büszkék
                vagyunk arra, hogy egy olyan vendégszerető légkört teremtünk,
                ahol a vendégek nyugodtan pihenhetnek és élvezhetik az
                autentikus borbély élményt.
              </p>
            </div>
          </div>
        </div>

        {/* Services Preview */}
        <div className="py-32 bg-barber-dark">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle>Szolgáltatásaink</SectionTitle>
            <div className="grid md:grid-cols-3 gap-12">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="max-w-6xl mx-auto py-32 px-6">
          <div
            id="contact"
            className="bg-barber-dark p-12 rounded-2xl shadow-2xl scroll-mt-20 border border-barber-accent/20"
          >
            <SectionTitle>Kapcsolat & Helyszín</SectionTitle>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <ContactItem icon={<MapPin />}>
                  123 Fő utca, Belváros, Város 12345
                </ContactItem>
                <ContactItem icon={<Phone />}>(555) 123-4567</ContactItem>
              </div>
              <div className="space-y-6">
                <ContactItem icon={<Mail />}>info@brickelacuts.com</ContactItem>
                <ContactItem icon={<Clock />}>
                  <div className="space-y-1">
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

// Service card component
interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
}

function ServiceCard({ image, title, description, price }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl transform hover:-translate-y-2 transition-all duration-500">
      <img
        src={image}
        alt={title}
        className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-barber-dark via-barber-dark/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-2xl font-serif text-barber-accent mb-4">{title}</h3>
        <p className="text-barber-light/90 text-lg mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {description}
        </p>
        <p className="text-barber-secondary text-xl font-semibold">{price}</p>
      </div>
    </div>
  );
}

// Services data
const services = [
  {
    image: "http://localhost/project/src/imgs/display1.avif",
    title: "Klasszikus Vágás",
    description: "Hagyományos vágás precizitással és stílussal",
    price: "12.000 Ft-tól",
  },
  {
    image: "http://localhost/project/src/imgs/display2.avif",
    title: "Szakállformázás",
    description: "Szakértő szakállformázás és ápolás",
    price: "8.000 Ft-tól",
  },
  {
    image: "http://localhost/project/src/imgs/display3.avif",
    title: "Meleg Törölközős Borotválás",
    description: "Luxus hagyományos borotválás",
    price: "15.000 Ft-tól",
  },
];
