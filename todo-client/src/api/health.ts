import { apiClient } from './client';

export interface HealthStatus {
  status: string;
  message: string;
}

export const healthApi = {
  async checkHealth(): Promise<HealthStatus> {
    const res = await apiClient.get<HealthStatus>('/health');
    return res.data;
  },
};
