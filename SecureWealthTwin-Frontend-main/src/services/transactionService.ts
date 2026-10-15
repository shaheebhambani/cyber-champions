import { apiClient, ENDPOINTS } from "@/api";

export const transactionService = {
  getTransactions: async () => {
    const response = await apiClient.get(
      ENDPOINTS.TRANSACTIONS
    );

    return response.data;
  },

  createTransaction: async (data: unknown) => {
    const response = await apiClient.post(
      ENDPOINTS.TRANSACTIONS,
      data
    );

    return response.data;
  },
};