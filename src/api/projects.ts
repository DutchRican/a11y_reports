import { toast } from "react-toastify";
import { BASE_URL } from "../constants";

export const fetchProjects = async () => {
	const response = await fetch(`${BASE_URL}/projects`);
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
		toast.error(text?.message || "Failed to create project");
	}
	return response.json();
};