"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { siGithub, siX } from "simple-icons";

interface OAuthButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  provider?: "twitter" | "github";
  className?: string;
  children?: React.ReactNode;
}

const providerInfo = {
  twitter: {
    name: "𝕏",
    icon: siX,
  },
  github: {
    name: "GitHub",
    icon: siGithub,
  },
};

export function OAuthButton({
  size = "lg",
  provider = "twitter",
  className = "",
  children,
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
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
        onClick={handleLogin}
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
          <path d={providerInfo[provider].icon.path} />
        </svg>
        {children ||
          (isLoading
            ? "Connecting..."
            : `Lock in with ${providerInfo[provider].name}`)}
      </Button>
    </div>
  );
}
