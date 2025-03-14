import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2 } from 'lucide-react';
import { fetchProperties } from '../utils/api';
import AddPropertyModal from '../components/modals/AddPropertyModal';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetchProperties();
      setProperties(response.data?.data || []);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadProperties}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your properties and view details
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search properties..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first property
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Property
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div 
              key={property._id}
              onClick={() => handlePropertyClick(property._id)}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{property.name}</h3>
                  <p className="text-sm text-gray-500">{property.address}</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Units</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {property.floors?.reduce((acc, floor) => 
                      acc + floor.units.length, 0) || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupied</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {property.floors?.reduce((acc, floor) => 
                      acc + floor.units.filter(unit => unit.isOccupied).length, 0) || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddPropertyModal 
          onClose={() => setShowAddModal(false)}
          onPropertyAdded={loadProperties}
        />
      )}
    </div>
  );
};

export default Properties;