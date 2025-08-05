import { toast } from "react-toastify";
import { BASE_URL } from "../constants";

export const fetchProjects = async (isAdminMode: boolean) => {
	const url = new URL(`${BASE_URL}/projects`);
	url.searchParams.append('includeArchived', isAdminMode.toString())
	const response = await fetch(url);
	if (!response.ok) {
		toast.error("Failed to fetch projects");
	}
	return response.json();
};

export const createProject = async (formData: FormData) => {
	const response = await fetch(`${BASE_URL}/projects`, {
		method: "POST",
		body: formData,
	});
	if (!response.ok) {
		const text = await response.json();
		throw new Error(text?.message || "Failed to create project");
	}
	return response.json();
};

export const updateProject = async (formData: FormData, projectId: string) => {
	const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
		method: "PUT",
		body: formData,
	});
	if (!response.ok) {
		const text = await response.json();
		throw new Error(text?.message || "Failed to update project");
	}
	return response.json();
};

export const deleteProject = async (projectId: string, password: string) => {
	const response = await fetch(`${BASE_URL}/projects/${projectId}/hard-delete`, {
		method: "DELETE",
		headers: {
			"Authorization": password
		}
	});
	if (!response.ok) {
		const text = await response.json();
		throw new Error(text?.message || "Failed to delete project");
	}
	return response.json();
}

export const archiveProject = async (projectId: string) => {
	const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
		method: "DELETE"
	});
	if (!response.ok) {
		const text = await response.json();
		throw new Error(text?.message || "Failed to archive project");
	}
	return response.json();
}

export const restoreProject = async (projectId: string, password: string) => {
	const response = await fetch(`${BASE_URL}/projects/${projectId}/restore`, {
		headers: {
			"Authorization": password
		}
	}
	);
	if (!response.ok) {
		const text = await response.json();
		throw new Error(text?.message || "Failed to restore the project");
	}
	return response.json();
}