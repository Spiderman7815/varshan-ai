"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Mic, Paperclip, Send, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ChatInputProps {
  onSendMessage: (text: string, file: File | null) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setText(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        toast({ variant: "destructive", title: "Speech Recognition Error", description: event.error });
      };

      recognitionRef.current = recognition;
    }
  }, [toast]);
  

  const handleSend = () => {
    if (isLoading || (!text.trim() && !file)) return;
    onSendMessage(text, file);
    setText("");
    setFile(null);
    setFilePreview(null);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
        toast({ variant: "destructive", title: "Browser Not Supported", description: "Speech recognition is not supported in this browser." });
        return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile));
    }
  }

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  }

  return (
    <div className="relative">
      {filePreview && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-muted rounded-lg">
            <div className="relative">
                <Image src={filePreview} alt="Preview" width={80} height={80} className="rounded-md" />
                <Button size="icon" variant="ghost" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive" onClick={removeFile}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        </div>
      )}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Ask me anything..."
        className="pr-32 min-h-[48px] resize-none"
        rows={1}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <label htmlFor="file-upload" className="cursor-pointer">
            <Paperclip className="h-5 w-5 text-muted-foreground hover:text-primary"/>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
        </label>
        <Button size="icon" variant="ghost" onClick={handleMicClick}>
          <Mic className={`h-5 w-5 text-muted-foreground hover:text-primary ${isRecording ? 'text-accent' : ''}`} />
        </Button>
        <Button size="sm" onClick={handleSend} disabled={isLoading || (!text.trim() && !file)}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
