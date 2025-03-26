import React, { useState, useEffect } from "react";
import { Phone, Mail, Calendar, Home, Edit, Trash2 } from "lucide-react";
import { fetchTenants } from "../../../utils/api";

export const PropertyTenants = ({
  property,
  onViewTenant,
  onEditTenant,
  onDeleteTenant,
}) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTenants = async () => {
      if (!property?._id) return;

      try {
        setLoading(true);
        const response = await fetchTenants(property._id);
        setTenants(response.data?.data || []);
        setError(null);
      } catch (error) {
        console.error("Error loading tenants:", error);
        setError("Failed to load tenant data");
      } finally {
        setLoading(false);
      }
    };

    loadTenants();
  }, [property]);

  // Extract tenants from property data if API call fails or no dedicated tenant endpoint
  const getTenantsFromProperty = () => {
    if (!property || !property.floors) return [];

    return property.floors.flatMap((floor) =>
      floor.units
        .filter((unit) => unit.isOccupied && unit.tenant)
        .map((unit) => ({
          ...unit.tenant,
          unitNumber: unit.unitNumber,
          floorNumber: floor.floorNumber,
          monthlyRent: unit.monthlyRent,
        }))
    );
  };

  // Use API data or fallback to property data
  const displayTenants =
    tenants.length > 0 ? tenants : getTenantsFromProperty();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tenants</h3>
      </div>

      {displayTenants.length === 0 ? (
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
              {displayTenants.map((tenant, index) => (
                <tr key={tenant._id || index}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {tenant.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      Unit {tenant.unitNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      Floor {tenant.floorNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {tenant.phoneNumber}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {tenant.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      Start:{" "}
                      {new Date(tenant.leaseStartDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      End: {new Date(tenant.leaseEndDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {onViewTenant && (
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => onViewTenant(tenant)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    )}
                    {onEditTenant && (
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => onEditTenant(tenant)}
                      >
                        <Edit className="h-4 w-4 inline" />
                      </button>
                    )}
                    {onDeleteTenant && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          onDeleteTenant(tenant._id, tenant.unitNumber)
                        }
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
