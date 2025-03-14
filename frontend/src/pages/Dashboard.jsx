import { Building2, Users, Wallet, TrendingUp } from 'lucide-react'

const stats = [
  {
    name: 'Total Properties',
    value: '12',
    icon: Building2,
    change: '+2.1%',
    changeType: 'positive',
  },
  {
    name: 'Total Tenants',
    value: '48',
    icon: Users,
    change: '+3.4%',
    changeType: 'positive',
  },
  {
    name: 'Monthly Revenue',
    value: '$52,000',
    icon: Wallet,
    change: '+2.5%',
    changeType: 'positive',
  },
  {
    name: 'Occupancy Rate',
    value: '92%',
    icon: TrendingUp,
    change: '+4.3%',
    changeType: 'positive',
  },
]

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-sm text-gray-700">
          Your property management overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center gap-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium leading-6 text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-x-2">
                <div className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
                <span className="text-sm text-gray-500">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard