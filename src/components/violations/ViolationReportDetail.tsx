import { impactColors } from ".";
import { IViolationReport } from "../../types";

interface ViolationReportProps {
	report: IViolationReport;
}

const ViolationReportDetail: React.FC<ViolationReportProps> = ({ report }) => {
	return (
		<div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
			<p className={`text-lg font-semibold ${impactColors[report.impact]} mb-2`}>
				Impact: {report.impact}
			</p>
			<p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
				<span className="mr-2 text-gray-800 dark:text-gray-200">Identified violation:</span> {report.help}
			</p>
			<p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
				<span className="mr-2 text-gray-800 dark:text-gray-200">Example URL:</span> {report.url}
			</p>
			<div className="mt-1">
				<span className="text-gray-600 dark:text-gray-300 text-sm mb-2">
					Occurs {report.count} time(s). The provided URL is just one representation of this violation
				</span>
			</div>
		</div>
	)
}

export default ViolationReportDetail;
