import React from "react";
import { Phone, Mail } from "lucide-react";

export const PropertyTenants = ({
  property,
  onViewTenant,
  onEditTenant,
  onDeleteTenant,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tenants</h3>
      </div>

      {!property || !property.floors || property.floors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tenants found</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease Details
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {property.floors.flatMap((floor) =>
                floor.units
                  .filter((unit) => unit.isOccupied && unit.tenant)
                  .map((unit, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {unit.tenant.name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          Unit {unit.unitNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Floor {floor.floorNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {unit.tenant.phoneNumber || "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {unit.tenant.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {unit.tenant.leaseStartDate
                            ? `Start: ${new Date(
                                unit.tenant.leaseStartDate
                              ).toLocaleDateString()}`
                            : "Start: N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {unit.tenant.leaseEndDate
                            ? `End: ${new Date(
                                unit.tenant.leaseEndDate
                              ).toLocaleDateString()}`
                            : "End: N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {onViewTenant && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              onViewTenant(unit.tenant, unit, floor)
                            }
                          >
                            View
                          </button>
                        )}
                        {onEditTenant && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              onEditTenant(unit.tenant, unit, floor)
                            }
                          >
                            Edit
                          </button>
                        )}
                        {onDeleteTenant && (
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() =>
                              onDeleteTenant(unit.tenant, unit.unitNumber)
                            }
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
