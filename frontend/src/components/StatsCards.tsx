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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '-' : value}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
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
        icon={<UserCheck className="h-6 w-6 text-success-600" />}
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