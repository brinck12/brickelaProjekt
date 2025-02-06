import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent double verification attempts
      if (verificationAttempted.current) {
        return;
      }
      verificationAttempted.current = true;

      const token = searchParams.get("token");
      console.log("Verifying token:", token); // Debug log

      if (!token) {
        setStatus("error");
        setMessage("A megerősítő token hiányzik");
        return;
      }

      try {
        console.log("Making verification request..."); // Debug log
        const response = await axios.get(
          `http://localhost/project/src/api/verify-email.php?token=${token}`
        );
        console.log("Verification response:", response.data); // Debug log

        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error("Verification error:", error); // Debug log
        setStatus("error");
        setMessage(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Hiba történt az email cím megerősítése közben"
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-barber-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-barber-dark rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-semibold text-barber-accent text-center mb-6">
            Email Megerősítés
          </h1>

          <div className="text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-accent"></div>
                <p className="text-barber-light">
                  Email cím megerősítése folyamatban...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="text-green-500 text-6xl">✓</div>
                <p className="text-barber-light">{message}</p>
                <p className="text-sm text-barber-light/70">
                  Átirányítás a bejelentkezéshez...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="text-red-500 text-6xl">✕</div>
                <p className="text-barber-light">{message}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-4 px-4 py-2 bg-barber-accent text-white rounded hover:bg-barber-accent/90 transition-colors"
                >
                  Vissza a bejelentkezéshez
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
