"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("auth_token");
    router.replace("/"); // Redirect to login page
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-gray-500">Logging out...</span>
    </div>
  );
}