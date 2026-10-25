"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../lib/api";
import type { Message, MoodState } from "../types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mood, setMood] = useState<MoodState | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    fetchMessages()
      .then((data) => {
        setMessages(data.messages);
        setMood(data.mood);
      })
      .catch(() =>
        setError("Serverga ulanib bo'lmadi. Backend ishlayotganini tekshir.")
      )
      .finally(() => setLoading(false));
  }, []);

  const send = useCallback(async (content: string) => {
    setError(null);

    const tempId = -Date.now();
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "USER", content, createdAt: new Date().toISOString() },
    ]);
    setSending(true);

    try {
      const data = await sendMessage(content);
      setMessages((prev) => [
        ...prev,
        {
          id: tempId - 1,
          role: "ASSISTANT",
          content: data.reply,
          createdAt: new Date().toISOString(),
        },
      ]);
      setMood(data.mood);
      return true;
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError("Xabar yuborilmadi. Qayta urinib ko'r.");
      return false;
    } finally {
      setSending(false);
    }
  }, []);

  return { messages, mood, loading, sending, error, send };
}