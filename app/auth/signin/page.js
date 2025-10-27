// app/auth/signin/page.tsx
'use client';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log("🔄 Starting Google sign in...");
      
      // NextAuth এর signIn function ব্যবহার করুন
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false // আমরা manually redirect করব
      });

      console.log("🔑 SignIn result:", result);

      if (result?.error) {
        setError(`Sign in failed: ${result.error}`);
        console.error("❌ Sign in error:", result.error);
      } else if (result?.url) {
        // Successful - redirect to Google OAuth page
        console.log("✅ Redirecting to Google OAuth...");
        window.location.href = result.url;
      } else {
        // No URL returned - something wrong
        setError("No redirect URL received");
        console.error("❓ No redirect URL received");
      }
    } catch (error) {
      console.error("💥 Sign in error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Direct API call
  const handleDirectGoogleSignIn = () => {
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In to Any's Beauty Corner</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Method 1: Using signIn function */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 mb-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : null}
          {loading ? "Redirecting..." : "Sign in with Google (Method 1)"}
        </button>

        {/* Method 2: Direct URL */}
        <button
          onClick={handleDirectGoogleSignIn}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
        >
          Sign in with Google (Method 2)
        </button>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-center">
          <p className="text-xs text-gray-600">
            Check browser console for debug information
          </p>
        </div>
      </div>
    </div>
  );
}