import { useState } from 'react';
import { X } from 'lucide-react';
import { updateProperty } from '../../utils/api';

const EditPropertyModal = ({ property, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: property.name,
    address: property.address
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProperty(property._id, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Edit Property</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
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

export default EditPropertyModal;