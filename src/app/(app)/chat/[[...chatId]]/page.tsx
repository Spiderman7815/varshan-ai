
'use client';

import { ChatLayout } from "@/components/chat/chat-layout";
import { useFirebase, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const { user } = useUser();
  const { firestore } = useFirebase();
  const chatId = params && 'chatId' in params && Array.isArray(params.chatId) ? params.chatId[0] : undefined;

  const chatDocRef = useMemoFirebase(() => {
    if (chatId && user) {
      return doc(firestore, "users", user.uid, "chats", chatId);
    }
    return null;
  }, [chatId, user, firestore]);

  const { data: chat, isLoading } = useDoc(chatDocRef);

  if (isLoading && chatId) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return <ChatLayout chatId={chatId} initialChat={chat} />;
}
