import { useState } from 'react';
import { X } from 'lucide-react';
import { updateProperty } from '../../utils/api';

const AddUnitModal = ({ property, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    floorNumber: '',
    unitNumber: '',
    monthlyRent: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFloors = [...property.floors];
      const floorIndex = updatedFloors.findIndex(f => 
        f.floorNumber === parseInt(formData.floorNumber)
      );

      if (floorIndex === -1) {
        updatedFloors.push({
          floorNumber: parseInt(formData.floorNumber),
          units: []
        });
      }

      const floor = updatedFloors[floorIndex !== -1 ? floorIndex : updatedFloors.length - 1];
      floor.units.push({
        unitNumber: formData.unitNumber,
        monthlyRent: parseFloat(formData.monthlyRent),
        isOccupied: false
      });

      await updateProperty(property._id, {
        ...property,
        floors: updatedFloors
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Add New Unit</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Floor Number</label>
              <input
                type="number"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.floorNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  floorNumber: e.target.value
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit Number</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.unitNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  unitNumber: e.target.value
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Monthly Rent</label>
              <input
                type="number"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.monthlyRent}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  monthlyRent: e.target.value
                }))}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              Add Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnitModal;


