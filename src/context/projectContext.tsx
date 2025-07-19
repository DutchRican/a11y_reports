import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import { fetchProjects } from '../api/projects';
import { Project } from '../types';

type ProjectContextType = {
	projectID: string | null;
	setProjectID: (id: string) => void;
	availableProjects: Project[];
	isLoadingProjects: boolean;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
	const [projectID, setProjectID] = useState<string | null>(null);

	const { data: availableProjects = [], isLoading: isLoadingProjects } = useQuery<Project[], Error>({
		queryKey: ['projects'],
		queryFn: fetchProjects,
	});

	return (
		<ProjectContext.Provider value={{ projectID, setProjectID, availableProjects, isLoadingProjects }}>
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