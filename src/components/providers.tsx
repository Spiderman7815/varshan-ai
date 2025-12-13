"use client";

import { FirebaseClientProvider } from "@/firebase";
import { ThemeProvider } from "@/hooks/use-theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        {children}
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}
