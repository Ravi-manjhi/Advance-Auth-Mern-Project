import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout, { ProtectedLayout } from "./components/layout";
import Login from "./pages/login";
import Home from "./pages/home";
import SignUp from "./pages/signUp";
import VerifyEmail from "./pages/verifyEmail";
import ForgotPasswordPage from "./pages/forgetPassword";
import ResetPasswordPage from "./pages/resetPassword";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <SignUp /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password/:token", element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
]);

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  return (
    <>
      <RouterProvider router={router} />;
      <Toaster toastOptions={{ position: "top-right" }} />
    </>
  );
};
