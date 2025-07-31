import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../context/projectContext";

const ProjectSelectorPage: React.FC = () => {
	const { availableProjects, isLoadingProjects, setProjectID, projectID, isRefetchingProjects } = useProjectContext();
	const navigate = useNavigate();
	const isBusy = isLoadingProjects || isRefetchingProjects;

	const handleProjectSelect = (projectId: string) => {
		if (!projectID || projectID !== projectId) {
			setProjectID(projectId);
		}
		navigate(`/project/${projectId}`);

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
						className={`p-3 mb-3 rounded cursor-pointer transition-colors flex items-center justify-between ${projectID === project._id ? 'bg-indigo-50 hover:bg-indigo-100' : 'bg-gray-100 hover:bg-indigo-100'
							}`}
					>
						<div className="flex-1 flex items-center" onClick={() => handleProjectSelect(project._id)}>
							<p className="font-semibold ml-2">{project.name}</p>
							<p
								className="text-gray-500 ml-6 overflow-hidden truncate"
								title={project.description ? project.description : undefined}
							>
								{project.description || "No description available"}
							</p>
						</div>
						<div className="relative group" data-test-id={`hover-menu-${project._id}`}>
							<button
								className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
								aria-label="Project actions"
								aria-haspopup="true"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
									<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
								</svg>
							</button>
							<div
								className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-200"
								data-test-id={`hover-menu-options-${project._id}`}
							>
								<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Update</a>
								<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</a>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ProjectSelectorPage;
