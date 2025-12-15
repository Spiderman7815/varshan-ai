
"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, useFirebase } from "@/firebase";
import type { Message } from "@/lib/types";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { chat } from "@/ai/flows/chat-flow";
import { generateChatTitle } from "@/ai/flows/generate-chat-title";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { useToast } from "@/hooks/use-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { fileToGenerativePart } from "@/lib/utils";

interface ChatLayoutProps {
  chatId?: string;
  initialChat: any;
}

export function ChatLayout({ chatId: initialChatId, initialChat }: ChatLayoutProps) {
  const { user } = useUser();
  const { firestore, storage } = useFirebase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState(initialChatId);
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCurrentChatId(initialChatId);
    if (!user || !initialChatId) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(firestore, "users", user.uid, "chats", initialChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Message)
      );
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [initialChatId, firestore, user]);

  useEffect(() => {
    // Stop any playing audio when the chat changes
    return () => {
      if (activeAudio) {
        activeAudio.pause();
        setActiveAudio(null);
      }
    };
  }, [currentChatId, activeAudio]);


  const handleSendMessage = useCallback(async (text: string, file: File | null) => {
    if (!user || (!text.trim() && !file)) return;
    setLoading(true);

    try {
      let chatId = currentChatId;
      if (!chatId) {
        const newChatRef = await addDoc(collection(firestore, "users", user.uid, "chats"), {
          title: "New Chat",
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        chatId = newChatRef.id;
        setCurrentChatId(chatId);
        router.replace(`/chat/${chatId}`, { scroll: false });
      }

      if (!chatId) {
        throw new Error("Chat ID is not available.");
      }

      const messagesRef = collection(firestore, "users", user.uid, "chats", chatId, "messages");
      
      const userMessage: Omit<Message, "id"> = {
        text,
        role: "user",
        createdAt: serverTimestamp(),
      };

      if (file) {
          const storageRef = ref(storage, `chats/${chatId}/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          userMessage.imageUrl = imageUrl;
      }
      
      await addDoc(messagesRef, userMessage);

      setTimeout(async () => {
        try {
          const fullPrompt = userMessage.imageUrl ? `${text} (Image attached: ${userMessage.imageUrl})` : text;
          const aiResponse = await chat({ prompt: fullPrompt });
          
          const aiMessage: Omit<Message, "id"> = { role: "assistant", createdAt: serverTimestamp() };
          if (aiResponse.response) {
            aiMessage.text = aiResponse.response;
          }
          if (aiResponse.imageUrl) {
            aiMessage.imageUrl = aiResponse.imageUrl;
          }
           if (aiResponse.toolUsed === 'webSearch') {
            aiMessage.toolUsed = 'webSearch';
          }

          await addDoc(messagesRef, aiMessage);
          
          if (messages.length === 0 && aiMessage.text) {
            const conversation = `User: ${text}\nAssistant: ${aiMessage.text}`;
            const titleResponse = await generateChatTitle({ conversation });
            const chatDocRef = doc(firestore, "users", user.uid, "chats", chatId!);
            await setDoc(chatDocRef, { title: titleResponse.title }, { merge: true });
          }
        } catch (aiError) {
          console.error("AI response error:", aiError);
          toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to get a response from the AI.",
          });
          await addDoc(messagesRef, { text: "Sorry, I couldn't process that. Please try again.", role: "assistant", createdAt: serverTimestamp() });
        } finally {
          setLoading(false);
        }
      }, 500);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
          variant: "destructive",
          title: "Error",
          description: "Could not send message.",
      });
      setLoading(false);
    }
  }, [currentChatId, user, firestore, storage, router, messages.length, toast]);

    const handleRegenerate = async (messageId: string) => {
        if (!currentChatId || !user || messages.length < 1) return;
        setLoading(true);

        const aiMessageIndex = messages.findIndex(msg => msg.id === messageId);
        if (aiMessageIndex < 0 || messages[aiMessageIndex].role !== 'assistant') {
            setLoading(false);
            return;
        }

        const userMessage = messages[aiMessageIndex - 1];
        if (!userMessage || userMessage.role !== 'user') {
            setLoading(false);
            return;
        }

        try {
            const fullPrompt = userMessage.imageUrl ? `${userMessage.text} (Image attached: ${userMessage.imageUrl})` : userMessage.text;
            const aiResponse = await chat({ prompt: fullPrompt });
            
            const messageRef = doc(firestore, "users", user.uid, "chats", currentChatId, "messages", messageId);
            const updatedMessage: Partial<Message> = { createdAt: serverTimestamp() };
            if (aiResponse.response) updatedMessage.text = aiResponse.response;
            if (aiResponse.imageUrl) updatedMessage.imageUrl = aiResponse.imageUrl;
            if (aiResponse.toolUsed) updatedMessage.toolUsed = aiResponse.toolUsed;


            await updateDoc(messageRef, updatedMessage);
            
        } catch (error) {
            console.error("AI regeneration error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to regenerate the response.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTextToSpeech = async (text: string) => {
      if (activeAudio) {
        activeAudio.pause();
        if (activeAudio.src.startsWith('blob:')) {
           URL.revokeObjectURL(activeAudio.src);
        }
        setActiveAudio(null);
        return;
      }
      
      try {
        setLoading(true);
        const { audioDataUri } = await textToSpeech({ text });
        const audio = new Audio(audioDataUri);
        setActiveAudio(audio);
        audio.play();
        audio.onended = () => setActiveAudio(null);

      } catch (error) {
        console.error("Text-to-speech error:", error);
        toast({
          variant: "destructive",
          title: "Text-to-Speech Failed",
          description: "Could not convert text to audio.",
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages
          messages={messages}
          onRegenerate={handleRegenerate}
          onTextToSpeech={handleTextToSpeech}
          isLoading={loading && (messages.length === 0 || messages[messages.length - 1].role === 'user')}
          isSpeaking={!!activeAudio}
        />
      </div>
      <div className="border-t bg-background px-4 py-4 md:px-6">
        <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
      </div>
    </div>
  );
}
