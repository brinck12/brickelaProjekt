import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost/project/src/api",
  withCredentials: true,
});

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

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/login.php", { email, password });
  if (response.data.token) {
    setUserToken(response.data.token);
  }
  return response;
};

export const logout = () => {
  localStorage.removeItem("userToken");
  delete apiClient.defaults.headers.common["Authorization"];
};

export const fetchUserData = () => {
  return apiClient.get("/get-user-data.php");
};

export const updateUserData = (userData: {
  Keresztnev: string;
  Email: string;
  Telefonszam: string;
}) => {
  return apiClient.post("/adatvaltoztatas.php", userData);
};

export const register = (
  email: string,
  password: string,
  name: string,
  telefonszam: string
) => {
  return apiClient.post("/register.php", {
    email,
    password,
    name,
    telefonszam,
  });
};

export const fetchBarbers = () => {
  return apiClient.get("/barbers.php");
};

export const fetchServices = () => {
  return apiClient.get("/services.php");
};

export const fetchReviews = (barberId: number) => {
  return apiClient.post("/reviews.php", { barberId });
};
