import { toast } from "react-toastify";
import { BASE_URL } from "../constants";
import { dateToLocalDateString } from "../helpers/date";
import { ScanResult } from "../types";

export const fetchScanResults = async (projectID?: string, from?: string, to?: string) => {
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
	// build the search parameters
	const params = new URLSearchParams({ projectId: projectID });
	if (from) {
		params.append('from', from);
	}
	if (to) {
		params.append('to', to);
	}

	const response = await fetch(`${BASE_URL}/scan-results/?${params.toString()}`);
	if (!response.ok) {
		const text = await response.json();
		throw new Error(text?.message || "Failed to fetch scan results");
	}
	const shortDateMap = (await response.json()).map((result: ScanResult) => ({
		...result,
		created: dateToLocalDateString(result.created),
	}))
	return shortDateMap;
};

export const fetchScanResultById = async (id: string, projectID?: string) => {
	if (!projectID) {
		throw new Error('No project selected');
	}
	const response = await fetch(`${BASE_URL}/scan-results/${id}?projectId=${projectID}`);
	if (!response.ok) {
		toast.error('Failed to fetch scan result');
		return null;
	}
	return response.json();
};

export const uploadScanResults = async (formData: FormData, projectID?: string) => {
	if (!projectID) {
		throw new Error('No project selected');
	}
	const response = await fetch(`${BASE_URL}/scan-results/upload?projectId=${projectID}`, {
		method: 'POST',
		body: formData,
	});
	if (!response.ok) {
		const text = await response.text();
		throw JSON.parse(text).message || 'Failed to upload scan results';
	}
	return await response.json();
};