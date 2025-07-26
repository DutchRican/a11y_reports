import React from 'react';

interface ScanResultFiltersProps {
	testNameFilter: string;
	dateFilter: string;
	handleFilterChange: (key: string, value: string) => void;
	testDates: string[];
	filtersOpen: boolean;
}

const ScanResultFilters: React.FC<ScanResultFiltersProps> = ({
	testNameFilter,
	dateFilter,
	handleFilterChange,
	testDates,
	filtersOpen,
}) => (
	<div className={`transition-all duration-300 ease-in-out overflow-hidden ${filtersOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
		<div className="mb-4 w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="relative">
					<label htmlFor="testNameFilter" className="sr-only">Filter by Test Name</label>
					<input
						id="testNameFilter"
						type="text"
						placeholder="Filter by test Name"
						className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={testNameFilter}
						onChange={(e) => handleFilterChange('testName', e.target.value)}
					/>
					{testNameFilter && (
						<button
							type="button"
							aria-label="Clear test name filter"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							onClick={() => handleFilterChange('testName', '')}
							tabIndex={0}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>
				<div className="relative">
					<label htmlFor="dateFilter" className="sr-only">Filter by Time Period</label>
					<select
						id="dateFilter"
						className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={dateFilter}
						onChange={(e) => handleFilterChange('date', e.target.value)}
					>
						<option value="">All Time</option>
						<option value="1week">Last Week</option>
						<option value="1month">Last Month</option>
						<option value="3months">Last 3 Months</option>
						<option value="6months">Last 6 Months</option>
						<option value="1year">Last Year</option>
					</select>
				</div>
			</div>
		</div>
	</div>
);

export default ScanResultFilters;
