import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useScanResultFilters() {
	const [searchParams, setSearchParams] = useSearchParams();
	const resultNameFilter = searchParams.get('testName') || '';
	const dateFilter = searchParams.get('date') || '';
	const [filtersOpen, setFiltersOpen] = useState(!!resultNameFilter || !!dateFilter);

	const handleFilterChange = useCallback((key: string, value: string) => {
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

	return {
		resultNameFilter,
		dateFilter,
		filtersOpen,
		setFiltersOpen,
		handleFilterChange,
		filters,
	};
}
