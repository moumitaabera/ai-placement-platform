export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "RECRUITER";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: "STUDENT" | "RECRUITER";
    };
    accessToken: string;
  };
}