import { Link, useLocation } from 'react-router-dom';
import { useProjectContext } from '../context/projectContext';

interface NavigationProps {
  onUploadClick: () => void;
  onProjectCreationClick: () => void;
}

export default function Navigation({ onUploadClick, onProjectCreationClick }: NavigationProps) {
  const location = useLocation();
  const { projectID } = useProjectContext();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex space-x-4">
        <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
          Projects
        </Link>
        {projectID ? (
          <Link to={`/project/${projectID}`} aria-disabled={!projectID} className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(`/project/${projectID}`) ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
            Project
          </Link>
        ) : (
          <span className={`px-3 py-2 rounded-md text-sm font-medium text-gray-400`}>
            Project
          </span>
        )}
        <Link to="/ada-info" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/ada-info') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
          ADA Info
        </Link>
      </div>
      {isActive('/') && (
        <button
          onClick={onProjectCreationClick}
          className="ml-auto px-4 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >Create Project</button>
      )}
      {projectID && !isActive('/') && (
        <button
          onClick={onUploadClick}
          className="ml-auto px-4 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Upload Scan
        </button>)}
    </nav>
  );
}
