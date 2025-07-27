import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { beginningOfDay, dateToLocalDateString, endOfDay } from '../helpers/date';
import { ScanResult } from '../types';

export function useScanResultFilters(scanResults: ScanResult[]) {
	const [searchParams, setSearchParams] = useSearchParams();
	const resultNameFilter = searchParams.get('testName') || '';
	const dateFilter = searchParams.get('date') || '';
	const [filtersOpen, setFiltersOpen] = useState(!!resultNameFilter || !!dateFilter);

	const handleFilterChange = useCallback((key: string, value: string) => {
		console.log(`Filter changed: ${key} = ${value}`);
		setSearchParams(prev => {
			const newParams = new URLSearchParams(prev);
			if (key === 'date') {
				// Ensure date is in the format 'start,end'
				const [start, end] = value.split(' - ');
				if (start && end) {
					if (start === end) {
						value = start; // If both are the same, just use one date
					}
				}
			}
			if (value) {
				newParams.set(key, value);
			} else {
				newParams.delete(key);
			}
			return newParams;
		});
	}, [setSearchParams]);

	const filters = useMemo(() => [
		{ name: 'testName', val: resultNameFilter },
		{ name: 'date', val: dateFilter }
	].filter(({ val }) => Boolean(val)), [resultNameFilter, dateFilter]);

	const filteredResults = useMemo(() => {
		if (!scanResults) return [];
		return scanResults.filter((result) => {
			const resultNameMatch = result.testName.toLowerCase().includes(resultNameFilter.toLowerCase());
			let dateMatch = true;
			if (dateFilter) {
				// Support 'start,end' or single date
				const [start, end] = dateFilter.split(' - ');
				const createdDate = dateToLocalDateString(result.created);
				console.log(createdDate, start, end);
				if (start && end) {
					// Range filter
					const created = new Date(result.created).getTime();
					const startTime = beginningOfDay(start);
					// Set endTime to end of day
					const endTime = endOfDay(end);
					dateMatch = created >= startTime && created <= endTime;
				} else {
					// Single date
					dateMatch = createdDate === start;
				}
			}
			return resultNameMatch && dateMatch;
		});
	}, [scanResults, resultNameFilter, dateFilter]);

	return {
		resultNameFilter,
		dateFilter,
		filtersOpen,
		setFiltersOpen,
		handleFilterChange,
		filters,
		filteredResults,
	};
}
