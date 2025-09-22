"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Users } from "lucide-react"

interface User {
  id: string
  username: string
  display_name: string
  avatar_url?: string
  is_locked_in: boolean
  locked_in_message?: string
  last_status_update?: string
}

interface UserSearchProps {
  currentUserId: string
}

export function UserSearch({ currentUserId }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      setIsLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from("users")
          .select("id, username, display_name, avatar_url, is_locked_in, locked_in_message, last_status_update")
          .neq("id", currentUserId) // Exclude current user
          .order("last_status_update", { ascending: false })

        if (fetchError) throw fetchError

        setUsers(data || [])
        setFilteredUsers(data || [])
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Failed to fetch users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [currentUserId])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.display_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const formatLastUpdate = (timestamp?: string) => {
    if (!timestamp) return "Never updated"

    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Find Users
        </CardTitle>
        <CardDescription>Search for other users and see their current locked-in status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username or display name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No users found matching your search." : "No other users found."}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.display_name} />
                  <AvatarFallback>{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{user.display_name}</h3>
                    <Badge variant={user.is_locked_in ? "default" : "secondary"} className="shrink-0">
                      {user.is_locked_in ? "Locked In" : "Not Locked In"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                  {user.locked_in_message && (
                    <p className="text-sm mt-1 text-foreground/80 line-clamp-2">"{user.locked_in_message}"</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated {formatLastUpdate(user.last_status_update)}
                  </p>
                </div>

                <div className="shrink-0">
                  <div className={`h-3 w-3 rounded-full ${user.is_locked_in ? "bg-green-500" : "bg-gray-400"}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
