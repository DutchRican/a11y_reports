import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchScanResults } from '../api/results';
import TrendChart from '../components/charts/TrendChart';
import ScanResultsTable from '../components/tables/ScanResultsTable';
import { ScanResult } from '../types';

const OverviewPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: scanResults = [], isLoading } = useQuery<ScanResult[], Error>({
    queryKey: ['scanResults'],
    queryFn: fetchScanResults
  });

  const handleSelectResult = (result: ScanResult) => {
    navigate(`/dashboard/${result._id}`);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const testNameFilter = searchParams.get('testName') || '';
  const dateFilter = searchParams.get('date') || '';

  useEffect(() => {
    if (testNameFilter || dateFilter) {
      setFiltersOpen(true);
    }
  }, [testNameFilter, dateFilter]);

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const filteredResults = scanResults.filter((result) => {
    const testNameMatch = result.testName.toLowerCase().includes(testNameFilter.toLowerCase());
    const dateMatch = result.created.includes(dateFilter);
    return testNameMatch && dateMatch;
  });

  return (
    <div className="max-w-7/8 mx-auto my-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Accessibility Test Results Overview</h1>
        {isLoading && <div>Loading...</div>}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-label="toggle filters"
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.707 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${filtersOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mb-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="testNameFilter" className="sr-only">Filter by Test Name</label>
              <input
                id="testNameFilter"
                type="text"
                placeholder="Filter by test Name"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={testNameFilter}
                onChange={(e) => handleFilterChange('testName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dateFilter" className="sr-only">Filter by Date (YYYY-MM-DD)</label>
              <input
                id="dateFilter"
                type="text"
                placeholder="Filter by Date (YYYY-MM-DD)"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateFilter}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <TrendChart scanResults={filteredResults} />
        </div>
        <div>
          <ScanResultsTable
            scanResults={filteredResults}
            onSelectResult={handleSelectResult}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

