"use client";
import { useEffect, useState } from "react";
import { TokenPayload } from "@/common/types";

export default function UserDetails() {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Name:</span> {user.firstName}{" "}
          {user.lastName}
        </p>
        <p>
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {user.phoneNumber}
        </p>
      </div>
    </div>
  );
}
