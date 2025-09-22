import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface UserProfileProps {
  profile: {
    username: string
    display_name: string
    avatar_url?: string
    is_locked_in: boolean
    locked_in_message?: string
    last_status_update?: string
  }
}

export function UserProfile({ profile }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.display_name} />
            <AvatarFallback className="text-lg">{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{profile.display_name}</h2>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${profile.is_locked_in ? "bg-green-500" : "bg-gray-400"}`} />
          <span className="font-medium">{profile.is_locked_in ? "Locked In" : "Not Locked In"}</span>
        </div>
        {profile.locked_in_message && (
          <p className="mt-2 text-sm text-muted-foreground">"{profile.locked_in_message}"</p>
        )}
      </CardContent>
    </Card>
  )
}
