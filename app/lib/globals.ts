import { Difficulty } from "@prisma/client";

export const difficulties = [
	"EASY",
	"MEDIUM",
	"HARD",
] as const satisfies readonly Difficulty[];

export const leaderboardFilters = [...difficulties] as const;
