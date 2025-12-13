import Image from "next/image";
import Link from "next/link";
import { Code2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <div className="rounded-lg bg-primary p-2">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">VarshanAI</span>
        </Link>
      </div>
      <div className="w-full max-w-md p-4">{children}</div>
    </div>
  );
}
