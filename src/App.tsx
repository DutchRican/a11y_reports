import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from './components/Navigation';
import UploadScanModal from './components/UploadScanModal';
import ADAInfoPage from './pages/ADAInfoPage';
import DetailViewPage from './pages/DetailViewPage';
import OverviewPage from './pages/OverviewPage';

function AppContent() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  return (
    <>
      <ToastContainer />
      <Navigation onUploadClick={() => setUploadModalOpen(true)} />
      <div className="h-16" />
      <main className="container mx-auto mt-2" role="main">
        <Routes>
          <Route path="/" element={
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
    </>
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
