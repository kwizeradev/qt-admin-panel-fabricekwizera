import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { DailyStats } from '../types';
import { formatChartDate, formatTooltipDate, isValidDate } from '../utils/dateHelpers';

interface UserChartProps {
  stats: DailyStats[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const UserChart: React.FC<UserChartProps> = ({ stats, loading, error, onRetry }) => {
  const validStats = stats.filter(stat => isValidDate(stat.date));
  
  const chartData = validStats.map(stat => ({
    date: formatChartDate(stat.date),
    count: stat.count,
    fullDate: stat.date,
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Created (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Created (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 mb-2">Failed to load chart data</div>
              <div className="text-gray-500 text-sm mb-4">{error}</div>
              {onRetry && (
                <Button onClick={onRetry} size="sm">
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Created (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Created (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [value, 'Users Created']}
                labelFormatter={(date: string) => {
                  const item = chartData.find(d => d.date === date);
                  return item ? formatTooltipDate(item.fullDate) : date;
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserChart;