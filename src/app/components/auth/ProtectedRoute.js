"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import {
  initializeAuth,
} from "../store/authSlice";

export default function ProtectedRoute({ children }) {

  const router = useRouter();

  const dispatch = useDispatch();

  const {
    isAuthenticated,
  } = useSelector((state) => state.auth);

  // =====================================================
  // RESTORE AUTHENTICATION
  // =====================================================

  useEffect(() => {

    // Read token/user from localStorage
    dispatch(initializeAuth());

  }, [dispatch]);

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    // If token doesn't exist
    if (!token) {

      router.replace("/login");
    }

  }, [router]);

  // =====================================================
  // LOADING / CHECKING
  // =====================================================

  if (!isAuthenticated) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // =====================================================
  // AUTHENTICATED
  // =====================================================

  return children;
}