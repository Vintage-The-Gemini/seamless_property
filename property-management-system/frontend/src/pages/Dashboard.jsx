// src/pages/Dashboard.jsx
// Purpose: Dashboard page component
// Demonstrates: Usage of Card component and theme-aware styling

// src/pages/Dashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, Wallet, Wrench } from 'lucide-react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  // Fetch dashboard statistics
  const { data: stats = {} } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats'),
    initialData: {
      properties: { total: 0, trend: 0 },
      tenants: { total: 0, trend: 0 },
      revenue: { total: 0, trend: 0 },
      maintenance: { total: 0, trend: 0 }
    }
  });

  // Fetch revenue data for chart
  const { data: revenueData = [] } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: () => api.get('/dashboard/revenue'),
    initialData: []
  });

  // Fetch recent activities
  const { data: activities = [] } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => api.get('/dashboard/activities'),
    initialData: []
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your property management</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.properties?.total || 0}
          icon={Building2}
          trend={stats.properties?.trend}
          color="text-blue-500"
        />
        <StatCard
          title="Total Tenants"
          value={stats.tenants?.total || 0}
          icon={Users}
          trend={stats.tenants?.trend}
          color="text-purple-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.revenue?.total?.toLocaleString() || 0}`}
          icon={Wallet}
          trend={stats.revenue?.trend}
          color="text-green-500"
        />
        <StatCard
          title="Pending Maintenance"
          value={stats.maintenance?.total || 0}
          icon={Wrench}
          trend={stats.maintenance?.trend}
          color="text-orange-500"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10 mr-4`}>
                {activity.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;