import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
  // You can add custom user properties here
  username?: string;
}

export interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  role: "user" | "assistant";
  createdAt: any; // Firestore timestamp
  toolUsed?: 'webSearch' | 'imageGeneration';
}

export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: any; // Firestore timestamp
  messages: Message[];
}
