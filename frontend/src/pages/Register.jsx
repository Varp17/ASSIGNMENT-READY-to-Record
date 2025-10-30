import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-10 rounded-3xl shadow-2xl transition-all duration-500">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            F
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Create your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Join us to start managing tasks smarter ✨
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Full Name"
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email Address"
            type="email"
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
