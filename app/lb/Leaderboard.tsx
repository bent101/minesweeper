"use client";

import clsx from "clsx";
import { formatDate, formatDuration, toTitleCase } from "../lib/utils";
import { leaderboardFilters } from "../lib/globals";
import { useState } from "react";

export default function Leaderboard({
	leaderboardsData,
}: {
	leaderboardsData: {
		id: number;
		timeInMs: number;
		createdAt: Date;
	}[][];
}) {
	const leaderboards = Object.fromEntries(
		leaderboardFilters.map((filter, i) => [filter, leaderboardsData[i]])
	);

	const [selectedFilter, setSelectedFilter] =
		useState<(typeof leaderboardFilters)[number]>("ALL");

	const curLeaderboard = leaderboards[selectedFilter];

	return (
		<>
			<h1 className="pl-20 text-4xl font-semibold text-white">
				Leaderboard
			</h1>
			<div className="flex gap-2 pl-14 text-lg font-semibold">
				{leaderboardFilters.map((filter) => (
					<button
						onClick={() => setSelectedFilter(filter)}
						key={filter}
						className={clsx(
							"rounded-full px-6 py-2",
							filter === selectedFilter
								? "bg-white text-green-800"
								: "bg-transparent text-white hover:bg-white/10"
						)}
					>
						{toTitleCase(filter)}
					</button>
				))}
			</div>
			<ol className="space-y-4 text-lg">
				{curLeaderboard.map((entry, i) => (
					<li
						key={entry.id}
						className="flex w-max items-center justify-between gap-8"
					>
						<div className="w-12 text-right font-mono font-extrabold text-white/50">
							{i + 1}
						</div>
						<div className="w-64 font-mono tracking-wide text-white">
							{formatDuration(entry.timeInMs)}
						</div>
						<div className="font-semibold tracking-wide text-white/50">
							{formatDate(entry.createdAt)}
						</div>
					</li>
				))}
			</ol>
		</>
	);
}
