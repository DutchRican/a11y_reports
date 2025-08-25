import { useEffect } from "react";
import ViolationImpactReport from "../components/reports/ViolationImpactReport";
import ViolationURLReport from "../components/reports/ViolationsURLReport";
import { useProjectContext } from "../context/projectContext";
import { useProjectIdFromUrl } from "./OverviewPage/hooks/useProjectIdFromUrl";

import { useSearchParams } from "react-router-dom";

const ReportsPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const urlId = useProjectIdFromUrl();
	const { projectID, setProjectID } = useProjectContext();
	const projectIDToUse = projectID || urlId;
	const tab = searchParams.get("tab") || "1";

	useEffect(() => {
		if (urlId && !projectID) {
			setProjectID(urlId);
		}
	}, [projectID, setProjectID, urlId]);

	if (!projectIDToUse) { return null; }
	return (
		<div>
			<div className="flex space-x-2 border-b border-gray-300 mb-4">
				<button
					className={`px-4 py-2 rounded-t font-semibold transition-colors duration-200 focus:outline-none border-b-2
						${tab === '1'
							? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400 shadow'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent'}
					`}
					onClick={() => setSearchParams({ tab: '1' })}
				>
					Violations by Count
				</button>
				<button
					className={`px-4 py-2 rounded-t font-semibold transition-colors duration-200 focus:outline-none border-b-2
						${tab === '2'
							? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400 shadow'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent'}
					`}
					onClick={() => setSearchParams({ tab: '2' })}
				>
					URLs with most Violations
				</button>
			</div>
			<div>
				{tab === '1' ? (
					<ViolationImpactReport projectID={projectIDToUse} />
				) : (
					<ViolationURLReport projectID={projectIDToUse} />
				)}
			</div>
		</div>
	)
}

export default ReportsPage;
