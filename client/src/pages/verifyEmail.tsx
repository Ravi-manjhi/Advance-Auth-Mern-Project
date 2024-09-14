import React, {
  KeyboardEvent,
  useRef,
  useState,
  FormEvent,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  const { verifyEmail, isLoading, error, message, isCheckingVerification } =
    useAuthStore();

  useEffect(() => {
    if (!isCheckingVerification) {
      navigate("/");
    }
  }, [isCheckingVerification, navigate]);

  function handleChange(index: number, value: string) {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRef.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5 && inputRef.current[index + 1]) {
        inputRef.current[index + 1].focus();
      }
    }
  }

  function handleKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0 &&
      inputRef.current[index - 1]
    ) {
      inputRef.current[index - 1].focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await verifyEmail(+code.join(""));
      navigate("/");
    } catch (error) {
      console.log(error);
    }

    console.log("Verifying email with code:", code.join(""));
  }

  return (
    <motion.div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={digit}
                maxLength={6}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`Digit ${index + 1} of verification code`}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>

          {error && (
            <span className="text-red-500 text-sm mt-2">{message}</span>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VerifyEmail;
