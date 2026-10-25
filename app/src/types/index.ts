export type Mood = "HAPPY" | "ANGRY" | "SAD" | "jEALOUS" | "NEUTRAL";

export type  MoodState = {
    id: number;
    mood: Mood;
    affection: number;
    anger: number;
    jealousy: number;
    updatedAt: string;
};

export type Message = {
    id: number;
    role: "USER" | "ASSISTANT";
    content: string;
    createdAt: string;
};