export default function Chip({
	label,
	onClick,
	className = '',
}: {
	label: string;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<span
			className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 cursor-pointer transition-colors ${className}`}
		>
			{label}
			<button
				type="button"
				className="ml-2 p-0.5 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
				onClick={onClick}
				aria-label="Remove"
			>
				<svg
					className="w-3 h-3 text-gray-500 hover:text-red-500"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</span>
	);
}