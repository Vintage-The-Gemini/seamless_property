import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react'

const Tenants = () => {
  const [tenants, setTenants] = useState([
    {
      id: 1,
      name: 'John Doe',
      unit: '101',
      property: 'Sunset Apartments',
      phone: '+1 234-567-8900',
      email: 'john@example.com',
      leaseEnd: '2024-12-31',
      rentStatus: 'Paid'
    },
    // Add more sample data
  ])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tenants</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage your tenants and leases
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Tenant
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenants..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit/Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lease End
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{tenant.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">Unit {tenant.unit}</div>
                  <div className="text-sm text-gray-500">{tenant.property}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-1" />
                    {tenant.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    {tenant.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{tenant.leaseEnd}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    tenant.rentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tenant.rentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tenants