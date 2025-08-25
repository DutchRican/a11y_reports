import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUrlsWithIssuesReport } from "../../api/reports";
import { useSettings } from "../../context/settingsContext";
import { dateToLocalDateString } from "../../helpers/date";
import { IViolationReport } from "../../types";

const ViolationURLReport = ({ projectID }: { projectID: string }) => {
	const [limit, setLimit] = useState(5);
	const { earliestFetchDate } = useSettings();
	// Calculate initial date from earliestFetchDate (days ago)
	const initialDate = (() => {
		const date = new Date();
		date.setDate(date.getDate() - (earliestFetchDate || 0));
		return dateToLocalDateString(date);
	})();
	const [fromDateInput, setFromDateInput] = useState<string>(initialDate);
	const [fromDate, setFromDate] = useState<string>(initialDate);

	// Debounce the date input so query only updates after user stops typing
	useEffect(() => {
		const handler = setTimeout(() => {
			setFromDate(fromDateInput);
		}, 500);
		// Only clear on unmount
		return () => {
			clearTimeout(handler);
		};
	}, [fromDateInput]);

	const isDateValid = () => {
		const dateObj = new Date(fromDate);
		return !isNaN(dateObj.getTime());
	}
	const { data, isLoading, error } = useQuery<IViolationReport[], Error>({
		queryKey: ['violations', limit, projectID, fromDate],
		queryFn: () => getUrlsWithIssuesReport({ projectID: projectID, limit, from: fromDate }),
		enabled: !!projectID && isDateValid(),
	});

	if (isLoading) {
		return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;
	}

	if (error) {
		return <div className="text-center text-red-600 dark:text-red-400">Error loading scan result.</div>;
	}

	return (
		<div className="max-w-7/8 mx-auto my-8 p-4">
			<h1 className="text-3xl font-bold mb-2">
				{`Top ${limit} Violation`}
			</h1>
			<div>
				<div className="mb-4">
					<label htmlFor="limit-selector" className="block mb-2 text-gray-700 dark:text-gray-300">Limit</label>
					<select id="limit-selector" value={limit} onChange={(e) => setLimit(parseInt(e.target.value, 10))} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
					</select>
				</div>
				<div className="mb-4">
					<label htmlFor="from-date-picker" className="block mb-2 text-gray-700 dark:text-gray-300">From Date</label>
					<input
						id="from-date-picker"
						type="date"
						value={(() => {
							const [month, day, year] = fromDateInput.split("/");
							return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
						})()}
						onChange={e => {
							const [year, month, day] = e.target.value.split("-");
							setFromDateInput(`${month}/${day}/${year}`);
						}}
						className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 dark:[color-scheme:dark]"
					/>
				</div>
			</div>
			<div className="col-span-full">
				{data?.length === 0 && (
					<div className="text-center text-gray-600 dark:text-gray-300">No violations found for the selected date range.</div>
				)}
				{data?.map((violation) => (
					<div key={violation.url} className="mb-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
						<p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
							<span className="mr-2 text-gray-800 dark:text-gray-200">URL:</span> {violation.url}
						</p>
						<div className="mt-1">
							<span className="text-gray-600 dark:text-gray-300 text-sm mb-2">
								Occurs {violation.count} time(s).
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default ViolationURLReport;
