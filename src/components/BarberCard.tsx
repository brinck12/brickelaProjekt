import { Clock, Image as ImageIcon } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Barber } from "../types/barber";
import { fetchReviews, fetchReferences } from "../api/apiService";
import { Review } from "../types/review";

interface Reference {
  id: number;
  image: string;
  description?: string;
  createdAt: string;
}

interface BarberCardProps {
  barber: Barber;
  onSelect: () => void;
}

export default function BarberCard({ barber, onSelect }: BarberCardProps) {
  const [showReviews, setShowReviews] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isLoadingReferences, setIsLoadingReferences] = useState(false);

  useEffect(() => {
    const getReviewCount = async () => {
      try {
        const response = await fetchReviews(barber.id);
        if (response && response.data) {
          setReviewCount(response.data.length);
        }
      } catch (error) {
        console.error("Failed to fetch review count:", error);
      }
    };

    getReviewCount();
  }, []);

  useEffect(() => {
    if (showReviews) {
      const getReviews = async () => {
        setIsLoadingReviews(true);
        try {
          const response = await fetchReviews(barber.id);
          if (response && response.data) {
            setReviews(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
          setReviews([]);
        } finally {
          setIsLoadingReviews(false);
        }
      };

      getReviews();
    }
  }, [showReviews, barber.id]);

  useEffect(() => {
    if (showReferences) {
      const getReferences = async () => {
        setIsLoadingReferences(true);
        try {
          const response = await fetchReferences(barber.id);
          if (response && response.data) {
            setReferences(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch references:", error);
          setReferences([]);
        } finally {
          setIsLoadingReferences(false);
        }
      };

      getReferences();
    }
  }, [showReferences, barber.id]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="bg-barber-primary border border-barber-secondary/20 rounded-none hover:border-barber-accent transition-all duration-300">
      <img
        src={`http://localhost/project/src/imgs/${barber.kep}`}
        alt={barber.nev}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-serif mb-2 text-barber-accent">
          {barber.nev}
        </h3>
        <p className="text-barber-light/80 mb-4">{barber.reszletek}</p>
        <div className="flex justify-between items-center mb-6 text-barber-secondary">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{barber.evtapasztalat} év tapasztalat</span>
          </div>
          <span className="text-barber-accent font-semibold">
            {barber.specializacio}
          </span>
        </div>

        {/* Reviews Section */}
        <div className="mb-4">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="flex items-center gap-2 text-barber-accent hover:text-barber-secondary mb-2"
          >
            <FaStar size={16} />
            <span>Vélemények ({reviewCount})</span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showReviews ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mt-2 space-y-2">
              {isLoadingReviews ? (
                <p className="text-barber-light/80 text-sm">Betöltés...</p>
              ) : (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="text-barber-light/80 text-sm border-l-2 border-barber-accent pl-3"
                  >
                    <p>{review.velemeny}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(review.ertekeles)}
                    </div>
                    <div className="text-xs text-barber-secondary mt-1">
                      {review.ertekelo_neve}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Reference Works Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowReferences(!showReferences)}
            className="flex items-center gap-2 text-barber-accent hover:text-barber-secondary mb-2"
          >
            <ImageIcon size={16} />
            <span>Referencia Munkák</span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showReferences ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {isLoadingReferences ? (
              <p className="text-barber-light/80 text-sm">Betöltés...</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    onClick={() => setSelectedReference(ref)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={`http://localhost/project/src/imgs/references/${ref.image}`}
                      alt={ref.description || "Reference work"}
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal for full-size reference image */}
        {selectedReference && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setSelectedReference(null)}
          >
            <div className="max-w-2xl max-h-[90vh] p-4">
              <img
                src={`http://localhost/project/src/imgs/references/${selectedReference.image}`}
                alt={selectedReference.description || "Reference work"}
                className="max-w-full max-h-full object-contain"
              />
              {selectedReference.description && (
                <p className="text-barber-light mt-2 text-center">
                  {selectedReference.description}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onSelect}
          className="w-full bg-barber-primary border-2 border-barber-accent text-barber-accent 
                   hover:bg-barber-accent hover:text-barber-primary py-2 transition-colors duration-300"
        >
          Foglalás
        </button>
      </div>
    </div>
  );
}
