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

const API_BASE_URL = "http://localhost/project/src/api";

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

export const fetchBarbers = () => {
  return apiClient.get("/barbers.php");
};

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

export const fetchServices = () => {
  return apiClient.get("/services.php");
};

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
