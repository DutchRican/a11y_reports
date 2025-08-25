import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getResultWithIssuesReport } from "../../api/reports";
import { IViolationReport } from "../../types";
import ViolationReportDetail from "../violations/ViolationReportDetail";

const ViolationImpactReport = ({ projectID }: { projectID: string }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const limit = searchParams.get("limit") || "5";
	const tab = searchParams.get("tab") || "1";
	const impact = searchParams.get("impact") || "serious";
	const { data, isLoading, error } = useQuery<IViolationReport[], Error>({
		queryKey: ['violations', limit, projectID, impact],
		queryFn: () => getResultWithIssuesReport({ projectID: projectID, limit, impact }),
		enabled: !!projectID,
	});

	return (
		<div className="max-w-7/8 mx-auto my-8 p-4">
			<h1 className="text-3xl font-bold mb-2">
				{`Top ${limit} Violations`}
			</h1>
			<div className="shadow-sm dark:shadow-md p-4 rounded-b mb-4 bg-gray-50 dark:bg-gray-800">
				<div className="mb-4">
					<label htmlFor="limit-selector" className="block mb-2 text-gray-700 dark:text-gray-300">limit</label>
					<select id="limit-selector" value={limit} onChange={(e) => setSearchParams({ tab, limit: e.target.value, impact })} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
					</select>
				</div>
				<div className="mb-4">
					<label htmlFor="impact-selector" className="block mb-2 text-gray-700 dark:text-gray-300">limit</label>
					<select id="impact-selector" value={impact} onChange={(e) => setSearchParams({ tab, limit, impact: e.target.value })} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
						<option value="critical">Critical</option>
						<option value="serious">Serious</option>
						<option value="moderate">Moderate</option>
						<option value="minor">Minor</option>
					</select>
				</div>
			</div>
			{data?.length === 0 && (
				<div className="text-center text-gray-600 dark:text-gray-300">No violations found. Does this project have scan results?</div>
			)}
			{isLoading && (
				<div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
			)}

			{error && (
				<div className="text-center text-red-600 dark:text-red-400">Error loading violations.</div>
			)}
			<div className="col-span-full">
				{data?.map((violation) => (
					<ViolationReportDetail key={violation.help} report={violation} />
				))}
			</div>
		</div>
	);
}

export default ViolationImpactReport;
