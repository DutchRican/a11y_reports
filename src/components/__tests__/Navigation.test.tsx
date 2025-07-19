import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectProvider } from '../../context/projectContext';
import Navigation from '../Navigation';

describe('Navigation', () => {
  const queryClient = new QueryClient();
  it('renders all navigation tabs', () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ProjectProvider>
            <Navigation onUploadClick={jest.fn()} onProjectCreationClick={jest.fn()} />
          </ProjectProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Projects')).toBeDefined();
    expect(screen.getByText('Project')).toBeDefined();
    expect(screen.getByText('ADA Info')).toBeDefined();
  });
});