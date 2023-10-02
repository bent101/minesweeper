import { MsAction, MsGameState } from "../lib/minesweeper";
import Tile from "./Tile";

export default function board({
	msGameState,
	dispatch,
	timeInMs,
}: {
	msGameState: MsGameState;
	dispatch: (value: MsAction) => void;
	timeInMs: number;
}) {
	function leftClick(row: number, col: number) {
		if (msGameState.stage === "won" || msGameState.stage === "lost") {
			return;
		}
		const { state } = msGameState.board[row][col];
		if (state === "unflagged") {
			if (msGameState.stage === "start") {
				dispatch({ type: "start", row, col, timestampInMs: timeInMs });
			} else {
				dispatch({ type: "reveal tile", row, col, timestampInMs: timeInMs });
			}
		}
	}

	function rightClick(row: number, col: number) {
		if (msGameState.stage === "won" || msGameState.stage === "lost") {
			return;
		}

		const { state } = msGameState.board[row][col];
		if (state !== "revealed") {
			dispatch({ type: "toggle flag", row, col, timestampInMs: timeInMs });
		}
	}

	return (
		<div>
			{msGameState.board.map((row, r) => (
				<div key={r} className="flex bg-white">
					{row.map((tile, c) => (
						<div key={c}>
							<Tile
								board={msGameState.board}
								r={r}
								c={c}
								onLeftClick={() => leftClick(r, c)}
								onRightClick={() => rightClick(r, c)}
							/>
						</div>
					))}
				</div>
			))}
		</div>
	);
}
