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
		<div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
			<h1 style={{ textAlign: "center", marginBottom: 24 }}>Select a Project</h1>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{availableProjects.map((project) => (
					<li
						key={project._id}
						onClick={() => setProjectID(project._id)}
						style={{
							padding: "12px 18px",
							marginBottom: 12,
							background: "#f5f5f5",
							borderRadius: 6,
							cursor: "pointer",
							transition: "background 0.2s",
						}}
						onMouseOver={e => (e.currentTarget.style.background = "#e0e7ff")}
						onMouseOut={e => (e.currentTarget.style.background = "#f5f5f5")}
					>
						{project.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ProjectSelectorPage;
