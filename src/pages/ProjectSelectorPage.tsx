import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../context/projectContext";

const ProjectSelectorPage: React.FC = () => {
	const { availableProjects, isLoadingProjects, setProjectID, projectID, isRefetchingProjects } = useProjectContext();
	const navigate = useNavigate();
	const isBusy = isLoadingProjects || isRefetchingProjects;

	const handleProjectSelect = (projectId: string) => {
		if (!projectID || projectID !== projectId) {
			setProjectID(projectId);
		} else {
			navigate(`/project/${projectId}`);
		}
	};
	return (
		<div className="max-w-7/8 mx-auto mt-10 p-6 bg-white rounded-lg shadow">
			<h1 className="text-center text-2xl font-semibold mb-6">Select a Project</h1>
			<ul className="list-none p-0">
				{isBusy && (
					<li className="p-3 mb-3 bg-gray-100 rounded">Loading projects...</li>
				)}
				{availableProjects.length === 0 && !isBusy && (
					<li className="p-3 mb-3 bg-gray-100 rounded">
						No projects available. Please create a project first.
					</li>
				)}
				{!isBusy && availableProjects.map((project) => (
					<li
						key={project._id}
						onClick={() => handleProjectSelect(project._id)}
						className="p-3 mb-3 bg-gray-100 rounded cursor-pointer transition-colors hover:bg-indigo-100 flex "
					>
						<p className="font-semibold flex-1 ml-2">{project.name}</p>
						<p
							className="text-gray-500 ml-6 overflow-hidden truncate flex-3"
							title={project.description ? project.description : undefined}
						>
							{project.description || "No description available"}
						</p>

					</li>
				))}
			</ul>
		</div>
	);
};

export default ProjectSelectorPage;
