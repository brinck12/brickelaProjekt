import { Clock } from "lucide-react";
import { Service } from "../types/service";

interface ServiceCardProps {
  service: Service;
  onSelect: () => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div className="bg-barber-primary border border-barber-secondary/20 rounded-none hover:border-barber-accent transition-all duration-300">
      <img
        src={service.image}
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-serif mb-2 text-barber-accent">
          {service.name}
        </h3>
        <p className="text-barber-light/80 mb-4">{service.description}</p>
        <div className="flex justify-between items-center mb-6 text-barber-secondary">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{service.duration}</span>
          </div>
          <span className="text-barber-accent font-semibold">
            ${service.price}
          </span>
        </div>

        <button
          onClick={onSelect}
          className="w-full bg-barber-primary border-2 border-barber-accent text-barber-accent 
                   hover:bg-barber-accent hover:text-barber-primary py-2 transition-colors duration-300"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
