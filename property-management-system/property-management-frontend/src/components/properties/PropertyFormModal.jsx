import React from 'react';
import { X } from 'lucide-react';

const PropertyFormModal = ({ isOpen, onClose, property, onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState(property || {
    name: '',
    address: '',
    type: 'residential',
    totalFloors: 1,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {property ? 'Edit Property' : 'Add Property'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed">Mixed Use</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Floors
            </label>
            <input
              type="number"
              value={formData.totalFloors}
              onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 
                       dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 
                       text-white rounded-lg hover:from-primary-700 hover:to-primary-800 
                       transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;