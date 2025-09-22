import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { LockIcon, Users, MessageSquare, ArrowRight } from "lucide-react";

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
      {/* Header with theme toggle */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">LockedIn</h1>
            <ThemeToggle />
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
                Are you <span className="text-primary">locked in</span>?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Let your friends know when you're locked in.
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="text-lg px-8 py-6 gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          {/* <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LockIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Status Sharing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Let your friends know when you're locked in and focused on
                  your work.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Share Your Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add a message about what you're working on to inspire others.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Connect with Friends</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find and follow other users to see their locked-in status.
                </CardDescription>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </div>
  );
}
