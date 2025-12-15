
"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/firebase";
import { Code2, Loader2, RefreshCw, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";


interface ChatMessagesProps {
  messages: Message[];
  onRegenerate: (messageId: string) => void;
  isLoading: boolean;
}

export function ChatMessages({ messages, onRegenerate, isLoading }: ChatMessagesProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
        toast({ title: "Code copied to clipboard!" });
    }).catch(err => {
        toast({ variant: "destructive", title: "Failed to copy code", description: err.message });
    });
  };

  if (messages.length === 0 && !isLoading) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
                <Code2 className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">How can I help you today?</h2>
            <p className="text-muted-foreground">Start a conversation with VarshanAI</p>
        </div>
    );
  }

  return (
    <div className="h-full space-y-6 p-4 md:p-6" ref={scrollAreaRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-4 ${
            message.role === "user" ? "justify-end" : ""
          }`}
        >
          {message.role === "assistant" && (
            <Avatar className="h-9 w-9">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </Avatar>
          )}
          <div
            className={cn(`group relative max-w-lg rounded-lg px-4 py-3`, 
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            pre: ({node, ...props}) => (
                                <div className="relative">
                                    <pre {...props} className="bg-background/50 p-4 rounded-md my-4" />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-7 w-7"
                                        onClick={() => handleCopy(node?.children[0]?.type === 'element' ? (node.children[0].children[0] as any).value : '')}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ),
                        }}
                    >
                        {message.text}
                    </ReactMarkdown>
                </div>
            ) : (
                message.text
            )}
            {message.imageUrl && (
              <div className="mt-2">
                <Image
                  src={message.imageUrl}
                  alt="Uploaded content"
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            )}
            {message.role === 'assistant' && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -right-10 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRegenerate(message.id)}
                >
                    <RefreshCw className="h-4 w-4"/>
                </Button>
            )}
          </div>
          {message.role === "user" && (
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback>
                {getInitials(user?.displayName || user?.email)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
       {isLoading && (
        <div className="flex items-start gap-4">
            <Avatar className="h-9 w-9">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary">
                    <Code2 className="h-5 w-5 text-primary-foreground" />
                </div>
            </Avatar>
            <div className="max-w-lg rounded-lg bg-muted px-4 py-3 flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        </div>
      )}
    </div>
  );
}
