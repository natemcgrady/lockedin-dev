"use client";

import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ThemeSelector } from "@/components/theme-selector";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User, Trash2 } from "lucide-react";

interface UserMenuProps {
  user: {
    id: string;
    display_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const supabase = createClient();
    setIsDeleting(true);

    try {
      // Delete user from the users table (this will cascade to status_history)
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        alert(`Failed to delete account: ${deleteError.message}`);
        return;
      }

      // Sign out the user after successful deletion
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(
        "An unexpected error occurred while deleting your account. Please try again."
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.display_name || user.username || "User";
  const initials = getInitials(displayName);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} alt={displayName} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              {user.username && (
                <p className="text-xs leading-none text-muted-foreground">
                  @{user.username}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-1">
            <ThemeSelector />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isLoading || isDeleting}
            onClick={() => setShowDeleteConfirm(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isLoading || isDeleting}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoading ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot
              be undone. Your profile and status history will be permanently
              removed and you will no longer be searchable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
