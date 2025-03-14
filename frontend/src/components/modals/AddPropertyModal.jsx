import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { createProperty } from '../../utils/api';

const AddPropertyModal = ({ onClose, onPropertyAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    floors: [
      {
        floorNumber: 1,
        units: [{ unitNumber: '', monthlyRent: '' }]
      }
    ]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProperty(formData);
      onPropertyAdded();
      onClose();
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const addFloor = () => {
    setFormData(prev => ({
      ...prev,
      floors: [
        ...prev.floors,
        {
          floorNumber: prev.floors.length + 1,
          units: [{ unitNumber: '', monthlyRent: '' }]
        }
      ]
    }));
  };

  const removeFloor = (index) => {
    if (formData.floors.length > 1) {
      setFormData(prev => ({
        ...prev,
        floors: prev.floors.filter((_, i) => i !== index)
      }));
    }
  };

  const addUnit = (floorIndex) => {
    setFormData(prev => {
      const newFloors = [...prev.floors];
      newFloors[floorIndex].units.push({ unitNumber: '', monthlyRent: '' });
      return { ...prev, floors: newFloors };
    });
  };

  const removeUnit = (floorIndex, unitIndex) => {
    if (formData.floors[floorIndex].units.length > 1) {
      setFormData(prev => {
        const newFloors = [...prev.floors];
        newFloors[floorIndex].units = newFloors[floorIndex].units.filter((_, i) => i !== unitIndex);
        return { ...prev, floors: newFloors };
      });
    }
  };

  const updateUnit = (floorIndex, unitIndex, field, value) => {
    setFormData(prev => {
      const newFloors = [...prev.floors];
      newFloors[floorIndex].units[unitIndex][field] = value;
      return { ...prev, floors: newFloors };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Property Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          {/* Floors and Units */}
          <div className="space-y-6">
            {formData.floors.map((floor, floorIndex) => (
              <div key={floorIndex} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Floor {floor.floorNumber}</h3>
                  {formData.floors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFloor(floorIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {floor.units.map((unit, unitIndex) => (
                  <div key={unitIndex} className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unit Number</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={unit.unitNumber}
                        onChange={(e) => updateUnit(floorIndex, unitIndex, 'unitNumber', e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
                        <input
                          type="number"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          value={unit.monthlyRent}
                          onChange={(e) => updateUnit(floorIndex, unitIndex, 'monthlyRent', e.target.value)}
                        />
                      </div>
                      {floor.units.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUnit(floorIndex, unitIndex)}
                          className="mt-6 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addUnit(floorIndex)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Unit
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addFloor}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Floor
            </button>
          </div>

          <div className="flex justify-end gap-3">
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
              Create Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;