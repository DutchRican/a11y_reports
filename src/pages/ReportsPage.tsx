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
			<div className="border-b border-gray-300 mb-4"></div>
			<div className="flex space-x-2 mb-4">
				<button
					className={`px-4 py-2 rounded-t focus:outline-none ${tab === '1' ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-500'}`}
					onClick={() => setSearchParams({ tab: '1' })}
				>
					Top Violations
				</button>
				<button
					className={`px-4 py-2 rounded-t focus:outline-none ${tab === '2' ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-500'}`}
					onClick={() => setSearchParams({ tab: '2' })}
				>
					Violations by URL
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
