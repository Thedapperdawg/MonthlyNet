import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { HistoryEntry } from '../types';

interface NetWorthChartProps {
  data: HistoryEntry[];
}

const NetWorthChart: React.FC<NetWorthChartProps> = ({ data }) => {
  // Sort data by timestamp to ensure chronological order
  const chartData = [...data].sort((a, b) => a.timestamp - b.timestamp).map(entry => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    netWorth: entry.netWorth,
    assets: entry.totalAssets,
    liabilities: entry.totalLiabilities
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-400">No data recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Net Worth Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: '#1e293b', fontSize: '14px' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          />
          <Area 
            type="monotone" 
            dataKey="netWorth" 
            stroke="#16a34a" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorNetWorth)" 
            name="Net Worth"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetWorthChart;
