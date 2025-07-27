import { forwardRef } from "react";

export const CalTrigger = forwardRef<HTMLButtonElement, React.ComponentProps<'button'> & { value?: string; onClick?: () => void }>(
	({ onClick }, ref) => (
		<button
			type="button"
			onClick={onClick}
			ref={ref}
			aria-label="Select date range"
			className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
		</button>
	)
);