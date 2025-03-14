
import { Plus, Edit } from 'lucide-react';

const UnitsSection = ({ property, onAddUnit, onEditUnit, onAddTenant }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Property Units</h3>
        <button 
          className="btn-primary"
          onClick={onAddUnit}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Unit
        </button>
      </div>

      <div className="space-y-6">
        {property.floors?.map((floor, floorIndex) => (
          <div key={floorIndex} className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">Floor {floor.floorNumber}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {floor.units?.map((unit, unitIndex) => (
                <div
                  key={unitIndex}
                  className={`p-4 rounded-lg border ${
                    unit.isOccupied
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">Unit {unit.unitNumber}</h5>
                      <p className="text-sm text-gray-500">
                        Rent: ${unit.monthlyRent?.toLocaleString()}
                      </p>
                      <p className={`text-sm ${
                        unit.isOccupied ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {unit.isOccupied ? 'Occupied' : 'Vacant'}
                      </p>
                      {unit.tenant && (
                        <p className="text-sm text-gray-600 mt-2">
                          Tenant: {unit.tenant.name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditUnit(floor, unit)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!unit.isOccupied && (
                        <button
                          onClick={() => onAddTenant(floor, unit)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitsSection;
```

Then in your PropertyDetails page, you would replace the units tab content with:

```javascript
{activeTab === 'units' && (
  <UnitsSection 
    property={property}
    onAddUnit={() => {/* Handle add unit */}}
    onEditUnit={handleEditUnit}
    onAddTenant={handleAddTenant}
  />
)}


