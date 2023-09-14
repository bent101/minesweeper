import { getIndexedNeighbors, getNeighbors, shuffledArray } from "./utils";

const BOARD_WIDTH = 24;
export const BOARD_HEIGHT = 20;
const NUM_MINES = 99;

export type MsTile = {
	type: "mine" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	state: "unflagged" | "flagged" | "revealed" | "flagged incorrectly" | "clicked mine";
};

export type MsAction =
	| { type: "reveal tile"; row: number; col: number }
	| { type: "toggle flag"; row: number; col: number }
	| { type: "start"; row: number; col: number }
	| { type: "new game" };

export type MsGameState = {
	board: MsTile[][];
	flagsLeft: number;
	stage: "start" | "playing" | "won" | "lost";
};

export function newMsGame(): MsGameState {
	return {
		board: Array.from({ length: BOARD_HEIGHT }, () =>
			Array.from({ length: BOARD_WIDTH }, () => ({ type: 0, state: "unflagged" }))
		),
		flagsLeft: NUM_MINES,
		stage: "start",
	};
}

/**
 * This is an [Immer](https://www.npmjs.com/package/immer) reducer, so it just mutates `gameState` and returns nothing.
 *
 * See the [React docs on Immer](https://react.dev/learn/extracting-state-logic-into-a-reducer#writing-concise-reducers-with-immer) for more info
 */
export function msReducer(gameState: MsGameState, action: MsAction): void {
	switch (action.type) {
		case "reveal tile": {
			const { row: r, col: c } = action;

			if (gameState.board[r][c].type === "mine") {
				onMineClicked(gameState, r, c);
			} else {
				if (gameState.board[r][c].type === 0) {
					revealEmptyTile(gameState, r, c);
				} else {
					gameState.board[r][c].state = "revealed";
				}
				if (numUnrevealedTiles(gameState.board) === NUM_MINES) {
					gameState.stage = "won";
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
				Array.from({ length: BOARD_WIDTH * BOARD_HEIGHT - 9 }).map((_, i) => i < NUM_MINES)
			);

			// Place the mines
			let minesPlaced = 0;
			let tilesVisited = 0;
			minePlacing: for (let r = 0; r < BOARD_HEIGHT; r++) {
				for (let c = 0; c < BOARD_WIDTH; c++) {
					// gaurantee that the clicked squre will be a 0
					if (Math.abs(action.row - r) <= 1 && Math.abs(action.col - c) <= 1) continue;

					if (minePlacements[tilesVisited++]) {
						gameState.board[r][c].type = "mine";
						minesPlaced++;
						if (minesPlaced === NUM_MINES) break minePlacing;
					}
				}
			}

			// Calculate the number of adjacent mines for each tile
			for (let r = 0; r < BOARD_HEIGHT; r++) {
				for (let c = 0; c < BOARD_WIDTH; c++) {
					if (gameState.board[r][c].type !== "mine") {
						gameState.board[r][c].type = numAdjacentMines(gameState.board, r, c);
					}
				}
			}

			// "Click" the tile at (action.row, action.col)
			revealEmptyTile(gameState, action.row, action.col);
			break;
		}
		case "new game": {
			const newState = newMsGame();
			gameState.board = newState.board;
			gameState.flagsLeft = newState.flagsLeft;
			gameState.stage = newState.stage;
			break;
		}
	}
}

function onMineClicked(gameState: MsGameState, r: number, c: number) {
	gameState.stage = "lost";

	for (let r = 0; r < gameState.board.length; r++) {
		for (let c = 0; c < gameState.board[0].length; c++) {
			// reveal all the unflagged mines
			if (gameState.board[r][c].type === "mine" && gameState.board[r][c].state === "unflagged") {
				gameState.board[r][c].state = "revealed";
			}

			// mark all the incorrectly flagged tiles
			if (gameState.board[r][c].type !== "mine" && gameState.board[r][c].state === "flagged") {
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
		if (gameState.board[r][c].type === "mine" || gameState.board[r][c].state === "revealed") continue;

		// if its a flag, give the flag back
		if (gameState.board[r][c].state === "flagged") gameState.flagsLeft += 1;

		// reveal it!
		gameState.board[r][c].state = "revealed";

		// if its a 0, queue its neighbors
		if (gameState.board[r][c].type === 0) {
			getIndexedNeighbors(gameState.board, r, c).forEach(({ val, nr, nc }) => {
				queue.push([nr, nc]);
			});
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
