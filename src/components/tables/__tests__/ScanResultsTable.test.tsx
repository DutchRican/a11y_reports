import { render, screen } from '@testing-library/react';
import { ScanResult } from '../../../types';
import ScanResultsTable from '../ScanResultsTable';

const mockData: ScanResult[] = [
  {
    _id: '1',
    testName: 'Test Scan',
    url: 'https://example.com',
    created: '2024-01-01T00:00:00.000Z',
    violations: [],
    impactCounts: {
      critical: 1,
      serious: 2,
      moderate: 3,
      minor: 4
    },
    totalViolations: 10
  }
];

describe('ScanResultsTable', () => {
  it('renders scan results data', () => {
    render(<ScanResultsTable scanResults={mockData} onSelectResult={jest.fn()} />);

    expect(screen.getByText('Test Scan')).toBeDefined();
    expect(screen.getByText('https://example.com')).toBeDefined();
  });
});