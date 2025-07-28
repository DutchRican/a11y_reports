import { dateToLocalDateString } from "../../helpers/date";

export const getEarliestScanDate = () => {
	const earliestDate = localStorage.getItem('earliestScanDate');
	if (earliestDate) {
		return earliestDate;
	}
	// default to 21 days ago if no date is set
	const defaultDate = new Date();
	defaultDate.setDate(defaultDate.getDate() - 21);
	setEarliestScanDate(defaultDate);
	return dateToLocalDateString(defaultDate);
}

export const setEarliestScanDate = (date: Date) => {
	localStorage.setItem('earliestScanDate', dateToLocalDateString(date));
}
