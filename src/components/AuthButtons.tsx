"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthButtons() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/me");
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex gap-4 justify-center mt-8">
      <Link
        href="/login"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
