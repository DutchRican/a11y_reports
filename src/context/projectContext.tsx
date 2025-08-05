import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { archiveProject, deleteProject, fetchProjects, restoreProject as unarchiveProject } from '../api/projects';
import { Project } from '../types';
import { useSettings } from './settingsContext';

type ProjectContextType = {
	projectID: string | undefined;
	setProjectID: (id: string | undefined) => void;
	availableProjects: Project[];
	isLoadingProjects: boolean;
	isRefetchingProjects: boolean;
	currentProject: Project | undefined;
	projectsError: Error | null;
	removeProject: ({ projectId, password }: { projectId: string; password: string }) => void;
	softDeleteProject: ({ projectId }: { projectId: string }) => void;
	restoreProject: ({ projectId, password }: { projectId: string, password: string }) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
	const [projectID, setProjectID] = useState<string | undefined>(undefined);
	const queryClient = useQueryClient();
	const { isAdminMode } = useSettings();

	const { data: availableProjects = [], isLoading: isLoadingProjects, isRefetching: isRefetchingProjects, error: projectsError } = useQuery<Project[], Error>({
		queryKey: ['projects', isAdminMode],
		queryFn: () => fetchProjects(isAdminMode),
	});

	const { mutate: removeProject } = useMutation({
		mutationFn: ({ projectId, password }: { projectId: string, password: string }) => deleteProject(projectId, password),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			toast.success('Project deleted successfully');
		},
		onError: (error: any) => {
			toast.error(`Failed to delete project: ${error.message}`);
		},
	});

	const { mutate: softDeleteProject } = useMutation({
		mutationFn: ({ projectId }: { projectId: string }) => archiveProject(projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			toast.success(`Project archived succesfully`);
		},
		onError: (error: any) => {
			toast.error(`Failed to archive project: ${error.message}`);
		}
	});

	const { mutate: restoreProject } = useMutation({
		mutationFn: ({ projectId, password }: { projectId: string, password: string }) => unarchiveProject(projectId, password),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			toast.success(`Project restored succesfully`);
		},
		onError: (error: any) => {
			toast.error(`Failed to restore project: ${error.message}`);
		}
	})


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
		softDeleteProject,
		restoreProject
	}), [projectID, availableProjects, isLoadingProjects, isRefetchingProjects, currentProject, projectsError, removeProject, softDeleteProject, restoreProject]);

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