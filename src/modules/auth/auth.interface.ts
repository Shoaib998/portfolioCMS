export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;

  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}