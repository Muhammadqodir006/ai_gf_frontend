import type { Message, MoodState } from "../types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export async function fetchMessages(): Promise<{
    messages: Message[];
    mood: MoodState;
}> {
    const res = await fetch(`${API}/messages`, {cache: "no-store"});
    if(!res.ok) throw new Error("Xabarlarni olib bolmadi");
    return res.json();
}

export async function sendMessage(
    content: string
): Promise<{reply: string; mood: MoodState}> {
    const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content}),
    });
    if (!res.ok) throw new Error("Xabar yuborilmadi");
    return res.json();
}