import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail, MessageSquare } from "lucide-react";

import type { LoginData } from "../types/form-data";
import { useAuthStore } from "../store/useAuthStore";
import AuthImageSide from "../components/AuthImageSide";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(loginData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-8 sm:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
            <p className="text-base-content/60">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="py-6">
            <div className="flex flex-col items-center px-12 py-3">
              <label className="label self-start">
                <span className="font-medium ">Email</span>
              </label>
              <label className="input validator w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="pl-8 opacity-50"
                  placeholder="email@site.com"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </label>
              {/* <p className="validator-hint hidden">
                Please enter a valid email address.
              </p> */}
            </div>
            <div className="flex flex-col items-center px-12">
              <label className="label self-start">
                <span className="font-medium ">Password</span>
              </label>

              <label className="input validator w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="size-5 text-base-content/40" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="pl-8 opacity-50"
                  required
                  placeholder="Password"
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  // title="Must have at least 8 alphanumeric characters."
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </label>
              {/* <p className="validator-hint hidden">
                Must have at least 8 alphanumeric characters.
              </p> */}
            </div>

            <div className="px-12 mt-8">
              <button
                type="submit"
                className={`btn w-full`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "" : "Login"}
                <span
                  className={isLoggingIn ? "loading loading-spinner" : ""}
                />
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImageSide
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default Login;
