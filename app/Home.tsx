"use client";
import { useImmerReducer } from "use-immer";
import { msReducer, newMsGame } from "./lib/minesweeper";
import Tile from "./components/Tile";
import { Flag } from "@mui/icons-material";

export default function Home() {
	const [msGameState, dispatch] = useImmerReducer(msReducer, newMsGame());

	function leftClick(row: number, col: number) {
		const { state } = msGameState.board[row][col];
		if (state === "unflagged") {
			if (msGameState.stage === "start") {
				dispatch({ type: "start", row, col });
			} else {
				dispatch({ type: "reveal tile", row, col });
			}
		}
	}

	function rightClick(row: number, col: number) {
		const { state } = msGameState.board[row][col];
		if (state !== "revealed") {
			dispatch({ type: "toggle flag", row, col });
		}
	}

	return (
		<div>
			<div className="grid h-20 place-items-center bg-green-800 text-xl font-semibold text-white">
				<div className="flex items-center gap-6">
					<div className="flex w-32 items-center gap-2 ">
						<Flag /> {msGameState.flagsLeft}
					</div>
					<div className="w-32 ">{msGameState.stage}</div>
				</div>
			</div>
			{msGameState.board.map((row, r) => (
				<div key={r} className="flex">
					{row.map((tile, c) => (
						<Tile
							key={c}
							board={msGameState.board}
							r={r}
							c={c}
							onLeftClick={() => leftClick(r, c)}
							onRightClick={() => rightClick(r, c)}
						/>
					))}
				</div>
			))}
		</div>
	);
}
