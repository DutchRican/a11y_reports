const defaultDays = 21;

export const getEarliestScanDate = () => {
	const dayCount = localStorage.getItem('earliestFetchDate');
	const parsedCount = parseInt(dayCount!, 10);
	if (!isNaN(parsedCount)) {
		return parsedCount;
	}
	localStorage.setItem('earliestFetchDate', defaultDays.toString());
	return defaultDays;
}


