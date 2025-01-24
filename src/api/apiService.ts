import axios, { AxiosError } from "axios";
import { ApiResponse, LoginResponse, BookingData } from "../types/api";
import { Appointment } from "../types/appointment";
//import { Reference } from "../types/reference";

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new ApiError(
      axiosError.response?.data?.message || "An unexpected error occurred",
      axiosError.response?.status
    );
  }
  throw error;
};

const apiClient = axios.create({
  baseURL: "http://localhost/project/src/api",
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

export const setUserToken = (token: string) => {
  localStorage.setItem("userToken", token);
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const initializeAuth = () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    setUserToken(token);
  }
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      token: string;
      user: LoginResponse["user"];
      message?: string;
    }>("/login.php", { email, password });

    if (response.data.success) {
      setUserToken(response.data.token);
      return {
        token: response.data.token,
        user: response.data.user,
      };
    }
    throw new ApiError(response.data.message || "Login failed");
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("userToken");
  delete apiClient.defaults.headers.common["Authorization"];
};

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

export const updateUserData = async (userData: {
  Keresztnev: string;
  Email: string;
  Telefonszam: string;
}): Promise<{ data: { success: boolean; message: string } }> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/adatvaltoztatas.php", userData);
    if (!response.data.success) {
      throw new ApiError(response.data.message || "Failed to update user data");
    }
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
  telefonszam: string
): Promise<{ data: { success: boolean; message: string } }> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/register.php", {
      email,
      password,
      name,
      telefonszam,
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchBarbers = () => {
  return apiClient.get("/barbers.php");
};

export const fetchServices = () => {
  return apiClient.get("/services.php");
};

export const checkAppointments = (barberId: string | number, date: string) => {
  return apiClient.post("/check-appointments.php", { barberId, date });
};

export const fetchReviews = (barberId: number) => {
  return apiClient.post("/reviews.php", { barberId });
};

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

export const fetchReferences = (barberId: number) => {
  return apiClient.post("/get-references.php", { barberId });
};

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
