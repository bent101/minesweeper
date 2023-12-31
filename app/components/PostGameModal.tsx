import { EmojiEvents, Replay, Timer } from "@mui/icons-material";
import { formatDuration } from "../lib/utils";

export default function PostGameModal({
	outcome,
	score,
	highScore,
	newGame,
}: {
	outcome: "won" | "lost";
	score: number | null;
	highScore: number | null;
	newGame: () => void;
}) {
	return (
		<div className="flex pt-16 gap-4 flex-col self-stretch rounded-3xl bg-sky-600 p-4 shadow-lg">
			<div className="flex flex-1 items-center justify-around text-2xl font-semibold text-white">
				<div className="flex flex-col items-center gap-4">
					<Timer style={{ width: "3.5rem", height: "3.5rem" }} />
					<div>
						{score === null || outcome === "lost"
							? "---"
							: formatDuration(score)}
					</div>
				</div>
				<div className="flex flex-col items-center gap-4">
					<EmojiEvents
						style={{ width: "3.5rem", height: "3.5rem" }}
					/>
					<div>
						{highScore === null ? "---" : formatDuration(highScore)}
					</div>
				</div>
			</div>
			<button
				onMouseDown={newGame}
				className="rounded-xl py-4 text-xl text-white hover:bg-white/10"
			>
				<Replay className="mr-2" /> Try again{" "}
				<kbd className="ml-2 rounded-md border border-b-2 border-white/60 bg-white/10 px-3 py-1 font-mono font-extrabold text-white/80">
					R
				</kbd>
			</button>
		</div>
	);
}
