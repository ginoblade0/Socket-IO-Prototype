import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail, MessageSquare, User } from "lucide-react";

import type { SignUpData } from "../types/SignUpData";
import { useAuthStore } from "../store/useAuthStore";
import AuthImageSide from "../components/AuthImageSide";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState<boolean>();
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    // Add form validation logic here
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!validateForm()) return;
    // await signup(formData);
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
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">
              Get started with your free account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="py-6">
            <div className="flex flex-col items-center px-12">
              <label className="label self-start">
                <span className="font-medium ">Username</span>
              </label>
              <label className="input validator w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="pl-8 opacity-50"
                  required
                  placeholder="Username"
                  pattern="[A-Za-z][A-Za-z0-9]*"
                  minLength={3}
                  maxLength={30}
                  title="Must not contain any special characters."
                  value={signUpData.name}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, name: e.target.value })
                  }
                />
              </label>
              {/* <p className="validator-hint hidden">
                {signUpData.name === ""
                  ? "This field is required."
                  : "Please enter a valid username."}
              </p> */}
            </div>
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
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
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
                  title="Must have at least 8 alphanumeric characters."
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
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
                className={`btn w-full ${isSigningUp ? "loading" : ""}`}
                disabled={isSigningUp}
              >
                {isSigningUp ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-medium">
                Log In
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

export default SignUp;
