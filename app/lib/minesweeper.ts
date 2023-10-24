import { Difficulty } from "@prisma/client";
import { addLeaderboardEntry } from "./actions";
import { getIndexedNeighbors, getNeighbors, shuffledArray } from "./utils";

export type MsTile = {
	type: "mine" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	state:
		| "unflagged"
		| "flagged"
		| "revealed"
		| "flagged incorrectly"
		| "clicked mine";
};

export type MsAction =
	| { type: "reveal tile"; row: number; col: number; timestampInMs: number }
	| { type: "toggle flag"; row: number; col: number; timestampInMs: number }
	| { type: "start"; row: number; col: number; timestampInMs: number }
	| { type: "new game"; difficulty: Difficulty };

export type MsGameState = {
	difficulty: Difficulty;
	board: MsTile[][];
	flagsLeft: number;
	stage: "start" | "playing" | "won" | "lost";
};

function getGameConfig(difficulty: Difficulty) {
	switch (difficulty) {
		case "EASY":
			return { width: 10, height: 8, numMines: 10 };
		case "MEDIUM":
			return { width: 18, height: 14, numMines: 40 };
		case "HARD":
			return { width: 24, height: 20, numMines: 99 };
	}
}

export function newMsGame(difficulty: Difficulty): MsGameState {
	const gameConfig = getGameConfig(difficulty);
	return {
		difficulty,
		board: Array.from({ length: gameConfig.height }, () =>
			Array.from({ length: gameConfig.width }, () => ({
				type: 0,
				state: "unflagged",
			}))
		),
		flagsLeft: gameConfig.numMines,
		stage: "start",
	};
}

/**
 * This is an [Immer](https://www.npmjs.com/package/immer) reducer, so it just mutates `gameState` and returns nothing.
 *
 * See the [React docs on Immer](https://react.dev/learn/extracting-state-logic-into-a-reducer#writing-concise-reducers-with-immer) for more info
 */
export function msReducer(gameState: MsGameState, action: MsAction): void {
	const gameConfig = getGameConfig(gameState.difficulty);

	switch (action.type) {
		case "reveal tile": {
			const { row: r, col: c, timestampInMs } = action;

			if (gameState.board[r][c].type === "mine") {
				onMineClicked(gameState, r, c);
			} else {
				if (gameState.board[r][c].type === 0) {
					revealEmptyTile(gameState, r, c);
				} else {
					gameState.board[r][c].state = "revealed";
				}
				if (
					numUnrevealedTiles(gameState.board) === gameConfig.numMines
				) {
					gameState.stage = "won";
					const curDifficulty = gameState.difficulty;
					setTimeout(() => addLeaderboardEntry(timestampInMs, curDifficulty), 0);
				}
			}

			break;
		}
		case "toggle flag": {
			const { row: r, col: c } = action;
			if (gameState.board[r][c].state === "flagged") {
				gameState.board[r][c].state = "unflagged";
				gameState.flagsLeft += 1;
			} else {
				gameState.board[r][c].state = "flagged";
				gameState.flagsLeft -= 1;
			}
			break;
		}
		case "start": {
			gameState.stage = "playing";

			const minePlacements = shuffledArray(
				Array.from({
					length: gameConfig.width * gameConfig.height - 9,
				}).map((_, i) => i < gameConfig.numMines)
			);

			// Place the mines
			let minesPlaced = 0;
			let tilesVisited = 0;

			minePlacing: for (let r = 0; r < gameConfig.height; r++) {
				for (let c = 0; c < gameConfig.width; c++) {
					// gaurantee that the clicked squre will be a 0
					if (
						Math.abs(action.row - r) <= 1 &&
						Math.abs(action.col - c) <= 1
					)
						continue;

					if (minePlacements[tilesVisited++]) {
						gameState.board[r][c].type = "mine";
						minesPlaced++;
						if (minesPlaced === gameConfig.numMines)
							break minePlacing;
					}
				}
			}

			// Calculate the number of adjacent mines for each tile
			for (let r = 0; r < gameConfig.height; r++) {
				for (let c = 0; c < gameConfig.width; c++) {
					if (gameState.board[r][c].type !== "mine") {
						gameState.board[r][c].type = numAdjacentMines(
							gameState.board,
							r,
							c
						);
					}
				}
			}

			// "Click" the tile at (action.row, action.col)
			revealEmptyTile(gameState, action.row, action.col);
			break;
		}
		case "new game": {
			const newState = newMsGame(action.difficulty);
			gameState.board = newState.board;
			gameState.flagsLeft = newState.flagsLeft;
			gameState.stage = newState.stage;
			gameState.difficulty = newState.difficulty;
			break;
		}
	}
}

function onMineClicked(gameState: MsGameState, r: number, c: number) {
	gameState.stage = "lost";

	for (let r = 0; r < gameState.board.length; r++) {
		for (let c = 0; c < gameState.board[0].length; c++) {
			// reveal all the unflagged mines
			if (
				gameState.board[r][c].type === "mine" &&
				gameState.board[r][c].state === "unflagged"
			) {
				gameState.board[r][c].state = "revealed";
			}

			// mark all the incorrectly flagged tiles
			if (
				gameState.board[r][c].type !== "mine" &&
				gameState.board[r][c].state === "flagged"
			) {
				gameState.board[r][c].state = "flagged incorrectly";
			}
		}
	}

	gameState.board[r][c].state = "clicked mine";
}

function numAdjacentMines(board: MsTile[][], r: number, c: number) {
	let mineCount = 0;

	for (const tile of getNeighbors(board, r, c)) {
		if (tile.type === "mine") {
			mineCount++;
		}
	}

	return mineCount as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

/**
 * does flood fill on all the 0 tiles. Assumes `board[r][c]` is 0
 */
function revealEmptyTile(gameState: MsGameState, r0: number, c0: number): void {
	const queue = [[r0, c0]];

	while (queue.length > 0) {
		const [[r, c]] = queue.splice(0, 1);

		// if its a mine (or already revealed), ignore it (dont reveal it)
		if (
			gameState.board[r][c].type === "mine" ||
			gameState.board[r][c].state === "revealed"
		)
			continue;

		// if its a flag, give the flag back
		if (gameState.board[r][c].state === "flagged") gameState.flagsLeft += 1;

		// reveal it!
		gameState.board[r][c].state = "revealed";

		// if its a 0, queue its neighbors
		if (gameState.board[r][c].type === 0) {
			getIndexedNeighbors(gameState.board, r, c).forEach(
				({ val, nr, nc }) => {
					queue.push([nr, nc]);
				}
			);
		}
	}
}

function numUnrevealedTiles(board: MsTile[][]) {
	let ret = 0;
	for (const row of board) {
		for (const tile of row) {
			if (tile.state !== "revealed") ret++;
		}
	}
	return ret;
}
