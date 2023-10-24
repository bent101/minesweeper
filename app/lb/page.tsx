"use server";

import prisma from "@/prisma/prisma";
import Link from "next/link";
import { difficulties } from "../lib/globals";
import Leaderboard from "./Leaderboard";

export default async function Page() {
	const leaderboardsData = await Promise.all(
		difficulties.map((leaderboard) =>
				prisma.leaderboardEntry.findMany({
						select: {
							timeInMs: true,
							createdAt: true,
							id: true,
						},
						where: { difficulty: leaderboard },
						orderBy: { timeInMs: "asc" },
						take: 50,
				  })
		)
	);

	return (
		<>
			<div className="sticky inset-x-0 top-0 bg-green-800 p-4">
				<Link
					href="/"
					className="inline-block cursor-pointer rounded-full px-6 py-3 text-2xl font-semibold text-white hover:bg-white/10"
				>
					← Back to game
				</Link>
			</div>
			<div className="mx-auto max-w-xl space-y-8 py-24">
				<Leaderboard leaderboardsData={leaderboardsData} />
			</div>
		</>
	);
}
