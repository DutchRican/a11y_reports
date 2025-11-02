import { Link, useLocation } from 'react-router-dom';
import { useProjectContext } from '../../context/projectContext';
import './index.css';

interface NavigationProps {
  onUploadClick: () => void;
  onProjectCreationClick: () => void;
}

export default function Navigation({ onUploadClick, onProjectCreationClick }: NavigationProps) {
  const location = useLocation();
  const { projectID } = useProjectContext();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nav-container">
      <div className="flex space-x-4">
        <Link to="/" className={`nav-link-base ${isActive('/') ? 'nav-link-active' : 'nav-link-hover'}`}>
          Home
        </Link>
        {projectID ? (
          <>
            <Link to={`/project/${projectID}`} aria-disabled={!projectID} className={`nav-link-base ${isActive(`/project/${projectID}`) ? 'nav-link-active' : 'nav-link-hover'}`} viewTransition>
              Overview
            </Link>
            <Link to={`project/${projectID}/reports`} aria-disabled={!projectID} className={`nav-link-base ${isActive(`/project/${projectID}/reports`) ? 'nav-link-active' : 'nav-link-hover'}`}>
              Reports
            </Link>
          </>
        ) : (
          <span className={`nav-link-base text-gray-400`}>
            Overview
          </span>
        )}
        <Link to="/ada-info" className={`nav-link-base ${isActive('/ada-info') ? 'nav-link-active' : 'nav-link-hover'}`}>
          ADA Info
        </Link>
      </div>
      {isActive('/') && (
        <button
          onClick={onProjectCreationClick}
          className="action-button-nav"
        >Create Project</button>
      )}
      {projectID && !isActive('/') && (
        <button
          onClick={onUploadClick}
          className="action-button-nav"
        >
          Upload Scan
        </button>)}
    </nav>
  );
}
