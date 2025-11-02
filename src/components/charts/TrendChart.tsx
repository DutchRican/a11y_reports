import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ScanResult } from '../../types';
import { colorMap } from './colors';

interface TrendChartProps {
  scanResults: ScanResult[];
  unfilteredCount: number;
  isPending: boolean;
}

const TrendChart: React.FC<TrendChartProps> = ({ scanResults, unfilteredCount, isPending }) => {
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
    <div className="chart-page">
      <h3 className="sub-header">Issues Trend Over Time</h3>
      {!!scanResults.length && <ResponsiveContainer width="100%" height="85%">
        <LineChart data={mapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="timestamp" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} />
          <Legend wrapperStyle={{ paddingTop: '15px', color: '#A0AEC0' }} />
          <Line type="monotone" dataKey="minor" stroke={colorMap.minor} name="Minor" />
          <Line type="monotone" dataKey="moderate" stroke={colorMap.moderate} name="Moderate" />
          <Line type="monotone" dataKey="serious" stroke={colorMap.serious} name="Serious" />
          <Line type="monotone" dataKey="critical" stroke={colorMap.critical} name="Critical" />
        </LineChart>
      </ResponsiveContainer>}
      {!scanResults.length && !!unfilteredCount && <div className="loading-placeholder-message">No scan results match the current filters</div>}
      {isPending && <div className="loading-placeholder-message">Fetching data...</div>}
      {!unfilteredCount && !isPending && <div className="loading-placeholder-message">There are no scan results available, have you uploaded scans yet?</div>}
    </div>
  );
};

export default TrendChart;
