import { useState } from "react";
import { User, Menu, X, LogIn } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-barber-dark/95 backdrop-blur-sm border-b border-barber-secondary/10 relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-barber-accent font-serif text-2xl">
            BrickEla
          </Link>

          {/* Navigation links with vintage hover effect */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("story")}
              className="text-barber-light hover:text-barber-accent transition-colors
                       relative group"
            >
              Történetünk
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-barber-accent
                           group-hover:w-full transition-all duration-300"
              />
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-barber-light hover:text-barber-accent transition-colors
                       relative group"
            >
              Kapcsolat
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-barber-accent
                           group-hover:w-full transition-all duration-300"
              />
            </button>
            <button
              onClick={() => navigate("/services")}
              className="text-barber-light hover:text-barber-accent transition-colors
                       relative group"
            >
              Foglalás
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-barber-accent
                           group-hover:w-full transition-all duration-300"
              />
            </button>
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 hover:bg-barber-dark rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-barber-accent" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-barber-dark rounded-lg shadow-lg py-2 z-[100]">
                  {user?.Osztaly === "Adminisztrátor" && (
                    <>
                      <div className="px-4 py-2 text-sm text-barber-accent border-b border-barber-secondary/20">
                        Admin fiók
                      </div>
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-barber-primary text-barber-accent"
                      >
                        Admin Irányítópult
                      </button>
                    </>
                  )}
                  {user?.Osztaly === "Barber" && (
                    <>
                      <div className="px-4 py-2 text-sm text-barber-accent border-b border-barber-secondary/20">
                        Barber fiók
                      </div>
                      <button
                        onClick={() => {
                          navigate("/barber");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-barber-primary text-barber-accent"
                      >
                        Barber Irányítópult
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      navigate("/appointments");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-barber-primary text-barber-accent"
                  >
                    Személyes foglalásaim
                  </button>
                  <button
                    onClick={() => {
                      navigate("/", { replace: true });
                      setTimeout(() => {
                        logout();
                        setIsDropdownOpen(false);
                      }, 100);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-barber-primary text-red-400"
                  >
                    Kijelentkezés
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <LogIn className="w-5 h-5 text-barber-accent" />
            </Link>
          )}

          {/* Mobil menü gomb */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-indigo-400" />
            ) : (
              <Menu className="w-6 h-6 text-indigo-400" />
            )}
          </button>
        </div>

        {/* Mobil menü */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-8 pb-8">
            <div className="flex justify-center gap-8 mb-8">
              <button
                onClick={() => scrollToSection("story")}
                className="text-barber-light hover:text-barber-accent transition-colors
                         relative group"
              >
                Történetünk
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px bg-barber-accent
                             group-hover:w-full transition-all duration-300"
                />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-barber-light hover:text-barber-accent transition-colors
                         relative group"
              >
                Kapcsolat
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px bg-barber-accent
                             group-hover:w-full transition-all duration-300"
                />
              </button>
              <button
                onClick={() => {
                  navigate("/services");
                  setIsMobileMenuOpen(false);
                }}
                className="text-barber-light hover:text-barber-accent transition-colors
                         relative group"
              >
                Foglalás
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px bg-barber-accent
                             group-hover:w-full transition-all duration-300"
                />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col items-center space-y-4">
                <hr className="border-slate-800 w-full mb-4" />
                {user?.Osztaly === "Adminisztrátor" && (
                  <div className="text-sm text-indigo-400">Admin fiók</div>
                )}
                <button
                  onClick={() => {
                    navigate("/appointments");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Személyes foglalásaim
                </button>
                <button
                  onClick={() => {
                    navigate("/", { replace: true });
                    setTimeout(() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }, 100);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  Kijelentkezés
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  <LogIn className="w-6 h-6" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
