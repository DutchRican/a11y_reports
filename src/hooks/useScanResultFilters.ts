import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScanResult } from '../types';

export function useScanResultFilters(scanResults: ScanResult[]) {
	const [searchParams, setSearchParams] = useSearchParams();
	const testNameFilter = searchParams.get('testName') || '';
	const dateFilter = searchParams.get('date') || '';
	const [filtersOpen, setFiltersOpen] = useState(!!testNameFilter || !!dateFilter);

	const handleFilterChange = (key: string, value: string) => {
		setSearchParams(prev => {
			const newParams = new URLSearchParams(prev);
			if (value) {
				newParams.set(key, value);
			} else {
				newParams.delete(key);
			}
			return newParams;
		});
	};

	const filters = useMemo(() => [
		{ name: 'testName', val: testNameFilter },
		{ name: 'date', val: dateFilter }
	].filter(({ val }) => Boolean(val)), [testNameFilter, dateFilter]);

	const testDates = useMemo(() => Array.from(
		new Set(scanResults?.map(result => new Date(result.created).toLocaleDateString()))
	).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()), [scanResults]);

	const filteredResults = useMemo(() => scanResults.filter((result) => {
		const testNameMatch = result.testName.toLowerCase().includes(testNameFilter.toLowerCase());
		const dateMatch = () => new Date(result.created).toLocaleDateString().includes(dateFilter);
		return testNameMatch && dateMatch();
	}), [scanResults, testNameFilter, dateFilter]);

	return {
		testNameFilter,
		dateFilter,
		filtersOpen,
		setFiltersOpen,
		handleFilterChange,
		filters,
		testDates,
		filteredResults,
	};
}
