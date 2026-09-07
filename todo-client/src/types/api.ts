export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    timestamp?: string;
  };
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface ApiError {
  message: string;
  errors?: Array<{ field?: string; message: string }>;
  statusCode?: number;
}
