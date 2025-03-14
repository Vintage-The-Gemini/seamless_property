import { Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-4 py-2.5 lg:px-8">
        <div className="flex items-center justify-end gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg">
            <Bell className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <span className="text-sm font-medium hidden sm:block">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;