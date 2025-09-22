"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusToggle } from "@/components/status-toggle"
import { UserSearch } from "@/components/user-search"

interface DashboardTabsProps {
  profile: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
    is_locked_in: boolean
    locked_in_message?: string
    last_status_update?: string
  }
}

export function DashboardTabs({ profile }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="status" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="status">My Status</TabsTrigger>
        <TabsTrigger value="search">Find Users</TabsTrigger>
      </TabsList>
      <TabsContent value="status" className="mt-6">
        <StatusToggle profile={profile} />
      </TabsContent>
      <TabsContent value="search" className="mt-6">
        <UserSearch currentUserId={profile.id} />
      </TabsContent>
    </Tabs>
  )
}
