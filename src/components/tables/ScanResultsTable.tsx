import React from 'react';
import { ScanResult } from '../../types';

interface ScanResultsTableProps {
  scanResults: ScanResult[];
  onSelectResult: (result: ScanResult) => void;
}

const ScanResultsTable: React.FC<ScanResultsTableProps> = ({ scanResults, onSelectResult }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Name
            </th>
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Page URL
            </th> */}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Critical
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Serious
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Moderate
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Minor
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scanResults.map((result) => {

            return (
              <tr
                key={result._id}
                onClick={() => onSelectResult(result)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(result.created).toLocaleDateString('en-US')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.testName}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  {result.url}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {result.impactCounts.critical}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {result.impactCounts.serious}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {result.impactCounts.moderate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {result.impactCounts.minor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {result.totalViolations}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScanResultsTable;
