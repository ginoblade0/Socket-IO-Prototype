export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export type LoginData = Pick<SignUpData, "email" | "password">;
