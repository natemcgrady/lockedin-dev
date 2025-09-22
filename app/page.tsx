import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Are you locked in?
          </h1>
        </div>

        <div className="space-y-4">
          <Link href="/auth/login">
            <Button size="lg" className="text-lg px-8 py-6">
              Yeah
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
