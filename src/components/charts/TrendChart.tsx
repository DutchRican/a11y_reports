import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ScanResult } from '../../types';

interface TrendChartProps {
  scanResults: ScanResult[];
}

const TrendChart: React.FC<TrendChartProps> = ({ scanResults }) => {
  const trendData = scanResults
    .map(result => {
      return {
        timestamp: new Date(result.created).toLocaleDateString(),
        date: new Date(result.created),
        ...result.impactCounts,
        total: result.totalViolations,
      };
    });

  return (
    <div className="p-4 bg-white shadow-md rounded-lg h-96">
      <h3 className="text-lg font-semibold mb-4">Issues Trend Over Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ paddingTop: '15px' }} />
          <Line type="monotone" dataKey="critical" stroke="#d32f2f" name="Critical" />
          <Line type="monotone" dataKey="serious" stroke="#f57c00" name="Serious" />
          <Line type="monotone" dataKey="moderate" stroke="#ffd700" name="Moderate" />
          <Line type="monotone" dataKey="minor" stroke="#4caf50" name="Minor" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
