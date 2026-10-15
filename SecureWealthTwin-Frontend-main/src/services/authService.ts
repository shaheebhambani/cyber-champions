import { apiClient, ENDPOINTS } from "@/api";

export const authService = {
  login: async (data: unknown) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: unknown) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  forgotPassword: async (data: unknown) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );

    return response.data;
  },
};