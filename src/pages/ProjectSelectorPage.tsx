import { useProjectContext } from "../context/projectContext";

const ProjectSelectorPage: React.FC = () => {
	const { availableProjects, isLoadingProjects, setProjectID } = useProjectContext();

	if (isLoadingProjects) {
		return <div>Loading projects...</div>;
	}

	if (availableProjects.length === 0) {
		return <div>You don't have any projects available, let's create one first.</div>;
	}
	return (
		<div>
			<h1>Select a Project</h1>
			<ul>
				{availableProjects.map((project) => (
					<li key={project.id} onClick={() => setProjectID(project.id)}>{project.name}</li>
				))}
			</ul>
		</div>
	);
};

export default ProjectSelectorPage;
