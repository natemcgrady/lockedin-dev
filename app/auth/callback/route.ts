import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerClient();

    console.log("🔍 Route Handler - Exchanging code for session...");
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("📊 Route Handler - Exchange result:", { error });

    if (error) {
      console.log("❌ Route Handler - Code exchange failed:", error);
      return NextResponse.redirect(
        `${origin}/auth/login?error=Authentication failed`
      );
    }

    // Wait a moment for session to be established
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check if we have a valid session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("👤 Route Handler - User check:", {
      user: user?.id,
      userError,
    });

    if (user && !userError) {
      console.log(
        "✅ Route Handler - Successfully authenticated, redirecting to dashboard"
      );
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  console.log("❌ Route Handler - Auth error, redirecting to login");
  return NextResponse.redirect(
    `${origin}/auth/login?error=Could not authenticate user`
  );
}
