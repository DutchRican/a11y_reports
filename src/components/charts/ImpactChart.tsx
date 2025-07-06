import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ScanResult } from '../../types';

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
  }));

  return (
    <div className="p-4 bg-white shadow-md rounded-lg h-96">
      <h3 className="text-lg font-semibold mb-4">Issues by Impact Severity</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="impact" />
          <YAxis />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Legend wrapperStyle={{ paddingTop: '15px', bottom: '25px' }} />
          <Bar dataKey="count" fill="#8884d8" cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactChart;
