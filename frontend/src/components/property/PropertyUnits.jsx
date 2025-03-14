import { useState } from 'react';
import { Plus, Edit, Trash2, Home } from 'lucide-react';
import AddUnitModal from '../modals/AddUnitModal';
import { updateProperty } from '../../utils/api';

const PropertyUnits = ({ property, onUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);

  const handleAddUnit = async (unitData) => {
    try {
      const updatedFloors = [...property.floors];
      const floorIndex = updatedFloors.findIndex(f => f.floorNumber === unitData.floorNumber);
      
      if (floorIndex === -1) {
        // Create new floor if it doesn't exist
        updatedFloors.push({
          floorNumber: unitData.floorNumber,
          units: [{
            unitNumber: unitData.unitNumber,
            monthlyRent: unitData.monthlyRent,
            isOccupied: false
          }]
        });
      } else {
        // Add unit to existing floor
        updatedFloors[floorIndex].units.push({
          unitNumber: unitData.unitNumber,
          monthlyRent: unitData.monthlyRent,
          isOccupied: false
        });
      }

      await updateProperty(property._id, { ...property, floors: updatedFloors });
      onUpdate();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  };

  const handleDeleteUnit = async (floorNumber, unitNumber) => {
    try {
      const updatedFloors = property.floors.map(floor => {
        if (floor.floorNumber === floorNumber) {
          return {
            ...floor,
            units: floor.units.filter(unit => unit.unitNumber !== unitNumber)
          };
        }
        return floor;
      });

      await updateProperty(property._id, { ...property, floors: updatedFloors });
      onUpdate();
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Units</h3>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Unit
        </button>
      </div>

      {/* Floor Cards */}
      {property.floors.sort((a, b) => b.floorNumber - a.floorNumber).map((floor) => (
        <div key={floor.floorNumber} className="card">
          <h4 className="text-lg font-medium mb-4">Floor {floor.floorNumber}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {floor.units.map((unit) => (
              <div 
                key={unit.unitNumber}
                className={`p-4 rounded-lg border ${
                  unit.isOccupied ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">Unit {unit.unitNumber}</h5>
                    <p className="text-sm text-gray-500">Rent: ${unit.monthlyRent}</p>
                    <p className={`text-sm ${
                      unit.isOccupied ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {unit.isOccupied ? 'Occupied' : 'Vacant'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setEditingUnit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteUnit(floor.floorNumber, unit.unitNumber)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showAddModal && (
        <AddUnitModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUnit}
          existingFloors={property.floors.map(f => f.floorNumber)}
        />
      )}
    </div>
  );
};

export default PropertyUnits;