import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OAuthButton } from "@/components/oauth-button";
import { LockIcon } from "lucide-react";

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Locked<span className="text-primary">In</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <LockIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-balance">
                Are you Locked<span className="text-primary">In</span>?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Let your friends know when you're locked in.
              </p>
            </div>
            <div className="flex justify-center">
              <OAuthButton
                size="lg"
                className="text-lg px-8 py-6 text-secondary-foreground"
              >
                Lock In with X
              </OAuthButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
