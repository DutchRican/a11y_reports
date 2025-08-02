import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from './components/Navigation';
import ProjectCreationModal from './components/ProjectCreationModal';
import UploadScanModal from './components/UploadScanModal';
import { ProjectProvider } from './context/projectContext';
import { SettingsProvider } from './context/settingsContext';
import ADAInfoPage from './pages/ADAInfoPage';
import DetailViewPage from './pages/DetailViewPage';
import OverviewPage from './pages/OverviewPage';
import ProjectSelectorPage from './pages/ProjectSelectorPage';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function AppContent() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  return (
    <SettingsProvider>
      <ProjectProvider>
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
          <Routes>
            <Route path="/" element={<ProjectSelectorPage />} />
            <Route path="/project/:id" element={
              <OverviewPage />
            } />
            <Route path="/detailview/:id" element={<DetailViewPage />} />
            <Route path="/ada-info" element={<ADAInfoPage />} />
          </Routes>
        </main>
        <UploadScanModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
        {createProjectModalOpen && <ProjectCreationModal
          onClose={() => setCreateProjectModalOpen(false)}
        />}
      </ProjectProvider>
    </SettingsProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
