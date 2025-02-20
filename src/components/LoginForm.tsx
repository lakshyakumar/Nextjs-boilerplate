"use client";
import Image from "next/image";
import { useState } from "react";
import google from "@/assets/iconGoogle.svg";
import facebook from "@/assets/btnSigninwithFb.svg";
import Link from "next/link";

interface LoginFormData {
  identifier: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Check if identifier is email, phone, or username
          ...(formData.identifier.includes("@")
            ? { email: formData.identifier }
            : formData.identifier.match(/^\+?[1-9]\d{1,14}$/)
            ? { phoneNumber: formData.identifier }
            : { username: formData.identifier }),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Redirect to home page after successful login
      window.location.href = "/";
    } catch {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="max-w-md mx-auto lg:mt-8 lg:p-6 flex flex-col justify-center items-center w-full gap-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <h2 className="text-3xl font-bold mb-6">Login</h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email / Phone
          </label>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
            placeholder="Enter your email or phone number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button className="text-[#F8623A] text-sm self-end">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#F8623A] text-white px-4 py-3.5 rounded-full hover:bg-[#F8623A]/80 font-semibold text-xl"
        >
          Sign In
        </button>
      </form>
      <div className="flex items-center gap-4 w-full">
        <div className="h-[1.5px] bg-white/70 flex-grow"></div>
        <span className="text-white/50 text-sm">Or Sign In With</span>
        <div className="h-[1.5px] bg-white/70 flex-grow"></div>
      </div>
      <div className="flex gap-4 w-full">
        <button className="w-full bg-white text-black px-4 py-3.5 rounded-full font-normal text-xl flex items-center justify-center gap-2">
          <Image src={google} alt="Google" width={20} height={20} />
          Google
        </button>
        <button
          type="submit"
          className="w-full bg-white text-black px-4 py-3.5 rounded-full font-normal text-xl flex items-center justify-center gap-2"
        >
          <Image src={facebook} alt="Facebook" width={20} height={20} />
          Facebook
        </button>
      </div>
      <p className="text-sm text-white/50">
        Don&#39;t have an account?{" "}
        <Link href={"/signup"} className="font-bold text-[#EA9459]">
          Join Us
        </Link>
      </p>
    </div>
  );
}
