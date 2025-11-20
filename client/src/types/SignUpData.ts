export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export type LoginData = Pick<SignUpData, "email" | "password">;
