"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../components/store/authSlice";

export default function LoginPage() {

  const router = useRouter();

  const dispatch = useDispatch();

  // Get authentication state from Redux
  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    const result = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    // If login was successful
    if (loginUser.fulfilled.match(result)) {

      // Go to dashboard
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >

        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          required
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
}