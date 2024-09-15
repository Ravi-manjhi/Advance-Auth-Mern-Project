import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/input";
import { useAuthStore } from "../store/store";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [userData, setUserData] = useState(initialState);
  const { login, error, message } = useAuthStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login(userData.email, userData.password);
    } catch (error) {
      console.log(error);
    }

    console.log(userData);
  }

  const isLoading = false;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-gray-400 to-emerald-500 text-transparent bg-clip-text">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            Icon={Mail}
            placeholder="Email"
            value={userData.email}
            onChange={(e) => {
              setUserData((val) => {
                return { ...val, email: e.target.value };
              });
            }}
          />
          <Input
            type="password"
            Icon={Lock}
            placeholder="Password"
            value={userData.password}
            onChange={(e) => {
              setUserData((val) => {
                return { ...val, password: e.target.value };
              });
            }}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="text-red-500 font-semibold mb-2">{message}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin text-center mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p>Don't have a Account? &nbsp;</p>
        <Link to="/register" className="text-green-400 hover:underline">
          Register
        </Link>
      </div>
    </motion.div>
  );
};

export default Login;
