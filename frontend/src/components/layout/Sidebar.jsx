import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Wallet, 
  BarChart3 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Tenants', href: '/tenants', icon: Users },
  { name: 'Payments', href: '/payments', icon: Wallet },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 w-72 h-screen pt-16 bg-white border-r border-gray-200">
      <div className="h-full px-4 py-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-600">PropManager</h1>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg text-sm font-medium
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;