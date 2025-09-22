"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

interface StatusToggleProps {
  profile: {
    id: string
    is_locked_in: boolean
    locked_in_message?: string
  }
}

export function StatusToggle({ profile }: StatusToggleProps) {
  const [isLockedIn, setIsLockedIn] = useState(profile.is_locked_in)
  const [message, setMessage] = useState(profile.locked_in_message || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleStatusUpdate = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          is_locked_in: isLockedIn,
          locked_in_message: message.trim() || null,
          last_status_update: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (updateError) throw updateError

      // Add to status history
      const { error: historyError } = await supabase.from("status_history").insert({
        user_id: profile.id,
        is_locked_in: isLockedIn,
        message: message.trim() || null,
      })

      if (historyError) {
        console.warn("Failed to save status history:", historyError)
      }

      // Refresh the page to show updated status
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Your Status</CardTitle>
        <CardDescription>Let others know if you're currently locked in and focused</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch id="locked-in" checked={isLockedIn} onCheckedChange={setIsLockedIn} />
          <Label htmlFor="locked-in" className="text-base">
            {isLockedIn ? "I'm locked in" : "I'm not locked in"}
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Optional Message</Label>
          <Textarea
            id="message"
            placeholder="What are you working on? (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={280}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">{message.length}/280 characters</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleStatusUpdate} disabled={isLoading} className="w-full" size="lg">
          {isLoading ? "Updating..." : "Update Status"}
        </Button>
      </CardContent>
    </Card>
  )
}
