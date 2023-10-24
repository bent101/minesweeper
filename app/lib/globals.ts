import { Difficulty } from "@prisma/client";

export const difficulties = [
	"EASY",
	"MEDIUM",
	"HARD",
] as const satisfies readonly Difficulty[];
