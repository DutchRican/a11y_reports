import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DateFilter } from '../pages/OverviewPage/types';

export function useScanResultFilters() {
	const [searchParams, setSearchParams] = useSearchParams();
	const resultNameFilter = searchParams.get('testName') || '';
	const dateFilter = useMemo<DateFilter>(() => {
		const dateParam = searchParams.get('date');
		if (!dateParam) return { from: undefined, to: undefined };
		try {
			return JSON.parse(dateParam);
		} catch (e) {
			console.error('Failed to parse date filter from URL', e);
			return { from: undefined, to: undefined };
		}
	}, [searchParams]);

	const [filtersOpen, setFiltersOpen] = useState(!!resultNameFilter || !!dateFilter.from);

	const handleFilterChange = useCallback((key: string, value: string | object) => {
		setSearchParams(prev => {
			const newParams = new URLSearchParams(prev);
			if (value) {
				newParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
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
		filters,
		setFiltersOpen,
		handleFilterChange,
	};
}
