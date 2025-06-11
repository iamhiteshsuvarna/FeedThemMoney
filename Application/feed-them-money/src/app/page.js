'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  return (
    <div className="grid grid-cols-1 md:gri d-cols-2 lg:grid-cols-3 grid-rows-1 gap-4 p-0 items-center h-screen text-blue-500 bg-blue-600">
      <div></div>
      <div className="bg-white p-6 rounded-lg border-2 border-gray-600 border-dotted">
          <h2 className="text-xl font-bold mb-4">Feed Them Money</h2>
          <p className="text-gray-700 mb-4"></p>
          <p className="text-gray-700 mb-4">
            Feed Them Money is a tool to help you manage your finances and track your expenses. 
          </p>
          <p className="text-gray-700 mb-4">
            It provides a simple and intuitive interface to help you stay on top of your financial goals.
          </p>
          <PhoneLogin />
      </div>
    </div>

    
  );
}

function PhoneLogin() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // <-- Add this
  const router = useRouter();

  const handleSendOtp = (e) => {
    e.preventDefault();
    setStep(2);
    setError("");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (data.token) {
      setSuccess(true); // <-- Set success state
      localStorage.setItem('auth_token', data.token);
      setTimeout(() => {
        router.push("/app");
      }, 1200); // Optional: short delay for user to see the message
    } else if (data.error) {
      setError("Invalid credentials");
      setTimeout(() => {
        setError("");
        setStep(1);
        setOtp("");
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <h3 className="text-lg font-semibold mb-2">Login by Phone Number</h3>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Sign In
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <h3 className="text-lg font-semibold mb-2">Enter OTP</h3>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            required
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded w-full ${error ? "bg-red-600" : success ? "bg-green-700" : "bg-green-600"} text-white`}
            disabled={!!error || success}
          >
            {error
              ? error
              : success
                ? "Authentication Successful.. Please Wait"
                : "Verify & Continue"}
          </button>
        </form>
      )}
    </div>
  );
}
