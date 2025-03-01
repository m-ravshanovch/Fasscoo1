"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ProtectedPage component
export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user has a valid access token
    const accessToken = localStorage.getItem("accessToken");

    // If no access token, redirect to login page
    if (!accessToken) {
      router.push("/login"); // Redirect to login page if not authenticated
    } else {
      // If the user is authenticated, you can fetch the protected data
      // Optionally, you can verify the token's validity by making an API call
      setLoading(false); // Set loading to false once the authentication check is complete
    }
  }, [router]);

  // Show a loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Return the protected content if the user is authenticated
  return (
    <div>
      <h1>Protected Content</h1>
      <p>This page is only accessible to logged-in users.</p>
    </div>
  );
}
