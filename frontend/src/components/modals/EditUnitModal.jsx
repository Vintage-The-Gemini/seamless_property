import { useState } from 'react';
import { X } from 'lucide-react';
import { updateProperty } from '../../utils/api';

const EditUnitModal = ({ property, floor, unit, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    unitNumber: unit.unitNumber,
    monthlyRent: unit.monthlyRent
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFloors = property.floors.map(f => {
        if (f.floorNumber === floor.floorNumber) {
          const updatedUnits = f.units.map(u => {
            if (u._id === unit._id) {
              return { ...u, ...formData };
            }
            return u;
          });
          return { ...f, units: updatedUnits };
        }
        return f;
      });

      await updateProperty(property._id, { ...property, floors: updatedFloors });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Edit Unit</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unit Number</label>
              <input
                type="text"
                value={formData.unitNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Rent</label>
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: parseFloat(e.target.value) }))}
                className="w-full p-2 border rounded-lg"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUnitModal;