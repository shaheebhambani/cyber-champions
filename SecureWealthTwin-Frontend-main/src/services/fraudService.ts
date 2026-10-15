import { apiClient, ENDPOINTS } from "@/api";
import type {
  FraudCheckRequest,
  FraudCheckResponse,
} from "@/types/fraud";

export const fraudService = {
  checkFraud: async (
    data: FraudCheckRequest
  ): Promise<FraudCheckResponse> => {
    const response = await apiClient.post<FraudCheckResponse>(
      ENDPOINTS.FRAUD.CHECK,
      data
    );

    return response.data;
  },
};
