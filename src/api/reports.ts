import { BASE_URL } from "../constants";
import { dateToLocalDateString } from "../helpers/date";

export const getResultWithIssuesReport = async ({ projectID, limit, impact }: { projectID?: string, limit: number | string, impact: string }) => {
	if (!projectID) {
		throw new Error('No project selected');
	}
	const response = await fetch(`${BASE_URL}/reports/results-with-issues?projectId=${projectID}&limit=${limit || 5}&impact=${impact || 'serious'}`)
	if (!response.ok) {
		const text = await response.text();
		throw JSON.parse(text).message || `Failed to get last ${limit} results with issues report`;
	}
	return response.json();
}

export const getUrlsWithIssuesReport = async ({ projectID, limit, from }: { projectID?: string, limit: number | string, from?: string }) => {
	if (!projectID) {
		throw new Error('No project selected');
	}
	const dayOffsetFetch = localStorage.getItem('earliestFetchDate');
	if (!from && dayOffsetFetch) {
		const days = parseInt(dayOffsetFetch, 10);
		if (!isNaN(days)) {
			const date = new Date();
			date.setDate(date.getDate() - days);
			from = dateToLocalDateString(date);
		}
	}
	const response = await fetch(`${BASE_URL}/reports/urls-with-issues?projectId=${projectID}&limit=${limit || 5}&from=${from}`)
	if (!response.ok) {
		const text = await response.text();
		throw JSON.parse(text).message || `Failed to get last ${limit} URLs with issues report`;
	}
	return response.json();
}