"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { cn } from "@/app/components/ui/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import markdownit from 'markdown-it'


interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatbotFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [configId, setConfigId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const md = markdownit({
    html: false
  })

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSupabaseUser(user);
    });
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          config_id: configId,
          user_id: supabaseUser?.id
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Streaming failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setConfigId(response.headers.get("X-Config-ID"))
      let aiContent = "";

      // 👇 Create empty assistant message FIRST
      const aiMessageId = `assistant-${Date.now()}`;


      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;

        // 👇 Update message LIVE
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: md.render(aiContent) }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-7 p-3 rounded-full shadow-lg flex items-center justify-center transition-all z-30 bg-primary hover:bg-primary/90 text-primary-foreground"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              "0 4px 16px rgba(3, 2, 18, 0.3)",
              "0 4px 24px rgba(3, 2, 18, 0.5)",
              "0 4px 16px rgba(3, 2, 18, 0.3)",
            ],
          }}
          transition={{
            boxShadow: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <MessageCircle size={22} />
        </motion.button>
      </DrawerTrigger>

      <DrawerContent className="h-full max-w-200 rounded-none border-l">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DrawerHeader className="border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2 text-base">
                <Bot size={20} className="text-primary" />
                AI Assistant
              </DrawerTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
          </DrawerHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-4 select-text" >
            <div className="space-y-4 max-w-2xl mx-auto w-full">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex gap-3",
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    {/* AI avatar */}
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={16} className="text-primary" />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={cn(
                        `max-w-[75%] px-4 py-2.5 rounded-2xl select-text whitespace-pre-wrap
                        text-sm leading-relaxed [&_ul]:list-disc 
                        [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 
                        [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_code]:bg-muted-foreground/10 
                        [&_code]:px-1 [&_code]:rounded [&_pre]:bg-muted-foreground/10 [&_pre]:p-3 
                        [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_h3]:font-semibold [&_h3]:text-base 
                        [&_h4]:font-semibold [&_h4]:text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30
                         [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:underline [&_a]:text-primary
                         [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted-foreground/10 [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1`,
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />

                    {/* User avatar */}
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarImage src={`${supabaseUser?.user_metadata.picture}`} />
                        <AvatarFallback>{String(supabaseUser?.user_metadata.full_name).split(" ").map((n) => n[0]).splice(0, 2).join("")}</AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-primary" />
                  </div>
                  <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input bar */}
          <div className="shrink-0 border-t border-border p-4 bg-background">
            <div className="max-w-2xl mx-auto w-full flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-input-background rounded-xl px-4 py-2.5 border border-border">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground resize-none p-0 overflow-y-auto"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-3 rounded-xl transition-colors shrink-0",
                  input.trim() && !isLoading
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}