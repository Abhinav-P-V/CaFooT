import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterAPI } from "../api_calls/RegisterAPI";
import { Alert, Snackbar, Box, Typography } from "@mui/material";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";

const Register: React.FC = () => {
  const setUser = useSetRecoilState(userAtom);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await RegisterAPI(username, email, password);
      const { user, token } = response;

      setUser(user);
      localStorage.setItem("token", token);

      setSnackbarMessage("Registration successful! Redirecting to your dashboard.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after Snackbar message is shown
    } catch (err: any) {
      setSnackbarMessage(
        err.response?.data?.message || "Registration failed. Please check your details and try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-800 to-blue-900 p-6 rounded-xl shadow-lg max-w-md w-full text-white relative">
        {/* Glow Effects */}
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-green-500 blur-3xl opacity-30"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-500 blur-3xl opacity-30"></div>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Typography variant="h5" className="font-bold">
            CaFooT
          </Typography>
          <Typography variant="body2" className="text-gray-300">
            Create your account to start tracking emissions
          </Typography>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Grouped Fields */}
          <Box
            className="p-4 rounded-lg shadow-lg bg-white/10 border border-teal-500"
            component="div"
          >
            {/* Username Field */}
            <div className="mb-4 relative">
              <label className="block text-white font-medium mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="text-white/80 h-6 w-6" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 pl-12 border border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-teal-600 dark:text-white hover:shadow-teal-500/50"
                  placeholder="Enter your full name"
                  required
                  aria-label="Full Name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4 relative">
              <label className="block text-white font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-white/80 h-6 w-6" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-12 border border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-teal-600 dark:text-white hover:shadow-teal-500/50"
                  placeholder="Enter your email"
                  required
                  aria-label="Email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-white font-medium mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-white/80 h-6 w-6" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-12 border border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-teal-600 dark:text-white hover:shadow-teal-500/50"
                  placeholder="Enter your password"
                  required
                  aria-label="Password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <AiFillEye className="text-white/80 h-6 w-6" />
                  ) : (
                    <AiFillEyeInvisible className="text-white/80 h-6 w-6" />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-white font-medium mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-white/80 h-6 w-6" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pl-12 border border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-teal-600 dark:text-white hover:shadow-teal-500/50"
                  placeholder="Confirm your password"
                  required
                  aria-label="Confirm Password"
                />
              </div>
            </div>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" className="mt-4 mb-4">
              {error}
            </Alert>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 mt-6 font-bold text-white bg-teal-500 rounded-lg transition-all duration-300 hover:bg-teal-600 ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <br />
        {/* Redirect to Login */}
        <Typography
          variant="body2"
          className="text-gray-300 text-center cursor-pointer hover:underline hover:text-teal-400 mt-4"
          onClick={() => navigate("/login")}
        >
          Already registered? Click here to login.
        </Typography>

        {/* Snackbar for success or error */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Register;