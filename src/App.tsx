import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { ProjectProvider } from './context/projectContext';
import { SettingsProvider } from './context/settingsContext';
import ADAInfoPage from './pages/ADAInfoPage';
const LayOut = lazy(() => import('./components/LayOut'));
const DetailViewPage = lazy(() => import('./pages/DetailViewPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const OverviewPage = lazy(() => import('./pages/OverviewPage/OverviewPage'));
const ProjectSelectorPage = lazy(() => import('./pages/ProjectSelectorPage'));

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const router = createBrowserRouter([
  {
    element: <Suspense fallback={<LoadingSpinner />}><LayOut /></Suspense>,
    children:
      [
        {
          path: '/',
          element: <Suspense fallback={<LoadingSpinner />}><ProjectSelectorPage /></Suspense>,
        },
        {
          path: '/project/:id',
          element: <OverviewPage />
        },
        {
          path: "/detailview/:projectID/:id",
          element: <Suspense fallback={<LoadingSpinner />}><DetailViewPage /></Suspense>
        },
        {
          path: "/project/:id/reports",
          element: <Suspense fallback={<LoadingSpinner />}><ReportsPage /></Suspense>
        },
        {
          path: "/ada-info",
          element: <ADAInfoPage />
        }

      ]
  }]);

function App() {

  return (
    <SettingsProvider>
      <ProjectProvider>
        <RouterProvider router={router} />
      </ProjectProvider>
    </SettingsProvider>
  );
}


export default App;
