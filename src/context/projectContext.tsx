import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteProject, fetchProjects } from '../api/projects';
import { Project } from '../types';

type ProjectContextType = {
	projectID: string | undefined;
	setProjectID: (id: string | undefined) => void;
	availableProjects: Project[];
	isLoadingProjects: boolean;
	isRefetchingProjects: boolean;
	currentProject: Project | undefined;
	projectsError: Error | null;
	removeProject: (projectId: string) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
	const [projectID, setProjectID] = useState<string | undefined>(undefined);
	const queryClient = useQueryClient();

	const { data: availableProjects = [], isLoading: isLoadingProjects, isRefetching: isRefetchingProjects, error: projectsError } = useQuery<Project[], Error>({
		queryKey: ['projects'],
		queryFn: fetchProjects,
	});

	const { mutate: removeProject } = useMutation({
		mutationFn: deleteProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			toast.success('Project deleted successfully');
		},
		// Assuming deleteProject is defined in your API module
		onMutate: async (projectId: string) => {
			deleteProject(projectId);
		},
		onError: (error: any) => {
			toast.error(`Failed to delete project: ${error.message}`);
		},
	});

	const currentProject = availableProjects.find(project => project._id === projectID);

	const contextValue: ProjectContextType = useMemo(() => ({
		projectID,
		setProjectID,
		availableProjects,
		isLoadingProjects,
		isRefetchingProjects,
		currentProject,
		projectsError,
		removeProject,
	}), [projectID, availableProjects, isLoadingProjects, isRefetchingProjects, currentProject, projectsError, removeProject]);

	return (
		<ProjectContext.Provider value={contextValue}>
			{children}
		</ProjectContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectContext = () => {
	const context = useContext(ProjectContext);
	if (!context) {
		throw new Error('useProjectContext must be used within a ProjectProvider');
	}
	return context;
};