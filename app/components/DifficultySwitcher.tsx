import { Dispatch } from "react";
import { MsAction } from "../lib/minesweeper";
import { Difficulty } from "@prisma/client";
import clsx from "clsx";

const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

export default function DifficultySwitcher({
	dispatch,
	curDifficulty,
}: {
	dispatch: Dispatch<MsAction>;
	curDifficulty: Difficulty;
}) {
	return (
		<div className="flex items-center overflow-clip rounded-full font-extrabold">
			{difficulties.map((difficulty) => (
				<button
					key={difficulty}
					onClick={() => dispatch({ type: "new game", difficulty })}
					className={clsx(
						"flex-1 py-4",
						curDifficulty === difficulty
							? "bg-green-100 text-green-700"
							: "bg-green-700 text-green-100"
					)}
				>
					{difficulty[0] + difficulty.slice(1).toLowerCase()}
				</button>
			))}
		</div>
	);
}
