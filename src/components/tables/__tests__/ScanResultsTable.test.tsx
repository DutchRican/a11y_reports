import { render, screen } from '@testing-library/react';
import { ScanResult } from '../../../types';
import ScanResultsTable from '../ScanResultsTable';

const mockData: ScanResult[] = [
  {
    _id: '1',
    specName: 'Test Scan',
    pageUrl: 'https://example.com',
    timestamp: '2024-01-01T00:00:00.000Z',
    violations: []
  }
];

describe('ScanResultsTable', () => {
  it('renders scan results data', () => {
    render(<ScanResultsTable scanResults={mockData} onSelectResult={jest.fn()} />);

    expect(screen.getByText('Test Scan')).toBeDefined();
    expect(screen.getByText('https://example.com')).toBeDefined();
  });
});