import { toast } from "react-toastify";
import { BASE_URL } from "../constants";

export const fetchScanResults = async () => {
	const response = await fetch(`${BASE_URL}/scan-results`);
	if (!response.ok) {
		toast.error('Failed to fetch scan results');
	}
	return response.json();
};

export const fetchScanResultById = async (id: string) => {
	const response = await fetch(`${BASE_URL}/scan-results/${id}`);
	if (!response.ok) {
		toast.error('Failed to fetch scan result');
		return null;
	}
	return response.json();
};

export const uploadScanResults = async (formData: FormData) => {
	const response = await fetch(`${BASE_URL}/scan-results/upload`, {
		method: 'POST',
		body: formData,
	});
	if (!response.ok) {
		const text = await response.text();
		throw JSON.parse(text).message || 'Failed to upload scan results';
	}
	return await response.json();
};