import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const supabase = await createServerClient();

  console.log("🔍 Callback received params:", params);

  if (params.code) {
    console.log(" Exchanging code for session...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      params.code
    );

    console.log("📊 Exchange result:", { data, error });

    if (error) {
      console.error("❌ Auth callback error:", error);
      redirect("/auth/login?error=" + encodeURIComponent(error.message));
    }

    // Check if we have a user after exchange
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log("👤 User after exchange:", { user: user?.id, userError });

    if (!user) {
      console.error("❌ No user found after successful code exchange");
      redirect("/auth/login?error=no_user_after_exchange");
    }

    console.log("✅ Successfully authenticated, redirecting to dashboard");

    // Force a refresh to ensure cookies are set
    redirect("/dashboard");
  }

  if (params.error) {
    console.error("❌ OAuth error in params:", params.error);
    redirect("/auth/login?error=" + encodeURIComponent(params.error));
  }

  console.log("❌ No code or error found, redirecting to login");
  // No code or error, redirect to login
  redirect("/auth/login");
}
