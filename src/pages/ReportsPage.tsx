import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getResultWithIssuesReport } from "../api/reports";
import ViolationReportDetail from "../components/violations/ViolationReportDetail";
import { useProjectContext } from "../context/projectContext";
import { ViolationReport } from "../types";
import { useProjectIdFromUrl } from "./OverviewPage/hooks/useProjectIdFromUrl";

const ReportsPage: React.FC = () => {
	const urlId = useProjectIdFromUrl();
	const { projectID, setProjectID } = useProjectContext();
	const projectIDToUse = projectID || urlId;
	const [limit, setLimit] = useState(5);
	const [impact, setImpact] = useState('serious');
	const { data, isLoading, error } = useQuery<ViolationReport[], Error>({
		queryKey: ['violations', limit, projectIDToUse, impact],
		queryFn: () => getResultWithIssuesReport({ projectID: projectIDToUse!, limit, impact }),
		enabled: !!projectIDToUse,
	});

	useEffect(() => {
		if (urlId && !projectID) {
			setProjectID(urlId);
		}
	}, [projectID, setProjectID, urlId]);

	if (isLoading) {
		return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;
	}

	if (error) {
		return <div className="text-center text-red-600 dark:text-red-400">Error loading scan result.</div>;
	}

	if (!data) {
		return <div className="text-center text-gray-600 dark:text-gray-300">No result found.</div>;
	}
	return (
		<div className="max-w-7/8 mx-auto my-8 p-4">
			<h1 className="text-3xl font-bold mb-2">
				{`Top ${limit} Violation`}
			</h1>
			<div>
				<div className="mb-4">
					<label htmlFor="limit-selector" className="block mb-2 text-gray-700 dark:text-gray-300">limit</label>
					<select id="limit-selector" value={limit} onChange={(e) => setLimit(parseInt(e.target.value, 10))} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
					</select>
				</div>
				<div className="mb-4">
					<label htmlFor="impact-selector" className="block mb-2 text-gray-700 dark:text-gray-300">limit</label>
					<select id="impact-selector" value={impact} onChange={(e) => setImpact(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
						<option value="critical">Critical</option>
						<option value="serious">Serious</option>
						<option value="moderate">Moderate</option>
						<option value="minor">Minor</option>
					</select>
				</div>
			</div>
			<div className="col-span-full">
				{data?.map((violation) => (
					<ViolationReportDetail key={violation.help} report={violation} />
				))}
			</div>
		</div>
	);
}

export default ReportsPage;
