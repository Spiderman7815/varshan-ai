
"use client";

import { useUser } from "@/firebase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Header } from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.replace("/login");
      } else if (pathname === "/") {
        // This handles the case where a logged-in user navigates to the root
        // of the authenticated section, and redirects them to the chat.
        router.replace("/chat");
      }
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If the user is logged in but we are at the root, show a loader while redirecting.
  if (pathname === "/") {
      return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <ChatSidebar userId={user.uid} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(p => !p)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
