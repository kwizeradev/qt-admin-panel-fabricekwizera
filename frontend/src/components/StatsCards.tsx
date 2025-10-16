import React from 'react';
import { Users, UserCheck, Calendar } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { User, DailyStats } from '../types';

interface StatsCardsProps {
  users: User[];
  stats: DailyStats[];
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ users, stats, loading }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  
  const thisWeekCount = stats.reduce((sum, day) => sum + day.count, 0);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            {loading ? (
              <div className="h-9 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {value.toLocaleString()}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="h-6 w-6 text-blue-600" />}
        color="bg-blue-50"
      />
      <StatCard
        title="Active Users"
        value={activeUsers}
        icon={<UserCheck className="h-6 w-6 text-green-600" />}
        color="bg-green-50"
      />
      <StatCard
        title="New This Week"
        value={thisWeekCount}
        icon={<Calendar className="h-6 w-6 text-purple-600" />}
        color="bg-purple-50"
      />
    </div>
  );
};

export default StatsCards;