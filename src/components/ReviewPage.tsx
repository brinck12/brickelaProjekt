import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { submitReview } from "../api/apiService";
import { ApiError } from "../api/apiService";

const ReviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setError(
        "Hiányzó értékelési token. Kérjük, használja az e-mailben kapott linket."
      );
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Hiányzó értékelési token");
      return;
    }

    if (rating === 0) {
      setError("Kérjük, adjon értékelést (1-5 csillag)");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("Értékelés beküldése...");

    try {
      const response = await submitReview(token, rating, comment);
      setSuccess(true);
      setMessage(response.message || "Köszönjük az értékelést!");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Hiba történt az értékelés beküldésekor");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-3xl ${
              rating >= star ? "text-yellow-500" : "text-gray-300"
            }`}
            aria-label={`${star} csillag`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-barber-primary flex items-center justify-center p-4">
      <div className="bg-barber-dark rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-barber-accent">
          Értékelés
        </h1>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-900/20 border border-green-500 text-green-300 p-4 rounded-lg">
            <p className="text-xl mb-2">✓ {message}</p>
            <p>Köszönjük, hogy időt szakított az értékelésre!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-barber-light">Értékelés</label>
              {renderStars()}
              <p className="text-barber-secondary text-sm">
                {rating > 0
                  ? `${rating} csillag`
                  : "Kattintson a csillagokra az értékeléshez"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-barber-light">
                Megjegyzés (opcionális)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 bg-barber-primary border border-barber-secondary/20 rounded-lg text-barber-light resize-none"
                rows={4}
                placeholder="Ossza meg velünk véleményét..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !token}
              className="w-full bg-barber-accent hover:bg-barber-secondary text-barber-primary py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Beküldés..." : "Értékelés beküldése"}
            </button>

            {message && !error && !success && (
              <p className="text-barber-secondary text-center">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
