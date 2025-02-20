"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import google from "@/assets/iconGoogle.svg";
import facebook from "@/assets/btnSigninwithFb.svg";

interface SignupFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

type SignupMethod = "email" | "phone";

export default function SignupForm() {
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const submissionData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      email: signupMethod === "email" ? formData.email : null,
      phoneNumber: signupMethod === "phone" ? formData.phoneNumber : null,
    };

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setShowOtpForm(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/signup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupMethod === "email" ? formData.email : null,
          phoneNumber: signupMethod === "phone" ? formData.phoneNumber : null,
          otp,
        }),
      });

      const data = await res.json();

      if (data.status === "error") {
        setError(data.message);
        return;
      }

      window.location.href = "/login";
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification");
    }
  };

  return (
    <div className="max-w-md mx-auto lg:mt-8 lg:p-6 flex flex-col justify-center items-center w-full gap-4">
      {!showOtpForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
            Sign Up
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setSignupMethod("email")}
              className={`p-2 text-center rounded-full text-sm lg:text-base ${
                signupMethod === "email"
                  ? "bg-[#F8623A] text-white"
                  : "bg-transparent border border-white/30 text-white"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setSignupMethod("phone")}
              className={`p-2 text-center rounded-full text-sm lg:text-base ${
                signupMethod === "phone"
                  ? "bg-[#F8623A] text-white"
                  : "bg-transparent border border-white/30 text-white"
              }`}
            >
              Phone
            </button>
          </div>

          {signupMethod === "email" ? (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
                placeholder="+1234567890"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder="Create a password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#F8623A] text-white px-3 lg:px-4 py-2.5 lg:py-3.5 rounded-full hover:bg-[#F8623A]/80 font-semibold text-lg lg:text-xl"
          >
            Sign Up
          </button>

          <div className="flex items-center gap-2 lg:gap-4 w-full my-4">
            <div className="h-[1.5px] bg-white/70 flex-grow"></div>
            <span className="text-white/50 text-xs lg:text-sm whitespace-nowrap">
              Or Sign Up With
            </span>
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

          <p className="text-xs lg:text-sm text-white/50 text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#EA9459]">
              Sign In
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4 w-full">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
            Verify OTP
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder="Enter OTP"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#F8623A] text-white px-3 lg:px-4 py-2.5 lg:py-3.5 rounded-full hover:bg-[#F8623A]/80 font-semibold text-lg lg:text-xl"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}
