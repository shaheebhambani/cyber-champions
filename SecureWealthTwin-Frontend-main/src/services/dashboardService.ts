import { apiClient, ENDPOINTS } from "@/api";

export const dashboardService = {
  getDashboard: async () => {
    const response = await apiClient.get(
      ENDPOINTS.DASHBOARD
    );

    return response.data;
  },
};