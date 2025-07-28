export const formatDateMMDDYYYY = (date: Date): string => {
	return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export const dateToLocalDateString = (date: string | Date): string => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
}

export const beginningOfDay = (date: string | Date): number => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}
export const endOfDay = (date: string | Date): number => {
	const d = new Date(date);
	d.setHours(23, 59, 59, 999);
	return d.getTime();
}