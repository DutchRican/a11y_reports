import { DateFilter } from "../../pages/OverviewPage/types";

export default function Chip({
	item,
	onClick,
	className = '',
}: {
	item: { name: string, val: string | DateFilter };
	onClick?: () => void;
	className?: string;
}) {
	const isString = typeof item.val === 'string';
	const parsedLabel = isString ? item.val as string : JSON.stringify(item.val);
	if (!parsedLabel || (!isString && !(item.val as DateFilter)?.to && !(item.val as DateFilter)?.from)) return null;
	return (
		<span
			className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer transition-colors ${className}`}
		>
			<span className="pr-2">{item.name}:</span><span>{parsedLabel}</span>
			<button
				type="button"
				className="ml-2 p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
				onClick={onClick}
				aria-label="Remove"
			>
				<svg
					className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-red-500"
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