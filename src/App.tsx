import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LayOut from './components/LayOut';
import { ProjectProvider } from './context/projectContext';
import { SettingsProvider } from './context/settingsContext';
import ADAInfoPage from './pages/ADAInfoPage';
import DetailViewPage from './pages/DetailViewPage';
import OverviewPage from './pages/OverviewPage/OverviewPage';
import ProjectSelectorPage from './pages/ProjectSelectorPage';
import ReportsPage from './pages/ReportsPage';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const router = createBrowserRouter([
  {
    element: <LayOut />,
    children:
      [
        {
          path: '/',
          element: <ProjectSelectorPage />,
        },
        {
          path: '/project/:id',
          element: <OverviewPage />
        },
        {
          path: "/detailview/:projectID/:id",
          element: <DetailViewPage />
        },
        {
          path: "/project/:id/reports",
          element: <ReportsPage />
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
