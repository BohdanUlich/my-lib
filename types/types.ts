export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  user_id: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
