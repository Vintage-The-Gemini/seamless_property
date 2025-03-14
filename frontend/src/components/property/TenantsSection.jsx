
const TenantsSection = ({ property }) => {
  // Get all occupied units with tenant information
  const tenants = property.floors.flatMap(floor =>
    floor.units.filter(unit => unit.isOccupied && unit.tenant).map(unit => ({
      ...unit.tenant,
      unitNumber: unit.unitNumber,
      floorNumber: floor.floorNumber,
      monthlyRent: unit.monthlyRent
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Property Tenants</h3>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tenants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-lg">{tenant.name}</h4>
                  <p className="text-sm text-gray-500">Unit {tenant.unitNumber}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Email:</span>{' '}
                  {tenant.email}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{' '}
                  {tenant.phoneNumber}
                </p>
                <p>
                  <span className="text-gray-500">Lease Period:</span>{' '}
                  {new Date(tenant.leaseStartDate).toLocaleDateString()} -{' '}
                  {new Date(tenant.leaseEndDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-gray-500">Monthly Rent:</span>{' '}
                  ${tenant.monthlyRent.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
