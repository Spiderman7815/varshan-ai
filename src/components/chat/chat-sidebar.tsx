
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { useFirebase } from "@/firebase";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit,
  Check,
  X,
  Code2,
  Download,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import type { Chat, Message } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
    userId: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function ChatSidebar({ userId, isOpen, setIsOpen }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const router = useRouter();
  const params = useParams();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(firestore, "users", userId, "chats"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData: Chat[] = [];
      querySnapshot.forEach((doc) => {
        chatsData.push({ id: doc.id, ...doc.data() } as Chat);
      });
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, [userId, firestore]);

  const createNewChat = async () => {
    const newChatRef = await addDoc(collection(firestore, "users", userId, "chats"), {
      title: "New Chat",
      userId,
      createdAt: serverTimestamp(),
    });
    router.push(`/chat/${newChatRef.id}`);
  };

  const deleteChat = async (chatIdToDelete: string) => {
    try {
      const chatDocRef = doc(firestore, "users", userId, "chats", chatIdToDelete);
      // Delete all messages in the chat
      const messagesQuery = query(collection(chatDocRef, "messages"));
      const messagesSnapshot = await getDocs(messagesQuery);
      const batch = writeBatch(firestore);
      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Delete the chat document
      await deleteDoc(chatDocRef);

      toast({ title: "Chat deleted" });
      if (chatId === chatIdToDelete) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error deleting chat: ", error)
      toast({ variant: "destructive", title: "Error deleting chat" });
    }
  };

  const downloadChat = async (chatIdToDownload: string, chatTitle: string) => {
    try {
      const messagesQuery = query(
        collection(firestore, "users", userId, "chats", chatIdToDownload, "messages"),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(messagesQuery);
      const messages: Message[] = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Message));

      let chatContent = `Chat: ${chatTitle}\n\n`;
      chatContent += messages
        .map(msg => {
          const role = msg.role === 'user' ? 'User' : 'VarshanAI';
          let content = `${role}: ${msg.text}`;
          if (msg.imageUrl) {
            content += `\n[Image: ${msg.imageUrl}]`;
          }
          return content;
        })
        .join("\n\n");

      const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${chatTitle.replace(/[\\/:"*?<>|]/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ title: "Chat downloaded" });
    } catch (error) {
      console.error("Error downloading chat:", error);
      toast({ variant: "destructive", title: "Error downloading chat" });
    }
  };

  const startEditing = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const cancelEditing = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const saveTitle = async (chatIdToUpdate: string) => {
    if (editingTitle.trim() === "") return;
    try {
      await updateDoc(doc(firestore, "users", userId, "chats", chatIdToUpdate), {
        title: editingTitle,
      });
      toast({ title: "Chat title updated" });
      cancelEditing();
    } catch (error) {
      toast({ variant: "destructive", title: "Error updating title" });
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-muted/40">
      <div className="p-4">
        <Link href="/chat" className="flex items-center gap-2 text-foreground">
          <div className="rounded-lg bg-primary p-2">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">VarshanAI</span>
        </Link>
      </div>

      <div className="p-4">
        <Button className="w-full" onClick={createNewChat}>
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          <p className="px-2 text-sm font-semibold text-muted-foreground">Recent</p>
          {chats.map((chatItem) => (
            <div
              key={chatItem.id}
              className={`group relative rounded-md p-2 hover:bg-muted ${
                chatId === chatItem.id ? "bg-muted font-semibold" : ""
              }`}
            >
              {editingChatId === chatItem.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="h-8 flex-1"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveTitle(chatItem.id)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => saveTitle(chatItem.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={cancelEditing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link
                  href={`/chat/${chatItem.id}`}
                  className="flex items-center gap-2 truncate"
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{chatItem.title}</span>
                </Link>
              )}
              {editingChatId !== chatItem.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-muted">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => startEditing(chatItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => downloadChat(chatItem.id, chatItem.title)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitleComponent>Are you sure?</AlertDialogTitleComponent>
                        <AlertDialogDescription>
                          This will permanently delete this chat. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteChat(chatItem.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="p-0 w-72 md:hidden">
            <SheetTitle className="sr-only">Chat History</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:block transition-all duration-300 ease-in-out", isOpen ? "w-64 lg:w-72" : "w-0")}>
        {isOpen && <div className="border-r h-full"><SidebarContent /></div>}
      </div>
    </>
  );
}
