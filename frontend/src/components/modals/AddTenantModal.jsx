import { useState } from 'react';
import { X } from 'lucide-react';
import { createTenant, updateProperty } from '../../utils/api';

const AddTenantModal = ({ property, unit, floor, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    leaseStartDate: '',
    leaseEndDate: '',
    depositAmount: '',
    monthlyRent: unit.monthlyRent,
    emergencyContact: '',
    idNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First create tenant
      const tenantResponse = await createTenant({
        ...formData,
        propertyId: property._id,
        unitNumber: unit.unitNumber,
        floorNumber: floor.floorNumber
      });

      // Then update unit to mark as occupied and link tenant
      const updatedFloors = property.floors.map(f => {
        if (f.floorNumber === floor.floorNumber) {
          return {
            ...f,
            units: f.units.map(u => {
              if (u.unitNumber === unit.unitNumber) {
                return {
                  ...u,
                  isOccupied: true,
                  tenantId: tenantResponse.data._id,
                  tenant: {
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    leaseStartDate: formData.leaseStartDate,
                    leaseEndDate: formData.leaseEndDate
                  }
                };
              }
              return u;
            })
          };
        }
        return f;
      });

      await updateProperty(property._id, { ...property, floors: updatedFloors });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error adding tenant:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Add Tenant to Unit {unit.unitNumber}</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={formData.idNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              />
            </div>
          </div>

          {/* Lease Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lease Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lease Start Date</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={formData.leaseStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, leaseStartDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lease End Date</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={formData.leaseEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, leaseEndDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
                <input
                  type="number"
                  required
                  readOnly
                  className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm"
                  value={formData.monthlyRent}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Security Deposit</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={formData.depositAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, depositAmount: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
            >
              Add Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenantModal;