
"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/firebase";
import { Code2, Loader2, RefreshCw, Copy, Download, Search, Volume2, StopCircle } from "lucide-react";
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
  onTextToSpeech: (text: string) => void;
  isLoading: boolean;
  isSpeaking: boolean;
}

export function ChatMessages({ messages, onRegenerate, onTextToSpeech, isLoading, isSpeaking }: ChatMessagesProps) {
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

  const getCodeFromNode = (node: any): string => {
    if (!node) return '';
    if (node.type === 'text') return node.value;
    if (node.type === 'element' && node.children) {
      return node.children.map(getCodeFromNode).join('');
    }
    return '';
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
        toast({ title: "Code copied to clipboard!" });
    }).catch(err => {
        toast({ variant: "destructive", title: "Failed to copy code", description: err.message });
    });
  };

  const handleDownload = (code: string) => {
    try {
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileExtension = 'txt'; // Default, can be improved to detect language
        link.download = `code-snippet.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Code snippet downloaded." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Download failed", description: error.message });
    }
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
          className={cn(`flex items-start gap-4`, 
              message.role === "user" ? "justify-end" : ""
          )}
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
             {message.toolUsed === 'webSearch' && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Search className="h-3.5 w-3.5" />
                <span>Searched the web</span>
              </div>
            )}
            {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            pre: ({node, ...props}) => {
                                const codeContent = getCodeFromNode(node?.children[0]);
                                return (
                                <div className="relative">
                                    <pre {...props} className="bg-background/50 p-4 rounded-md my-4 pr-20" />
                                    <div className="absolute top-2 right-2 flex items-center gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => handleCopy(codeContent)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                         <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => handleDownload(codeContent)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )},
                        }}
                    >
                        {message.text || ''}
                    </ReactMarkdown>
                </div>
            ) : (
                message.text
            )}
            {message.imageUrl && (
              <div className="mt-2">
                <Image
                  src={message.imageUrl}
                  alt={message.text || "Generated image"}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            )}
            {message.role === 'assistant' && (
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => onRegenerate(message.id)}
                        title="Regenerate"
                    >
                        <RefreshCw className="h-4 w-4"/>
                    </Button>
                    {message.text && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => onTextToSpeech(message.text || '')}
                            title={isSpeaking ? "Stop" : "Listen"}
                        >
                            {isSpeaking ? <StopCircle className="h-4 w-4"/> : <Volume2 className="h-4 w-4"/>}
                        </Button>
                    )}
                </div>
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
