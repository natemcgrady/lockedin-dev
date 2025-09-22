import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MessageSquare } from "lucide-react";

interface UserProfileProps {
  profile: {
    username: string;
    display_name: string;
    avatar_url?: string;
    is_locked_in: boolean;
    locked_in_message?: string;
    last_status_update?: string;
  };
}

export function UserProfile({ profile }: UserProfileProps) {
  const formatLastUpdate = (timestamp?: string) => {
    if (!timestamp) return "Never updated";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profile.avatar_url || "/placeholder.svg"}
              alt={profile.display_name}
            />
            <AvatarFallback className="text-lg">
              {profile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{profile.display_name}</h2>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
          <Badge
            variant={profile.is_locked_in ? "default" : "secondary"}
            className="shrink-0"
          >
            {profile.is_locked_in ? "Locked In" : "Not Locked In"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              profile.is_locked_in ? "bg-primary" : "bg-gray-400"
            }`}
          />
          <span className="font-medium">
            {profile.is_locked_in
              ? "Currently locked in"
              : "Currently not locked in"}
          </span>
        </div>

        {profile.locked_in_message && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Current message:</span>
              </div>
              <p className="text-sm text-foreground/80 italic pl-6">
                "{profile.locked_in_message}"
              </p>
            </div>
          </>
        )}

        <Separator />
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated {formatLastUpdate(profile.last_status_update)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
