import { useQuery } from '@tanstack/react-query';
import { colorSchemeDarkBlue, GridApi, GridReadyEvent, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchScanResults } from '../../api/results';
import TrendChart from '../../components/charts/TrendChart';
import Chip from '../../components/chips/chip';
import { useProjectContext } from '../../context/projectContext';
import { useSettings } from '../../context/settingsContext';
import { useScanResultFilters } from '../../hooks/useScanResultFilters';
import { ScanResult } from '../../types';
import CustomDateFilter from './components/CustomDateFilter';
import { useProjectIdFromUrl } from './hooks/useProjectIdFromUrl';
import { ScanResultFilter } from './types';

const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const gridApiRef = useRef<GridApi | null>(null);

  const { setProjectID, projectID, currentProject } = useProjectContext();
  const {
    resultNameFilter,
    dateFilter,
    handleFilterChange,
    filters,
  } = useScanResultFilters();
  const { isDarkMode } = useSettings();

  const [filteredData, setFilteredData] = useState<ScanResult[]>([]);
  const {
    data: scanResults = [],
    isPending,
    error
  } = useQuery<ScanResult[], Error>({
    queryKey: ['scanResults', projectID, dateFilter.from, dateFilter.to],
    queryFn: () => fetchScanResults(projectID, dateFilter.from, dateFilter.to),
  });

  useEffect(() => {
    if (scanResults) setFilteredData(() => scanResults.filter(res => res.testName.includes(resultNameFilter)));
  }, [scanResults, resultNameFilter]);

  const handleSelectResult = (result: ScanResult) => {
    navigate(`/detailview/${projectID}/${result._id}`);
  };

  const urlId = useProjectIdFromUrl();

  useEffect(() => {
    if (error) {
      toast.error('Not sure this id exists, navigating you home', { onClose: () => { navigate('/'); } });
    }
  }, [error, navigate]);

  useEffect(() => {
    if (urlId && !projectID) {
      setProjectID(urlId);
    }
  }, [projectID, setProjectID, urlId]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  }, []);

  useEffect(() => {
    if (gridApiRef.current) {
      const model: ScanResultFilter = { created: {}, testName: {} };
      let shouldFilter = false;

      if (dateFilter.from || dateFilter.to) {
        shouldFilter = true;
        model.created = { ...dateFilter };
      }

      if (resultNameFilter) {
        shouldFilter = true;
        model.testName = { filter: resultNameFilter, type: 'contains' };
      }

      if (shouldFilter) {
        gridApiRef.current.setFilterModel(model);
      } else {
        gridApiRef.current.setFilterModel(null);
      }
    }
  }, [dateFilter, resultNameFilter, scanResults]);

  const onFilterChanged = useCallback(() => {
    if (!gridApiRef.current) return;

    const filtered: ScanResult[] = [];
    gridApiRef.current.forEachNodeAfterFilter((node) => {
      if (node.data) filtered.push(node.data);
    });

    const model = gridApiRef.current.getFilterModel();
    const testNameInGrid = model.testName?.filter || '';
    if (testNameInGrid !== resultNameFilter) {
      handleFilterChange('testName', testNameInGrid);
    }
  }, [handleFilterChange, resultNameFilter]);

  return (
    <div className="max-w-7/8 mx-auto my-8 p-4">
      {isPending ? <div>Getting project details...</div> : (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Accessibility Test Results Overview</h1>
          <h2 className="text-lg font-semibold">
            {`Project: ${currentProject?.name}`}
          </h2>
        </div>
      )}

      <div className="space-y-8">
        <div>
          <TrendChart
            scanResults={filteredData}
            unfilteredCount={scanResults.length}
          />
        </div>
        {filters.map((filter) => <Chip key={filter.name} item={filter} onClick={() => { handleFilterChange(filter.name, ''); }} />)}
        <div className='h-96'>
          <AgGridReact
            theme={isDarkMode ? themeQuartz.withPart(colorSchemeDarkBlue) : themeQuartz}
            rowData={scanResults}
            columnDefs={[
              { headerName: 'Date', field: 'created', filter: CustomDateFilter, filterParams: { onFilterChanged: handleFilterChange } },
              {
                headerName: 'Test Name', field: 'testName', filter: 'agTextColumnFilter',
                filterParams: {
                  buttons: ['reset', 'apply'],
                  filterOptions: ['contains'],
                  maxNumConditions: 1,
                  closeOnApply: true
                }
              },
              { headerName: 'Critical', field: 'impactCounts.critical', cellClass: 'text-right' },
              { headerName: 'Serious', field: 'impactCounts.serious', cellClass: 'text-right' },
              { headerName: 'Moderate', field: 'impactCounts.moderate', cellClass: 'text-right' },
              { headerName: 'Minor', field: 'impactCounts.minor', cellClass: 'text-right' },
              { headerName: 'Total', field: 'totalViolations', cellClass: 'text-right' }
            ]}
            onGridReady={onGridReady}
            onFilterChanged={onFilterChanged}
            onRowClicked={(event) => handleSelectResult(event.data!)}
            pagination={true}
            paginationPageSize={100}
            defaultColDef={{
              flex: 1,
              filter: true, // enable filtering by default
            }}
          />
          {!scanResults.length && isPending && (
            <div className="text-center text-gray-500">Loading scan results...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
