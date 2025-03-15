import { Clock } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Barber } from "../types/barber";
import { fetchReviews } from "../api/apiService";
import { Review } from "../types/review";

interface BarberCardProps {
  barber: Barber;
  onSelect: () => void;
}

export default function BarberCard({ barber, onSelect }: BarberCardProps) {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

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
  }, [barber.id]);

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
    <div className="bg-barber-primary border border-barber-secondary/20 rounded-none hover:border-barber-accent transition-all duration-300 flex flex-col h-full">
      <img
        src={`http://localhost/project/src/imgs/${barber.kep}`}
        alt={barber.nev}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif mb-2 text-barber-accent">
          {barber.nev}
        </h3>
        <div className="h-20 overflow-y-auto mb-4">
          <p className="text-barber-light/80 whitespace-normal break-all">
            {barber.reszletek}
          </p>
        </div>
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
            <span className="whitespace-normal break-all">
              Vélemények ({reviewCount})
            </span>
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
                    <p className="whitespace-normal break-all">
                      {review.velemeny}
                    </p>
                    <div className="flex items-center mt-1">
                      {renderStars(review.ertekeles)}
                    </div>
                    <div className="text-xs text-barber-secondary mt-1 whitespace-normal break-all">
                      {review.ertekelo_neve}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full mt-auto bg-barber-primary border-2 border-barber-accent text-barber-accent 
                   hover:bg-barber-accent hover:text-barber-primary py-2 transition-colors duration-300"
        >
          Foglalás
        </button>
      </div>
    </div>
  );
}
