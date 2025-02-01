"use client";
import { useState } from "react";

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
  const [generatedOtp, setGeneratedOtp] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Clear the unused field before submission
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
      setGeneratedOtp(data.otp);
      // Show OTP form after successful registration
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

      // Redirect to login page after successful verification
      window.location.href = "/login";
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {!showOtpForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

          {/* for development purpose */}
          {generatedOtp && (
            <div className="p-4 mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="font-bold">Development Mode</p>
              <p>Generated OTP: {generatedOtp}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setSignupMethod("email")}
              className={`p-2 text-center rounded-lg ${
                signupMethod === "email"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setSignupMethod("phone")}
              className={`p-2 text-center rounded-lg ${
                signupMethod === "phone"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              Phone
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
                placeholder="Enter your first name"
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
                className="w-full p-2 border rounded text-black"
                placeholder="Enter your last name"
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
              className="w-full p-2 border rounded text-black"
              placeholder="Enter your username"
              required
            />
          </div>

          {signupMethod === "email" ? (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
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
                className="w-full p-2 border rounded text-black"
                required
                placeholder="+1234567890"
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
              className="w-full p-2 border rounded text-black"
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded text-black "
              required
              placeholder="Enter OTP"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}
