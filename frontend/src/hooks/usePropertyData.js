import { useState, useEffect } from "react";
import { getProperty, updateProperty } from "../utils/api";
import { usePaymentCalculations } from "./usePaymentCalculations";

export const usePropertyData = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await getProperty(propertyId);
        const propertyData = response.data?.data;

        if (!propertyData) {
          throw new Error("Property not found");
        }

        setProperty(propertyData);
        setError(null);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to load property data");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Calculate property statistics
  const calculateStats = () => {
    if (!property)
      return {
        totalUnits: 0,
        occupiedUnits: 0,
        vacantUnits: 0,
        occupancyRate: 0,
        totalRent: 0,
      };

    const totalUnits = property.floors.reduce(
      (acc, floor) => acc + floor.units.length,
      0
    );

    const occupiedUnits = property.floors.reduce(
      (acc, floor) =>
        acc + floor.units.filter((unit) => unit.isOccupied).length,
      0
    );

    const vacantUnits = totalUnits - occupiedUnits;

    const occupancyRate =
      totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    const totalRent = property.floors.reduce(
      (acc, floor) =>
        acc +
        floor.units.reduce(
          (sum, unit) => (unit.isOccupied ? sum + unit.monthlyRent : sum),
          0
        ),
      0
    );

    return {
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate,
      totalRent,
    };
  };

  const stats = calculateStats();

  // Handle property updates
  const handlePropertyUpdate = async (updatedData) => {
    try {
      const response = await updateProperty(propertyId, updatedData);
      setProperty(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  };

  return {
    property,
    loading,
    error,
    stats,
    handlePropertyUpdate,
  };
};
