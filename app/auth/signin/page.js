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
      
      const result = await signIn("google", { 
        callbackUrl: "/",
        redirect: false
      });

      console.log("🔑 Google sign in result:", result);

      if (result?.error) {
        setError(`Google sign in failed: ${result.error}`);
        console.error("❌ Google sign in error:", result.error);
      } else if (result?.url) {
        console.log("✅ Google sign in successful, redirecting...");
        router.push(result.url);
      } else {
        // If no error and no URL, just redirect to home
        console.log("✅ Google sign in successful (no URL), redirecting to home...");
        router.push("/");
      }
    } catch (error) {
      console.error("💥 Sign in error:", error);
      setError("An unexpected error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  // Temporary direct login for testing
  const handleTempLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify({
      name: "Test User",
      email: "test@example.com"
    }));
    alert("Temporary login successful! Redirecting...");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-2 text-lipstick-dark">
          Welcome to Any's Beauty Corner
        </h2>
        <p className="text-gray-600 text-center mb-6">Sign in to continue</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3 transition-all duration-200 mb-4 shadow-sm"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading ? "Signing in with Google..." : "Sign in with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Temporary Login for Testing */}
        <button
          onClick={handleTempLogin}
          className="w-full bg-lipstick text-white py-3 px-4 rounded-lg hover:bg-lipstick-dark transition-colors font-medium"
        >
          Temporary Test Login
        </button>

        {/* Debug Info */}
        <div className="mt-6 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Debug:</strong> Check browser console for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}