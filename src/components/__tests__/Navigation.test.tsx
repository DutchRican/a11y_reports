import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation', () => {
  it('renders all navigation tabs', () => {
    render(
      <MemoryRouter>
        <Navigation onUploadClick={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('ADA Info')).toBeDefined();
  });
});