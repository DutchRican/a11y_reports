import { useQuery } from '@tanstack/react-query';
import { colorSchemeDarkBlue, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchScanResults } from '../../api/results';
import TrendChart from '../../components/charts/TrendChart';
import Chip from '../../components/chips/chip';
import ScanResultFilters from '../../components/ScanResultFilters';
import { useProjectContext } from '../../context/projectContext';
import { useSettings } from '../../context/settingsContext';
import { useScanResultFilters } from '../../hooks/useScanResultFilters';
import { ScanResult } from '../../types';

const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProjectID, projectID, currentProject } = useProjectContext();
  const {
    resultNameFilter,
    dateFilter,
    filtersOpen,
    setFiltersOpen,
    handleFilterChange,
    filters,
  } = useScanResultFilters();
  const { isDarkMode } = useSettings();

  const submittableFilter = useCallback((dateFilter: string): { from?: string, to?: string } => {
    if (!dateFilter) return {};
    const [start, end] = dateFilter.split(' - ');
    if (start && end) {
      return { from: start, to: end };
    } else if (start) {
      return { from: start };
    }
    return {};
  }, []);

  const {
    data: scanResults = [],
    isPending,
    error
  } = useQuery<ScanResult[], Error>({
    queryKey: ['scanResults', projectID, dateFilter],
    queryFn: () => fetchScanResults(projectID, submittableFilter(dateFilter)?.from, submittableFilter(dateFilter)?.to),
  });

  const filteredResults = useMemo(() => {
    if (!scanResults) return [];
    if (!resultNameFilter) return scanResults;
    return scanResults.filter((result) =>
      result.testName.toLowerCase().includes(resultNameFilter.toLowerCase())
    )
  }, [scanResults, resultNameFilter]);

  const handleSelectResult = (result: ScanResult) => {
    navigate(`/detailview/${projectID}/${result._id}`);
  };

  const getIdFromLocation = useCallback(() => {
    const regex = /\/project\/(\w+)/;
    const match = regex.exec(location.pathname);
    return match ? match[1] : null;
  }, [location.pathname]);

  useEffect(() => {
    if (error) {
      toast.error('Not sure this id exists, navigating you home', { onClose: () => { navigate('/'); } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);


  useEffect(() => {
    const urlId = getIdFromLocation();
    if (urlId && !projectID) {
      setProjectID(urlId);
    }
  }, [getIdFromLocation, projectID, setProjectID]);

  return (
    <div className="max-w-7/8 mx-auto my-8 p-4">
      {isPending ? <div>Getting project details...</div> : <div className="space-y-2">
        <h1 className="text-3xl font-bold">Accessibility Test Results Overview</h1>
        <h2 className="text-lg font-semibold">
          {`Project: ${currentProject?.name}`}
        </h2>
      </div>
      }

      <div className="space-y-8">
        <div>
          <TrendChart scanResults={filteredResults} unfilteredCount={scanResults.length} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <ScanResultFilters
            resultNameFilter={resultNameFilter}
            dateFilter={dateFilter}
            handleFilterChange={handleFilterChange}
            filtersOpen={filtersOpen}
          />
          <button
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-label="toggle filters"
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.707 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
        {filters.map((filter) => <Chip key={filter.name} label={filter.val} onClick={() => { handleFilterChange(filter.name, ''); }} />)}
        <div className='h-96'>
          <AgGridReact
            theme={isDarkMode ? themeQuartz.withPart(colorSchemeDarkBlue) : themeQuartz}
            rowData={filteredResults}
            columnDefs={[
              { headerName: 'Date', field: 'created' },
              { headerName: 'Test Name', field: 'testName' },
              { headerName: 'Critical', field: 'impactCounts.critical', cellClass: 'text-right' },
              { headerName: 'Serious', field: 'impactCounts.serious', cellClass: 'text-right' },
              { headerName: 'Moderate', field: 'impactCounts.moderate', cellClass: 'text-right' },
              { headerName: 'Minor', field: 'impactCounts.minor', cellClass: 'text-right' },
              { headerName: 'Total', field: 'totalViolations', cellClass: 'text-right' }
            ]}
            onRowClicked={(event) => handleSelectResult(event.data!)}
            pagination={true}
            paginationPageSize={100}
            defaultColDef={{
              flex: 1,
            }}
          />
          {!scanResults.length && isPending && <div className="text-center text-gray-500">Loading scan results...</div>}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

