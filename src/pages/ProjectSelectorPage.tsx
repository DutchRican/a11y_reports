import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCreationModal from "../components/ProjectCreationModal";
import { useProjectContext } from "../context/projectContext";
import { useSettings } from "../context/settingsContext";
import { dateToLocalDateString } from "../helpers/date";
import { useClickOutside } from "../hooks/useClickOutside";

const ProjectSelectorPage: React.FC = () => {
	const { availableProjects, isLoadingProjects, setProjectID, projectID, isRefetchingProjects, removeProject, softDeleteProject } = useProjectContext();
	const navigate = useNavigate();
	const isBusy = isLoadingProjects || isRefetchingProjects;
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const { password, isAdminMode } = useSettings();
	const [updateProjectModal, setUpdateProjectModal] = useState(false);
	const [selectedProject, setSelectedProject] = useState<string | null>(null);

	const handleProjectSelect = (projectId: string) => {
		if (!projectID || projectID !== projectId) {
			setProjectID(projectId);
		}
		navigate(`/project/${projectId}`);
	};

	const handleMenuToggle = (projectId: string) => {
		setOpenMenuId((prev) => (prev === projectId ? null : projectId));
	};

	const handleDeleteProject = (projectId: string, isArchive: boolean = false) => {
		if (isArchive) softDeleteProject({ projectId })
		else removeProject({ projectId, password });
		handleMenuToggle(projectId);
	};

	const handleUpdateProject = (projectId: string) => {
		setSelectedProject(projectId);
		setUpdateProjectModal(true);
	};

	const menuRef = useClickOutside(() => setOpenMenuId(null));
	return (
		<div className="max-w-7/8 mx-auto mt-10 p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow">
			{isAdminMode && <p className="text-red-500">Admin Mode</p>}
			<h1 className="text-center text-2xl font-semibold mb-6">Select a Project</h1>
			<ul className="list-none p-0">
				{isBusy && (
					<li className="p-3 mb-3 bg-gray-100 dark:bg-gray-700 rounded">Loading projects...</li>
				)}
				{availableProjects.length === 0 && !isBusy && (
					<li className="p-3 mb-3 bg-gray-100 dark:bg-gray-700 rounded">
						No projects available. Please create a project first.
					</li>
				)}
				{!isBusy && availableProjects.map((project) => (
					<li
						key={project._id}
						className={`p-3 mb-3 rounded cursor-pointer transition-colors dark:bg-gray-700 dark:text-white flex items-center justify-between ${projectID === project._id ? 'bg-indigo-50 hover:bg-indigo-100 dark:hover:bg-indigo-900' : 'bg-gray-100 hover:bg-indigo-100 dark:hover:bg-gray-600'}`}
					>
						<div className="flex-1 flex flex-col" onClick={() => handleProjectSelect(project._id)}>
							{/* project name and description on the left */}
							<div className="flex">
								<p className="project-info-value flex-2">
									<span className="project-info-title">Project:</span>{project.name}</p>
								<p
									className="project-info-value overflow-hidden truncate flex-3"
									title={project.description ? project.description : undefined}
								><span className="project-info-title">Description:</span>
									{project.description || "No description available"}
								</p>
							</div>
							<div className="flex  mt-1">
								<p className="project-info-value flex-2"><span className="project-info-title">URL:</span>{project.pageUrl}</p>
								<p className="project-info-value flex-3 overflow-hidden truncate"><span className="project-info-title">Created Date:</span>{dateToLocalDateString(project.createdAt)}</p>
							</div>
						</div>
						<div className="relative" data-test-id={`hover-menu-${project._id}`}>
							<button
								className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
								aria-label="Project actions"
								aria-haspopup="true"
								onClick={() => handleMenuToggle(project._id)}
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
									<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
								</svg>
							</button>
							{openMenuId === project._id && (
								<div
									ref={menuRef}
									className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 transition-opacity duration-200"
									data-test-id={`hover-menu-options-${project._id}`}
								>
									<button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleUpdateProject(project._id)}>Update</button>
									<button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleDeleteProject(project._id, true)}>Archive</button>
									{isAdminMode && <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleDeleteProject(project._id)}>Delete</button>}
								</div>
							)}
						</div>
					</li>
				))}
			</ul>
			{updateProjectModal && (
				<ProjectCreationModal
					onClose={() => { setUpdateProjectModal(false); setSelectedProject(null); }}
					projectToUpdate={selectedProject ? availableProjects.find(p => p._id === selectedProject) : null}
				/>
			)}
		</div>
	);
};

export default ProjectSelectorPage;
