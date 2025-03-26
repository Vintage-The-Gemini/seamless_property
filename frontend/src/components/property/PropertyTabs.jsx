import { useState, useEffect } from "react";
import { fetchPayments } from "../../utils/api";

// Create custom tab components
const PropertyOverview = ({ property }) => {
  // Handle edge case if property is undefined
  if (!property) return <div>Loading property data...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-medium mb-4">Property Details</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">Address</dt>
              <dd className="font-medium">{property.address}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Floors</dt>
              <dd className="font-medium">{property.floors?.length || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created On</dt>
              <dd className="font-medium">
                {property.createdAt
                  ? new Date(property.createdAt).toLocaleDateString()
                  : "N/A"}
              </dd>
            </div>
          </dl>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-medium mb-4">Financial Summary</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">Monthly Revenue</dt>
              <dd className="font-medium">
                $
                {property.floors
                  ?.reduce(
                    (acc, floor) =>
                      acc +
                      floor.units.reduce(
                        (sum, unit) =>
                          unit.isOccupied ? sum + (unit.monthlyRent || 0) : sum,
                        0
                      ),
                    0
                  )
                  .toLocaleString() || 0}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Vacancy Loss</dt>
              <dd className="font-medium text-red-600">
                $
                {property.floors
                  ?.reduce(
                    (acc, floor) =>
                      acc +
                      floor.units.reduce(
                        (sum, unit) =>
                          !unit.isOccupied
                            ? sum + (unit.monthlyRent || 0)
                            : sum,
                        0
                      ),
                    0
                  )
                  .toLocaleString() || 0}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

const PropertyUnits = ({
  property,
  onAddUnit,
  onEditUnit,
  onDeleteUnit,
  onAddTenant,
}) => {
  // Ensure property exists before rendering
  if (!property || !property.floors) {
    return <div>No property data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Units</h3>
        <button type="button" className="btn-primary" onClick={onAddUnit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Unit
        </button>
      </div>

      {property.floors
        .sort((a, b) => b.floorNumber - a.floorNumber)
        .map((floor) => (
          <div key={floor.floorNumber} className="card">
            <h4 className="text-md font-medium mb-4">
              Floor {floor.floorNumber}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {floor.units &&
                floor.units.map((unit) => (
                  <div
                    key={unit.unitNumber}
                    className={`p-4 rounded-lg border ${
                      unit.isOccupied
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">Unit {unit.unitNumber}</h5>
                        <p className="text-sm text-gray-500">
                          Rent: ${unit.monthlyRent?.toLocaleString() || 0}
                        </p>
                        <p
                          className={`text-sm ${
                            unit.isOccupied ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {unit.isOccupied ? "Occupied" : "Vacant"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => onEditUnit(floor, unit)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => onDeleteUnit(floor, unit)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {!unit.isOccupied && (
                          <button
                            type="button"
                            className="text-green-600 hover:text-green-800"
                            onClick={() => onAddTenant(floor, unit)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
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
  );
};

const PropertyTenants = ({ property }) => {
  // Ensure property exists and has the expected structure
  if (!property || !property.floors) {
    return <div>No property data available</div>;
  }

  // Get all occupied units with tenant information
  const tenants =
    property.floors.flatMap((floor) =>
      floor.units
        .filter((unit) => unit.isOccupied && unit.tenant)
        .map((unit) => ({
          ...unit.tenant,
          unitNumber: unit.unitNumber,
          floorNumber: floor.floorNumber,
          monthlyRent: unit.monthlyRent,
        }))
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Tenants</h3>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tenants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-lg">{tenant.name}</h4>
                  <p className="text-sm text-gray-500">
                    Unit {tenant.unitNumber}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Email:</span> {tenant.email}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {tenant.phoneNumber}
                </p>
                <p>
                  <span className="text-gray-500">Lease Period:</span>{" "}
                  {tenant.leaseStartDate
                    ? new Date(tenant.leaseStartDate).toLocaleDateString()
                    : "N/A"}{" "}
                  -{" "}
                  {tenant.leaseEndDate
                    ? new Date(tenant.leaseEndDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <span className="text-gray-500">Monthly Rent:</span> $
                  {tenant.monthlyRent?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PropertyPayments = ({ property, payments, onAddPayment }) => {
  if (!property) {
    return <div>No property data available</div>;
  }

  // Safely handle missing payments
  const paymentsList = payments || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payments</h3>
        <button type="button" onClick={onAddPayment} className="btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm text-gray-500">Total Collected</h4>
          <p className="text-2xl font-bold text-green-600 mt-2">
            $
            {paymentsList
              .reduce((sum, payment) => sum + (payment.amount || 0), 0)
              .toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm text-gray-500">Outstanding</h4>
          <p className="text-2xl font-bold text-red-600 mt-2">$0</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm text-gray-500">Collection Rate</h4>
          <p className="text-2xl font-bold mt-2">0%</p>
        </div>
      </div>

      {paymentsList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No payment records found</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentsList.map((payment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div className="font-medium">Unit {payment.unitNumber}</div>
                    <div className="text-sm text-gray-500">
                      {payment.tenantName || "Unknown Tenant"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    ${(payment.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === "FULL"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "PARTIAL"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {payment.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {payment.paymentMethod || "Unknown"}
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

const PropertyTabs = ({
  property,
  activeTab,
  onTabChange,
  onAddUnit,
  onEditUnit,
  onDeleteUnit,
  onAddTenant,
  onAddPayment,
}) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load payments when the payments tab is active and property ID exists
    if (activeTab === "payments" && property && property._id) {
      loadPayments();
    }
  }, [activeTab, property]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchPayments(property._id);

      if (response && response.data) {
        setPayments(response.data.data || []);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      setError("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  // Handle the case where property is undefined
  if (!property) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        Loading property data...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex px-6 space-x-8">
          <button
            type="button"
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "units"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange("units")}
          >
            Units
          </button>
          <button
            type="button"
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tenants"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange("tenants")}
          >
            Tenants
          </button>
          <button
            type="button"
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "payments"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onTabChange("payments")}
          >
            Payments
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-800">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <PropertyOverview property={property} />
            )}

            {activeTab === "units" && (
              <PropertyUnits
                property={property}
                onAddUnit={onAddUnit}
                onEditUnit={onEditUnit}
                onDeleteUnit={onDeleteUnit}
                onAddTenant={onAddTenant}
              />
            )}

            {activeTab === "tenants" && <PropertyTenants property={property} />}

            {activeTab === "payments" && (
              <PropertyPayments
                property={property}
                payments={payments}
                onAddPayment={onAddPayment}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyTabs;
