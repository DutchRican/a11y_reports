import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProjects } from '../api/projects';
import { Project } from '../types';

type ProjectContextType = {
	projectID: string | null;
	setProjectID: (id: string | null) => void;
	availableProjects: Project[];
	isLoadingProjects: boolean;
	isRefetchingProjects: boolean;
	currentProject: Project | undefined;
	projectsError: Error | null;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
	const [projectID, setProjectID] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	// useEffect(() => {
	// 	if (projectID) {
	// 		localStorage.setItem('selectedProjectID', projectID);
	// 		if (!location.pathname.includes(`/project/${projectID}`)) {
	// 			navigate(`/project/${projectID}`);
	// 		}
	// 	}
	// }, [projectID]);

	const { data: availableProjects = [], isLoading: isLoadingProjects, isRefetching: isRefetchingProjects, error: projectsError } = useQuery<Project[], Error>({
		queryKey: ['projects'],
		queryFn: fetchProjects,
	});

	const currentProject = availableProjects.find(project => project._id === projectID);

	return (
		<ProjectContext.Provider value={{ projectID, setProjectID, availableProjects, isLoadingProjects, isRefetchingProjects, currentProject, projectsError }}>
			{children}
		</ProjectContext.Provider>
	);
};

export const useProjectContext = () => {
	const context = useContext(ProjectContext);
	if (!context) {
		throw new Error('useProjectContext must be used within a ProjectProvider');
	}
	return context;
};