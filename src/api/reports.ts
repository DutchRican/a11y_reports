import { BASE_URL } from "../constants";

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