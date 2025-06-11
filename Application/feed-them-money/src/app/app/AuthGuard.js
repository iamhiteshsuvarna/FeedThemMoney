"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.replace("/"); // Redirect to login page
      } else {
        setChecked(true);
      }
    }
  }, [router]);

  if (!checked) {
    // Show nothing or a spinner while checking auth
    return <div className="flex items-center justify-center h-screen text-gray-500">Checking authentication...</div>;
  }

  return children;
}