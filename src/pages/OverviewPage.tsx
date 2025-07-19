import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchScanResults } from '../api/results';
import TrendChart from '../components/charts/TrendChart';
import Chip from '../components/chips/chip';
import ScanResultsTable from '../components/tables/ScanResultsTable';
import { useProjectContext } from '../context/projectContext';
import { ScanResult } from '../types';

const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProjectID, projectID } = useProjectContext();

  const { data: scanResults = [], isLoading } = useQuery<ScanResult[], Error>({
    queryKey: ['scanResults'],
    queryFn: fetchScanResults
  });

  const handleSelectResult = (result: ScanResult) => {
    navigate(`/detailview/${result._id}`);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getIdFromLocation = () => {
    const match = location.pathname.match(/\/project\/(\w+)/);
    return match ? match[1] : null;
  };

  const testNameFilter = searchParams.get('testName') || '';
  const dateFilter = searchParams.get('date') || '';

  const filters = [{ name: 'testName', val: testNameFilter }, { name: 'date', val: dateFilter }].filter(({ val }) => Boolean(val));
  const testDates = Array.from(new Set(scanResults.map(result => new Date(result.created).toLocaleDateString()))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  useEffect(() => {
    if (testNameFilter || dateFilter) {
      setFiltersOpen(true);
    }
    if (getIdFromLocation() && !projectID) {
      setProjectID(getIdFromLocation()!);
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
    const dateMatch = () => new Date(result.created).toLocaleDateString().includes(dateFilter);
    return testNameMatch && dateMatch();
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
            <div className="relative">
              <label htmlFor="testNameFilter" className="sr-only">Filter by Test Name</label>
              <input
                id="testNameFilter"
                type="text"
                placeholder="Filter by test Name"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={testNameFilter}
                onChange={(e) => handleFilterChange('testName', e.target.value)}
              />
              {testNameFilter && (
                <button
                  type="button"
                  aria-label="Clear test name filter"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => handleFilterChange('testName', '')}
                  tabIndex={0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="relative">
              <label htmlFor="dateFilter" className="sr-only">Filter by Date</label>
              <input
                id="dateFilter"
                type="text"
                placeholder="Filter by date"
                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                value={dateFilter}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                list="dateFilter-options"
                autoComplete="off"
              />
              {dateFilter && (
                <button
                  type="button"
                  aria-label="Clear date filter"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => handleFilterChange('date', '')}
                  tabIndex={0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <datalist id="dateFilter-options">
                {testDates
                  .filter(date => date.includes(dateFilter))
                  .map(date => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
              </datalist>
            </div>
          </div>
        </div>
      </div>
      {filters.map((filter) => <Chip label={filter.val} onClick={() => { handleFilterChange(filter.name, ''); }} />)}
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

