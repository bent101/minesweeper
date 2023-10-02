import { Dispatch } from "react";
import { MsAction } from "../lib/minesweeper";
import { Difficulty } from "@prisma/client";
import clsx from "clsx";
import { difficulties } from "../lib/globals";
import { toTitleCase } from "../lib/utils";

export default function DifficultySwitcher({
	dispatch,
	curDifficulty,
}: {
	dispatch: Dispatch<MsAction>;
	curDifficulty: Difficulty;
}) {
	return (
		<div className="flex gap-2 text-lg font-semibold">
			{difficulties.map((difficulty) => (
				<button
					key={difficulty}
					onClick={() => dispatch({ type: "new game", difficulty })}
					className={clsx(
						"rounded-full px-6 py-2",
						difficulty === curDifficulty
							? "bg-white text-green-800"
							: "bg-transparent text-white hover:bg-white/10"
					)}
				>
					{toTitleCase(difficulty)}
				</button>
			))}
		</div>
	);
}
