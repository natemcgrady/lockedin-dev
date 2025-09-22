"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Zap, ZapOff, MessageSquare, LockIcon, UnlockIcon } from "lucide-react";

interface StatusToggleProps {
  profile: {
    id: string;
    is_locked_in: boolean;
    locked_in_message?: string;
  };
}

export function StatusToggle({ profile }: StatusToggleProps) {
  const [isLockedIn, setIsLockedIn] = useState(profile.is_locked_in);
  const [message, setMessage] = useState(profile.locked_in_message || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusUpdate = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          is_locked_in: isLockedIn,
          locked_in_message: message.trim() || null,
          last_status_update: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // Add to status history
      const { error: historyError } = await supabase
        .from("status_history")
        .insert({
          user_id: profile.id,
          is_locked_in: isLockedIn,
          message: message.trim() || null,
        });

      if (historyError) {
        console.warn("Failed to save status history:", historyError);
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLockedIn ? (
                <LockIcon className="h-5 w-5 text-green-500" />
              ) : (
                <UnlockIcon className="h-5 w-5 text-gray-400" />
              )}
              Status
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="locked-in"
                checked={isLockedIn}
                onCheckedChange={setIsLockedIn}
                className="scale-125"
              />
              <Label htmlFor="locked-in" className="text-sm font-medium">
                {isLockedIn ? "Locked in" : "Not locked in"}
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              What are you working on? (optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Share what you're focused on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={280}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/280 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleStatusUpdate}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
