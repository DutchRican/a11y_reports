import { useProjectContext } from "../context/projectContext";

const ProjectSelectorPage: React.FC = () => {
	const { availableProjects, isLoadingProjects, setProjectID, isRefetchingProjects } = useProjectContext();
	const isBusy = isLoadingProjects || isRefetchingProjects;
	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
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
						onClick={() => setProjectID(project._id)}
						className="p-3 mb-3 bg-gray-100 rounded cursor-pointer transition-colors hover:bg-indigo-100"
					>
						{project.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ProjectSelectorPage;
