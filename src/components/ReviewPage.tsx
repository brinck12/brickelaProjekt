import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";

export function ReviewPage() {
  console.log("ReviewPage component mounted"); // Debug log

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect running");
    const token = searchParams.get("token");
    console.log("Token:", token);

    if (!token) {
      setStatus("error");
      setError("Érvénytelen értékelési link");
      return;
    }

    // Validate token
    const validateToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost/project/src/api/validate-review-token.php?token=${token}`
        );

        if (!response.data.success) {
          setStatus("error");
          setError(
            response.data.message || "Érvénytelen vagy lejárt értékelési link"
          );
        }
      } catch (err) {
        console.error("Token validation error:", err);
        setStatus("error");
        setError("Hiba történt a token ellenőrzése során");
      }
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (!token) {
      setError("Érvénytelen értékelési link");
      return;
    }

    if (rating === 0) {
      setError("Kérjük, adjon értékelést");
      return;
    }

    try {
      setStatus("loading");
      const response = await axios.post(
        "http://localhost/project/src/api/submit-review.php",
        {
          token,
          rating,
          comment,
        }
      );

      if (response.data.success) {
        setStatus("success");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        throw new Error(
          response.data.message || "Hiba történt az értékelés beküldése során"
        );
      }
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Hiba történt az értékelés beküldése során"
      );
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-barber-primary flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-barber-dark rounded-lg shadow-xl p-8 text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold text-barber-accent mb-4">
              Köszönjük az értékelést!
            </h2>
            <p className="text-barber-light mb-4">
              Az Ön visszajelzése segít nekünk a szolgáltatásunk fejlesztésében.
            </p>
            <p className="text-sm text-barber-light/70">
              Átirányítás a főoldalra...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-barber-primary flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-barber-dark rounded-lg shadow-xl p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">✕</div>
            <h2 className="text-2xl font-semibold text-barber-accent mb-4">
              Hiba történt
            </h2>
            <p className="text-barber-light mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-barber-accent text-white rounded hover:bg-barber-accent/90 transition-colors"
            >
              Vissza a főoldalra
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-barber-dark rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-barber-accent mb-6">
            Értékelje a szolgáltatásunkat
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-barber-light mb-2">Értékelés</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-barber-light mb-2">
                Vélemény (opcionális)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 bg-barber-primary text-white rounded resize-none h-32"
                placeholder="Írja le véleményét..."
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-barber-accent text-white py-2 rounded hover:bg-barber-accent/90 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Küldés..." : "Értékelés beküldése"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
