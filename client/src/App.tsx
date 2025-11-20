import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

const App = () => {
  const { isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log(isAuthenticated);

  if (isCheckingAuth && !isAuthenticated)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
