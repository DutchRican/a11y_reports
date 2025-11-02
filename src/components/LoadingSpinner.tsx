export default function LoadingSpinner() {
	return (
		// center on page spinner
		<div className="fixed inset-0 flex items-center justify-center">
			<div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-500 border-gray-200"></div>
		</div>
	);
}