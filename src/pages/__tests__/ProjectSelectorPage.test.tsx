// import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { SettingsProvider } from '../../context/settingsContext';
import ProjectSelectorPage from '../ProjectSelectorPage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));

// Helper to mock useProjectContext
const mockSetProjectID = jest.fn();
let mockContextValue: any = {};
jest.mock('../../context/projectContext', () => ({
	useProjectContext: () => mockContextValue,
	useSettings: () => { },
}));

const Wrapper = () => (
	<SettingsProvider>
		<ProjectSelectorPage />
	</SettingsProvider>
);

describe('ProjectSelectorPage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockContextValue = {};
	});

	it('shows loading state', () => {
		mockContextValue = {
			availableProjects: [],
			isLoadingProjects: true,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		render(<Wrapper />);
		expect(screen.getByText(/Loading projects/i)).toBeInTheDocument();
	});

	it('shows no projects message', () => {
		mockContextValue = {
			availableProjects: [],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		render(<Wrapper />);
		expect(screen.getByText(/No projects available/i)).toBeInTheDocument();
	});

	it('shows available projects', () => {
		mockContextValue = {
			availableProjects: [
				{ _id: '1', name: 'Project One', description: 'Desc One' },
				{ _id: '2', name: 'Project Two', description: '' },
			],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		render(<Wrapper />);
		expect(screen.getByText('Project One')).toBeInTheDocument();
		expect(screen.getByText('Project Two')).toBeInTheDocument();
		expect(screen.getByText('Desc One')).toBeInTheDocument();
		expect(screen.getByText('No description available')).toBeInTheDocument();
	});

	it('calls setProjectID when selecting a new project', () => {
		mockContextValue = {
			availableProjects: [{ _id: '1', name: 'Project One', description: '' }],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		render(<Wrapper />);
		fireEvent.click(screen.getByText('Project One'));
		expect(mockSetProjectID).toHaveBeenCalledWith('1');
		expect(mockNavigate).toHaveBeenCalledWith('/project/1');
	});

	it('navigates when selecting the same project', () => {
		mockContextValue = {
			availableProjects: [{ _id: '1', name: 'Project One', description: '' }],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: '1',
		};
		render(<Wrapper />);
		fireEvent.click(screen.getByText('Project One'));
		expect(mockSetProjectID).not.toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith('/project/1');
	});

	it('renders the page title', () => {
		mockContextValue = {
			availableProjects: [],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		render(<Wrapper />);
		expect(screen.getByText('Select a Project')).toBeInTheDocument();
	});

	it('handles clicking multiple projects', () => {
		mockContextValue = {
			availableProjects: [
				{ _id: '1', name: 'Project One', description: 'Desc One' },
				{ _id: '2', name: 'Project Two', description: 'Desc Two' },
			],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		render(<Wrapper />);
		fireEvent.click(screen.getByText('Project One'));
		expect(mockSetProjectID).toHaveBeenCalledWith('1');
		fireEvent.click(screen.getByText('Project Two'));
		expect(mockSetProjectID).toHaveBeenCalledWith('2');
	});

	it('shows "No description available" if description is undefined', () => {
		mockContextValue = {
			availableProjects: [
				{ _id: '3', name: 'Project Three' },
			],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		render(<Wrapper />);
		expect(screen.getByText('No description available')).toBeInTheDocument();
	});

	it('matches snapshot for a typical project list', () => {
		mockContextValue = {
			availableProjects: [
				{ _id: '1', name: 'Project One', description: 'Desc One' },
				{ _id: '2', name: 'Project Two', description: '' },
			],
			isLoadingProjects: false,
			isRefetchingProjects: false,
			setProjectID: mockSetProjectID,
			projectID: null,
		};
		const { container } = render(<Wrapper />);
		expect(container).toMatchSnapshot();
	});
});