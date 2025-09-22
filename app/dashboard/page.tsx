import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/auth/login");
  }

  // Get or create user profile
  let { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // If profile doesn't exist, create it
  if (profileError && profileError.code === "PGRST116") {
    const { data: newProfile, error: createError } = await supabase
      .from("users")
      .insert({
        id: user.id,
        username:
          user.user_metadata?.user_name || `user_${user.id.slice(0, 8)}`,
        display_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Anonymous User",
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture,
        x_user_id:
          user.user_metadata?.provider_id || user.user_metadata?.sub || user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating profile:", createError);
      redirect("/auth/login?error=profile_creation_failed");
    }
    profile = newProfile;
  } else if (profileError) {
    console.error("Error fetching profile:", profileError);
    redirect("/auth/login?error=profile_fetch_failed");
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">LockedIn</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Hello, {profile.display_name}!
              </CardTitle>
              <p className="text-muted-foreground">
                Are you currently locked in?
              </p>
            </CardHeader>
            <CardContent>
              <DashboardTabs profile={profile} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
