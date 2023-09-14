import { Brightness5, Flag } from "@mui/icons-material";
import { BOARD_HEIGHT, MsTile } from "../lib/minesweeper";
import { clsx } from "clsx";

export default function Tile({
	board,
	r,
	c,
	onLeftClick,
	onRightClick,
}: {
	board: MsTile[][];
	r: number;
	c: number;
	onLeftClick: () => void;
	onRightClick: () => void;
}) {
	const tile = board[r][c];
	const isLightSquare = (r + c) % 2 === 1;

	const textColor =
		tile.type === "mine"
			? "text-red-900"
			: [
					"text-blue-600",
					"text-green-600",
					"text-red-600",
					"text-purple-600",
					"text-yellow-700",
					"text-orange-600",
					"text-pink-600",
					"text-red-800",
			  ][tile.type - 1];

	const isElevated = tile.state === "flagged" || tile.state === "unflagged";

	/**
	 * width and height of a tile, in `vh`
	 */
	const tileSize = 100 / BOARD_HEIGHT;

	return (
		<div
			className="group relative leading-none"
			style={{
				width: `${tileSize}vh`,
				height: `${tileSize}vh`,
				fontSize: `${0.8 * tileSize}vh`,
			}}
		>
			{isElevated && <div className="absolute inset-0 z-10 [box-shadow:_3px_4px_5px_#0005]" />}
			<div
				onMouseDown={(e) => {
					e.preventDefault();
					if (e.button === 0) {
						onLeftClick();
					} else if (e.button === 2) {
						onRightClick();
					}
				}}
				onContextMenu={(e) => e.preventDefault()}
				className={clsx(
					"absolute inset-0 grid place-items-center font-semibold",
					isElevated && "z-20",
					textColor,
					!isElevated
						? isLightSquare
							? "bg-transparent"
							: "bg-black/5"
						: [
								"cursor-pointer",
								isLightSquare ? "bg-green-400" : "bg-green-500",
								tile.state === "unflagged" && "hover:opacity-50",
						  ],
					tile.state === "clicked mine" && "bg-red-500/40"
				)}
			>
				{(tile.state === "revealed" || tile.state === "clicked mine" || tile.state === "flagged incorrectly") &&
					(tile.type === "mine" ? (
						<Brightness5 className="h-full w-full scale-75" />
					) : (
						tile.type !== 0 && tile.type
					))}
			</div>

			<div className={clsx("pointer-events-none absolute inset-0", isElevated && "z-20")}>
				{(tile.state === "flagged" || tile.state === "flagged incorrectly") && (
					<Flag
						style={{ width: `${tileSize}vh`, height: `${tileSize}vh` }}
						className={clsx(
							"scale-100 text-red-600 transition-transform group-hover:scale-90",
							tile.state === "flagged incorrectly" && "opacity-80"
						)}
					/>
				)}
			</div>
		</div>
	);
}
