import { useState } from 'react';
import { Phone, Mail, Calendar, CreditCard } from 'lucide-react';

const TenantsList = ({ property }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allTenants = property.floors.flatMap(floor =>
    floor.units
      .filter(unit => unit.isOccupied && unit.tenant)
      .map(unit => ({
        ...unit.tenant,
        unitNumber: unit.unitNumber,
        monthlyRent: unit.monthlyRent,
        floorNumber: floor.floorNumber
      }))
  );

  const filteredTenants = allTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search tenants..."
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{tenant.name}</h3>
                <p className="text-sm text-gray-500">Unit {tenant.unitNumber}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {tenant.phoneNumber}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {tenant.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Lease: {new Date(tenant.leaseStartDate).toLocaleDateString()} - 
                {new Date(tenant.leaseEndDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CreditCard className="h-4 w-4 mr-2" />
                Rent: ${tenant.monthlyRent.toLocaleString()}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                onClick={() => {/* Handle view details */}}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tenants found</p>
        </div>
      )}
    </div>
  );
};

export default TenantsList;