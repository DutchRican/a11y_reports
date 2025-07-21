import React from 'react';
import { A11yViolation } from '../../types';

interface ViolationDetailProps {
  violation: A11yViolation;
}

const ViolationDetail: React.FC<ViolationDetailProps> = ({ violation }) => {
  const impactColors: Record<string, string> = {
    critical: 'text-red-600',
    serious: 'text-orange-600',
    moderate: 'text-yellow-600',
    minor: 'text-blue-600',
  };

  return (
    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
      <p className={`text-lg font-semibold ${impactColors[violation.impact]}`}>
        Impact: {violation.impact}
      </p>
      <p className="text-gray-800 mb-2">{violation.description}</p>
      <p className="text-gray-600 text-sm mb-2">
        {violation.help}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        {violation.url || 'No URL provided'}
      </p>
      <div className="mt-1">
        <a href={violation.helpUrl} target="_blank" rel="noopener" className="text-blue-500 hover:underline">
          Learn more
        </a>
      </div>
      <div className="mt-4 p-2 bg-gray-100 rounded-md">
        <p className="text-xs text-gray-700 mb-1">
          Affected elements:
        </p>
        <code className="block whitespace-pre-wrap text-sm bg-gray-200 p-2 rounded-md">
          {violation.nodes[0].html}
        </code>
        <p className="text-xs text-gray-600 mt-1">
          Selector: {violation.nodes[0].target.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default ViolationDetail;
