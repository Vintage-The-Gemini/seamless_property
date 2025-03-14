import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import AddTenantModal from '../modals/AddTenantModal';
import { fetchTenants, createTenant, updateTenant, deleteTenant } from '../../utils/api';

const PropertyTenants = ({ property, onUpdate }) => {
  const [tenants, setTenants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  useEffect(() => {
    loadTenants();
  }, [property._id]);

  const loadTenants = async () => {
    try {
      const response = await fetchTenants(property._id);
      setTenants(response.data);
    } catch (error) {
      console.error('Error loading tenants:', error);
    }
  };

  const handleAddTenant = async (tenantData) => {
    try {
      await createTenant({
        ...tenantData,
        propertyId: property._id
      });
      
      // Update unit occupancy
      const updatedFloors = property.floors.map(floor => ({
        ...floor,
        units: floor.units.map(unit => {
          if (unit.unitNumber === tenantData.unitNumber) {
            return { ...unit, isOccupied: true };
          }
          return unit;
        })
      }));

      await updateProperty(property._id, { ...property, floors: updatedFloors });
      
      loadTenants();
      onUpdate();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding tenant:', error);
    }
  };

  const handleDeleteTenant = async (tenantId, unitNumber) => {
    try {
      await deleteTenant(tenantId);
      
      // Update unit occupancy
      const updatedFloors = property.floors.map(floor => ({
        ...floor,
        units: floor.units.map(unit => {
          if (unit.unitNumber === unitNumber) {
            return { ...unit, isOccupied: false };
          }
          return unit;
        })
      }));

      await updateProperty(property._id, { ...property, floors: updatedFloors });
      
      loadTenants();
      onUpdate();
    } catch (error) {
      console.error('Error deleting tenant:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tenants</h3>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Tenant
        </button>
      </div>

      {/* Tenants List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lease Details
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant._id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{tenant.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">Unit {tenant.unitNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {tenant.phoneNumber}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {tenant.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    Start: {new Date(tenant.leaseStartDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    End: {new Date(tenant.leaseEndDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setEditingTenant(tenant)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteTenant(tenant._id, tenant.unitNumber)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddTenantModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTenant}
          availableUnits={property.floors
            .flatMap(floor => floor.units)
            .filter(unit => !unit.isOccupied)
            .map(unit => unit.unitNumber)
          }
        />
      )}
    </div>
  );
};

export default PropertyTenants;