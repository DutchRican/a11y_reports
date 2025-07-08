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

  const aggregatedTrendDataByDate: Record<string, { timestamp: string; critical: number; serious: number; moderate: number; minor: number; total: number }> = {};
  trendData.forEach((data) => {
    const dateKey = data.timestamp;
    if (!aggregatedTrendDataByDate[dateKey]) {
      aggregatedTrendDataByDate[dateKey] = { timestamp: dateKey, critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 };
    }
    aggregatedTrendDataByDate[dateKey].critical += data.critical || 0;
    aggregatedTrendDataByDate[dateKey].serious += data.serious || 0;
    aggregatedTrendDataByDate[dateKey].moderate += data.moderate || 0;
    aggregatedTrendDataByDate[dateKey].minor += data.minor || 0;
    aggregatedTrendDataByDate[dateKey].total += data.total || 0;
  });
  const mapData = Object.entries(aggregatedTrendDataByDate).map(([key, value]) => ({
    key,
    ...value,
  }));
  return (
    <div className="p-4 bg-white shadow-md rounded-lg h-96">
      <h3 className="text-lg font-semibold mb-4">Issues Trend Over Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={mapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ paddingTop: '15px' }} />
          <Line type="monotone" dataKey="minor" stroke="#4caf50" name="Minor" />
          <Line type="monotone" dataKey="moderate" stroke="#ffd700" name="Moderate" />
          <Line type="monotone" dataKey="serious" stroke="#f57c00" name="Serious" />
          <Line type="monotone" dataKey="critical" stroke="#d32f2f" name="Critical" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
