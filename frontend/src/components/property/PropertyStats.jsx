import { Home, Users, Building2, DollarSign } from 'lucide-react';

export const PropertyStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Home}
        title="Total Units"
        value={stats.totalUnits}
        iconColor="blue"
      />
      <StatCard
        icon={Users}
        title="Occupied Units"
        value={stats.occupiedUnits}
        iconColor="green"
      />
      {/* Other stat cards */}
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-${iconColor}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${iconColor}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};