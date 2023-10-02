export default function Spinner() {
	return (
		<div className="via-transpraent relative h-16 w-16 animate-spin rounded-full bg-gradient-conic from-white to-transparent">
			<div className="absolute inset-2 rounded-full bg-green-800"></div>
		</div>
	);
}
