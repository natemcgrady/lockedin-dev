import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerClient()

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code)

    if (error) {
      console.error("Auth callback error:", error)
      redirect("/auth/login?error=" + encodeURIComponent(error.message))
    }

    // Successfully authenticated, redirect to dashboard
    redirect("/dashboard")
  }

  if (params.error) {
    redirect("/auth/login?error=" + encodeURIComponent(params.error))
  }

  // No code or error, redirect to login
  redirect("/auth/login")
}
