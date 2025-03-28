import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cancelBooking, ApiError } from "../api/apiService";

export function CancelBooking() {
  //console.log("CancelBooking component mounted");

  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const cancellationAttempted = useRef(false);

  useEffect(() => {
    const performCancellation = async () => {
      if (cancellationAttempted.current) {
        return;
      }
      cancellationAttempted.current = true;

      //console.log("Starting cancellation process");
      const token = searchParams.get("token");
      //console.log("Token from URL:", token);

      if (!token) {
        setStatus("error");
        setMessage("A lemondási token hiányzik");
        return;
      }

      try {
        //console.log("Making API request...");
        const response = await cancelBooking(token);
        //console.log("API Response:", response);

        setStatus("success");
        setMessage(response.message || "Időpont sikeresen lemondva");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error("Cancellation error:", error);
        setStatus("error");
        if (error instanceof ApiError) {
          setMessage(error.message);
        } else {
          setMessage("Hiba történt az időpont lemondása közben");
        }
      }
    };

    performCancellation();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-barber-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-barber-dark rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-semibold text-barber-accent text-center mb-6">
            Időpont lemondása
          </h1>

          <div className="text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-accent"></div>
                <p className="text-barber-light">
                  Időpont lemondása folyamatban...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="text-green-500 text-6xl">✓</div>
                <p className="text-barber-light">{message}</p>
                <p className="text-sm text-barber-light/70">
                  Átirányítás a főoldalra...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="text-red-500 text-6xl">✕</div>
                <p className="text-barber-light">{message}</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-4 py-2 bg-barber-accent text-white rounded hover:bg-barber-accent/90 transition-colors"
                >
                  Vissza a főoldalra
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
