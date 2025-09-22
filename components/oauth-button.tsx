"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { siX } from "simple-icons";

interface OAuthButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function OAuthButton({
  size = "lg",
  className = "",
  children,
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleXLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 max-w-sm">
          <p className="text-sm text-destructive text-center">{error}</p>
        </div>
      )}
      <Button
        onClick={handleXLogin}
        size={size}
        className={`gap-2 text-black ${className}`}
        disabled={isLoading}
      >
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={siX.path} />
        </svg>
        {children || (isLoading ? "Connecting..." : "Continue with X")}
      </Button>
    </div>
  );
}
