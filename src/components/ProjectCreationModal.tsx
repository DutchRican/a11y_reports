import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { createProject } from "../api/projects";

interface ProjectCreationModalProps {
	onClose: () => void;
}
export default function ProjectCreationModal({ onClose }: ProjectCreationModalProps) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		pageUrl: ""
	});
	const queryClient = useQueryClient();

	const { isPending, mutateAsync } = useMutation({
		mutationFn: createProject,

		onSuccess: () => {
			toast.success("Project created successfully");
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		}
	});
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append("name", formData.name);
		fd.append("description", formData.description);
		fd.append("pageUrl", formData.pageUrl);
		mutateAsync(fd);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
			<div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md">
				<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create Project</h2>
				<form onSubmit={handleSubmit} id="project-creation-form" data-testid="project-creation-form">
					<div className="mb-4">
						<label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Project Name
						</label>
						<input
							type="text"
							id="project-name"
							className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							required
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="project-page-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Page URL
						</label>
						<input
							type="text"
							id="project-page-url"
							className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							required
							value={formData.pageUrl}
							onChange={(e) => setFormData({ ...formData, pageUrl: e.target.value })}
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Optional Project Description
						</label>
						<textarea
							id="project-description"
							className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							rows={3}
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						/>
					</div>
					<div className="flex justify-end">
						<button
							type="button"
							disabled={isPending}
							className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-md"
							onClick={onClose}
						>
							Cancel
						</button>
						<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md" disabled={isPending}>
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
