"use server";

import prisma from "@/prisma/prisma";
import { Difficulty } from "@prisma/client";

export async function addLeaderboardEntry(timeInMs: number, difficulty: Difficulty) {
	await prisma.leaderboardEntry.create({
		data: {
			difficulty,
			timeInMs,
		},
	});
}
