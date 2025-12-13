"use client";

import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
       <Button
        size="icon"
        variant="outline"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <UserNav />
    </header>
  );
}
