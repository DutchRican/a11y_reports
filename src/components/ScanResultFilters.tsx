import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { dateToLocalDateString } from '../helpers/date';

interface ScanResultFiltersProps {
	resultNameFilter: string;
	dateFilter: string;
	handleFilterChange: (key: string, value: string) => void;
	resultDates: string[];
	filtersOpen: boolean;
}


const ScanResultFilters: React.FC<ScanResultFiltersProps> = ({
	resultNameFilter,
	dateFilter,
	handleFilterChange,
	resultDates,
	filtersOpen,
}) => {

	// Parse dateFilter to Date objects
	let [start, end] = dateFilter.split(',');
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

	// Sync dateFilter string to dateRange state
	useEffect(() => {
		if (start && end) {
			const startDate = new Date(start);
			const endDate = new Date(end);
			if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
				setDateRange([startDate, endDate]);
			}
		} else {
			setDateRange([null, null]);
		}
	}, [dateFilter]);

	return (
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
							value={resultNameFilter}
							onChange={(e) => handleFilterChange('testName', e.target.value)}
						/>
						{resultNameFilter && (
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
					<div className="relative z-30">
						<label htmlFor="dateRangeFilter" className="sr-only">Filter by Date Range</label>
						<DatePicker
							id="dateRangeFilter"
							selectsRange
							startDate={dateRange[0]}
							endDate={dateRange[1]}
							onChange={(update: [Date | null, Date | null]) => {
								setDateRange(update);
								if (update[0] && update[1]) {
									handleFilterChange('date', `${dateToLocalDateString(update[0].toLocaleDateString())} - ${dateToLocalDateString(update[1].toLocaleDateString())}`);
								} else if (!update[0] && !update[1]) {
									handleFilterChange('date', '');
								}
							}}
							isClearable
							className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							dateFormat="MM/dd/yyyy"
							placeholderText="Select date range"
							popperClassName="z-[9999] !z-[9999]"
							popperPlacement="bottom-start"
							portalId="datepicker-portal"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScanResultFilters;
