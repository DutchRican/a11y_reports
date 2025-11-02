import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navigation from "./Navigation";
import ProjectCreationModal from "./ProjectCreationModal";
import SettingsTrigger from "./SettingsTrigger";
import UploadScanModal from "./UploadScanModal";

function LayOut() {
	const [uploadModalOpen, setUploadModalOpen] = useState(false);
	const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
	return (
		<>
			<ToastContainer />
			<Navigation
				onUploadClick={
					() => setUploadModalOpen(true)
				}
				onProjectCreationClick={
					() => setCreateProjectModalOpen(true)
				} />
			<div className="h-16" />
			<main className="container mx-auto mt-2" role="main">
				<Outlet />
			</main>
			<UploadScanModal
				open={uploadModalOpen}
				onClose={() => setUploadModalOpen(false)}
			/>
			{
				createProjectModalOpen && <ProjectCreationModal
					onClose={() => setCreateProjectModalOpen(false)}
				/>
			}
			<SettingsTrigger />
		</>
	);
}

export default LayOut;
