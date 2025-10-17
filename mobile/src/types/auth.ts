export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
}
