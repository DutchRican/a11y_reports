import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  onUploadClick: () => void;
}

export default function Navigation({ onUploadClick }: NavigationProps) {
  const location = useLocation();
  

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-indigo-900 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
          Home
        </Link>
        <Link to="/ada-info" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/ada-info') ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}>
          ADA Info
        </Link>
      </div>
      <button
        onClick={onUploadClick}
        className="ml-auto px-4 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Upload Scan
      </button>
    </nav>
  );
}
