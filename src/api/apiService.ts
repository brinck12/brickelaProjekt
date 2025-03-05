import axios, { AxiosError } from "axios";
import { ApiResponse, LoginResponse, BookingData } from "../types/api";
import { Appointment } from "../types/appointment";
//import { Reference } from "../types/reference";

/**
 * API hibakezelő osztály
 * Egyedi hibaüzenetek kezelésére szolgál az API kérések során
 */
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API hibák kezelésére szolgáló segédfüggvény
 * @param error - A kezelendő hiba objektum
 * @throws {ApiError} - Formázott hibaüzenettel dobja tovább a hibát
 */
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      error?: string;
      message?: string;
    }>;
    // First try to get the error message from the response data
    const errorMessage =
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      "Váratlan hiba történt";
    throw new ApiError(errorMessage, axiosError.response?.status);
  }
  throw error;
};

/**
 * Az API alap URL-je
 */
const API_BASE_URL = "http://localhost/project/src/api";

/**
 * Axios kliens az API kérésekhez
 * Alapértelmezett beállításokkal és fejlécekkel
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Beállítja a felhasználói tokent a localStorage-ban és az API kliens fejlécében
 * @param token - A beállítandó JWT token
 */
export const setUserToken = (token: string) => {
  localStorage.setItem("userToken", token);
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * Inicializálja az autentikációt a localStorage-ban tárolt token alapján
 * Az alkalmazás indításakor hívódik meg
 */
export const initializeAuth = () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    setUserToken(token);
  }
};

/**
 * Felhasználói bejelentkezés
 * @param email - A felhasználó email címe
 * @param password - A felhasználó jelszava
 * @returns {Promise<LoginResponse>} - A bejelentkezési válasz (token és felhasználói adatok)
 * @throws {ApiError} - Sikertelen bejelentkezés esetén
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      token?: string;
      user?: LoginResponse["user"];
      error?: string;
    }>("/login.php", { email, password });

    if (response.data.success && response.data.token && response.data.user) {
      setUserToken(response.data.token);
      return {
        token: response.data.token,
        user: response.data.user,
      };
    }
    throw new ApiError(response.data.error || "Bejelentkezés sikertelen");
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Felhasználói kijelentkezés
 * Törli a tokent a localStorage-ból és az API kliens fejlécéből
 */
export const logout = () => {
  localStorage.removeItem("userToken");
  delete apiClient.defaults.headers.common["Authorization"];
};

/**
 * Lekéri a bejelentkezett felhasználó adatait
 * @returns {Promise<any>} - A felhasználói adatokat tartalmazó válasz
 * @throws {Error} - Sikertelen lekérés esetén
 */
export const fetchUserData = async () => {
  console.log("Fetching user data...");
  console.log("Current token:", localStorage.getItem("userToken"));
  try {
    const response = await apiClient.get("/get-user-data.php");
    console.log("User data response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

/**
 * Frissíti a felhasználó adatait
 * @param data - A frissítendő felhasználói adatok
 * @returns {Promise<any>} - A frissítés eredménye
 * @throws {ApiError} - Sikertelen frissítés esetén
 */
export async function updateUserData(data: {
  Keresztnev: string;
  Vezeteknev: string;
  Email: string;
  Telefonszam: string;
}) {
  try {
    const response = await apiClient.post("/adatvaltoztatas.php", data);
    if (!response.data.success) {
      throw new ApiError(
        response.data.message || "Hiba történt az adatok frissítése során"
      );
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Új felhasználó regisztrálása
 * @param email - A felhasználó email címe
 * @param password - A felhasználó jelszava
 * @param keresztnev - A felhasználó keresztneve
 * @param vezeteknev - A felhasználó vezetékneve
 * @param telefonszam - A felhasználó telefonszáma
 * @returns {Promise<{data: {success: boolean; message: string}}>} - A regisztráció eredménye
 * @throws {ApiError} - Sikertelen regisztráció esetén
 */
export const register = async (
  email: string,
  password: string,
  keresztnev: string,
  vezeteknev: string,
  telefonszam: string
): Promise<{ data: { success: boolean; message: string } }> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/register.php", {
      email,
      password,
      keresztnev,
      vezeteknev,
      telefonszam,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Lekéri az összes fodrászt
 * @returns {Promise<any>} - A fodrászokat tartalmazó válasz
 */
export const fetchBarbers = () => {
  return apiClient.get("/barbers.php");
};

/**
 * Új fodrász hozzáadása (admin funkció)
 * @param formData - A fodrász adatait tartalmazó FormData objektum
 * @returns {Promise<any>} - A hozzáadás eredménye
 * @throws {ApiError} - Sikertelen hozzáadás esetén
 */
export const addBarber = async (formData: FormData) => {
  try {
    const response = await apiClient.post("/admin/add-barber.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to add barber");
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Fodrász törlése (admin funkció)
 * @param barberId - A törlendő fodrász azonosítója
 * @returns {Promise<any>} - A törlés eredménye
 * @throws {ApiError} - Sikertelen törlés esetén
 */
export const deleteBarber = async (barberId: number) => {
  try {
    const response = await apiClient.post("/admin/delete-barber.php", {
      barberId,
    });
    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to delete barber");
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Fodrász adatainak frissítése (admin funkció)
 * @param barberId - A frissítendő fodrász azonosítója
 * @param formData - A frissített adatokat tartalmazó FormData objektum
 * @returns {Promise<any>} - A frissítés eredménye
 * @throws {ApiError} - Sikertelen frissítés esetén
 */
export const updateBarber = async (barberId: number, formData: FormData) => {
  formData.append("barberId", barberId.toString());
  try {
    const response = await apiClient.post(
      "/admin/update-barber.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to update barber");
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Lekéri az összes szolgáltatást
 * @returns {Promise<any>} - A szolgáltatásokat tartalmazó válasz
 */
export const fetchServices = () => {
  return apiClient.get("/services.php");
};

/**
 * Új szolgáltatás hozzáadása (admin funkció)
 * @param data - A szolgáltatás adatai
 * @returns {Promise<any>} - A hozzáadás eredménye
 * @throws {ApiError} - Sikertelen hozzáadás esetén
 */
export const addService = async (data: {
  name: string;
  price: number;
  duration: number;
  description?: string;
}) => {
  try {
    const response = await apiClient.post("/admin/add-service.php", data);
    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to add service");
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Szolgáltatás adatainak frissítése (admin funkció)
 * @param serviceId - A frissítendő szolgáltatás azonosítója
 * @param data - A frissített szolgáltatás adatai
 * @returns {Promise<any>} - A frissítés eredménye
 * @throws {ApiError} - Sikertelen frissítés esetén
 */
export const updateService = async (
  serviceId: number,
  data: {
    name: string;
    price: number;
    duration: number;
    description?: string;
  }
) => {
  try {
    const response = await apiClient.post("/admin/update-service.php", {
      serviceId,
      ...data,
    });
    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to update service");
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Szolgáltatás törlése (admin funkció)
 * @param serviceId - A törlendő szolgáltatás azonosítója
 * @returns {Promise<any>} - A törlés eredménye
 * @throws {ApiError} - Sikertelen törlés esetén
 */
export async function deleteService(serviceId: number) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/delete-service.php`,
      {
        serviceId: serviceId,
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Failed to delete service");
    }
  } catch (error) {
    console.error("Delete service error:", error);
    throw new ApiError("Failed to delete service");
  }
}

/**
 * Ellenőrzi a foglalásokat egy adott fodrászhoz és dátumhoz
 * @param barberId - A fodrász azonosítója
 * @param date - A vizsgálandó dátum
 * @returns {Promise<any>} - A foglalásokat tartalmazó válasz
 */
export const checkAppointments = (barberId: string | number, date: string) => {
  return apiClient.post("/check-appointments.php", { barberId, date });
};

/**
 * Lekéri egy fodrász értékeléseit
 * @param barberId - A fodrász azonosítója
 * @returns {Promise<any>} - Az értékeléseket tartalmazó válasz
 */
export const fetchReviews = (barberId: number) => {
  return apiClient.post("/reviews.php", { barberId });
};

/**
 * Új foglalás létrehozása
 * @param bookingData - A foglalás adatai
 * @returns {Promise<void>} - A foglalás eredménye
 * @throws {ApiError} - Sikertelen foglalás esetén
 */
export const createBooking = async (
  bookingData: BookingData
): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      "/create-booking.php",
      bookingData
    );
    if (!response.data.success) {
      throw new ApiError(response.data.message || "Booking failed");
    }
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Lekéri a bejelentkezett felhasználó foglalásait
 * @returns {Promise<Appointment[]>} - A foglalásokat tartalmazó tömb
 * @throws {ApiError} - Sikertelen lekérés esetén
 */
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(
      "/get-appointments.php"
    );
    if (!response.data.success) {
      throw new ApiError(
        response.data.message || "Failed to fetch appointments"
      );
    }
    return response.data.appointments || [];
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Lekéri egy fodrász referenciáit
 * @param barberId - A fodrász azonosítója
 * @returns {Promise<any>} - A referenciákat tartalmazó válasz
 */
export const fetchReferences = (barberId: number) => {
  return apiClient.post("/get-references.php", { barberId });
};

/**
 * Lekéri az admin irányítópult statisztikáit
 * @returns {Promise<any>} - A statisztikákat tartalmazó válasz
 * @throws {ApiError} - Sikertelen lekérés esetén
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard-stats.php");
    if (!response.data.success) {
      throw new ApiError(
        response.data.message || "Failed to fetch dashboard stats"
      );
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Értékelés beküldése egy foglaláshoz
 * @param token - Az értékelési token
 * @param rating - Az értékelés pontszáma (1-5)
 * @param comment - Opcionális szöveges értékelés
 * @returns {Promise<ApiResponse<void>>} - A beküldés eredménye
 * @throws {ApiError} - Sikertelen beküldés esetén
 */
export const submitReview = async (
  token: string,
  rating: number,
  comment?: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      "/submit-review.php",
      {
        token,
        rating,
        comment: comment?.trim() || null,
      }
    );

    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to submit review");
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Email cím megerősítése
 * @param token - A megerősítési token
 * @returns {Promise<ApiResponse<void>>} - A megerősítés eredménye
 * @throws {ApiError} - Sikertelen megerősítés esetén
 */
export const verifyEmail = async (
  token: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.get<ApiResponse<void>>(
      `/verify-email.php?token=${token}`
    );

    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to verify email");
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Foglalás lemondása
 * @param token - A lemondási token
 * @returns {Promise<ApiResponse<void>>} - A lemondás eredménye
 * @throws {ApiError} - Sikertelen lemondás esetén
 */
export const cancelBooking = async (
  token: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.get<ApiResponse<void>>(
      `/cancel-booking.php?token=${token}`
    );

    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to cancel booking");
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Foglalás adatainak frissítése
 * @param appointmentId - A frissítendő foglalás azonosítója
 * @param data - A frissített foglalás adatai
 * @returns {Promise<any>} - A frissítés eredménye
 * @throws {ApiError} - Sikertelen frissítés esetén
 */
export const updateAppointment = async (
  appointmentId: number,
  data: {
    date: string;
    time: string;
    status: string;
    note: string;
  }
) => {
  try {
    const response = await apiClient.post("/update-appointment.php", {
      appointmentId,
      ...data,
    });

    if (!response.data.success) {
      throw new ApiError(
        response.data.message || "Failed to update appointment"
      );
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
