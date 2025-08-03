import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ScanResult } from '../../types';
import { colorMap } from './colors';

interface ImpactChartProps {
  scanResults: ScanResult;
}

const ImpactChart: React.FC<ImpactChartProps> = ({ scanResults }) => {
  const impactData = scanResults.violations?.reduce((acc: { [key: string]: number }, violation) => {
    acc[violation.impact] = (acc[violation.impact] || 0) + 1;
    return acc;
  }, {});
  if (!impactData) {
    return null;
  }

  const chartData = Object.entries(impactData)?.map(([impact, count]) => ({
    impact,
    count,
    fill: colorMap[impact] || '#000', // Default color if impact is not in colorMap
  }));


  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg h-96">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Issues by Impact Severity</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="impact" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} />
          <Bar dataKey="count" cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactChart;
