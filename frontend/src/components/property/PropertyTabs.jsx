// src/components/property/PropertyTabs.jsx
import { useState, useEffect } from "react";
import { fetchPayments } from "../../utils/api";

// Import tab component views
import { PropertyOverview } from "./tabs/PropertyOverview";
import { PropertyUnits } from "./tabs/PropertyUnits";
import { PropertyTenants } from "./tabs/PropertyTenants";
import { PropertyPayments } from "./tabs/PropertyPayments";

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
