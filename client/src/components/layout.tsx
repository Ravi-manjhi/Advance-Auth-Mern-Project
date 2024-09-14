import { Navigate, Outlet } from "react-router-dom";
import FloatingShape from "./floatingShape";
import { useAuthStore } from "../store/store";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const Layout = () => {
  const { isAuthenticated, isSignIn, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    async function checkAuth() {
      await isSignIn();
    }

    checkAuth();
  }, [isSignIn]);

  if (isAuthenticated) return <Navigate to="/" />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900 flex items-center justify-center overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {isCheckingAuth ? (
        <Loader size={50} className="animate-spin text-white" />
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export const ProtectedLayout = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900 flex items-center justify-center overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      {<Outlet />}
    </div>
  );
};

export default Layout;
