import { toast } from "react-toastify";
import { BASE_URL } from "../constants";

export const fetchScanResults = async (projectID?: string) => {
	if (!projectID) {
		throw new Error('No project selected');
	}
	const response = await fetch(`${BASE_URL}/scan-results/?projectId=${projectID}`);
	if (!response.ok) {
		const text = await response.json();
		throw new Error(text?.message || "Failed to fetch scan results");
	}
	return response.json();
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