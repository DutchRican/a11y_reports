import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchScanResultById } from '../api/results';
import ImpactChart from '../components/charts/ImpactChart';
import ViolationDetail from '../components/violations/ViolationDetail';
import { ScanResult } from '../types';

const DetailViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading: isLoadingResult, error: errorResult } = useQuery<ScanResult, Error>({
    queryKey: ['scanResult', id],
    queryFn: () => fetchScanResultById(id!),
    enabled: !!id,
  });

  if (isLoadingResult) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (errorResult) {
    return <div className="text-center text-red-600">Error loading scan result.</div>;
  }

  if (!result) {
    return <div className="text-center text-gray-600">No result found.</div>;
  }

  return (
    <>
      <div className="px-2 sticky top-35">
        <button onClick={() => navigate(-1)} title="Back to Overview" className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      <div className="max-w-7/8 mx-auto my-8 p-4">
        <h1 className="text-3xl font-bold mb-2">
          {result.testName}
        </h1>

        <p className="text-gray-600 mb-1">
          Page URL: <a href={result.url} target="_blank" rel="noopener" className="text-blue-500 hover:underline">
            {result.url}
          </a>
        </p>

        <p className="text-gray-600 mb-4">
          Scan Date: {new Date(result.created).toLocaleString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ImpactChart scanResults={result} />
          </div>

          <div className="col-span-full">
            {result.violations?.map((violation) => (
              <ViolationDetail key={violation.id} violation={violation} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailViewPage;
