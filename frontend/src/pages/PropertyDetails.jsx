import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import { PropertyStats } from "../components/property/PropertyStats";
import PropertyTabs from "../components/property/PropertyTabs"; // Fixed import path
import {
  fetchPropertyById,
  updateProperty,
  deleteProperty,
} from "../utils/api";
import EditPropertyModal from "../components/modals/EditPropertyModal";
import AddUnitModal from "../components/modals/AddUnitModal";
import EditUnitModal from "../components/modals/EditUnitModal";
import AddTenantModal from "../components/modals/AddTenantModal";
import PaymentModal from "../components/modals/PaymentModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Modal states
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected items for modals
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetchPropertyById(id);
        setProperty(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

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

    const totalUnits =
      property.floors?.reduce((acc, floor) => acc + floor.units.length, 0) || 0;

    const occupiedUnits =
      property.floors?.reduce(
        (acc, floor) =>
          acc + floor.units.filter((unit) => unit.isOccupied).length,
        0
      ) || 0;

    const vacantUnits = totalUnits - occupiedUnits;

    const occupancyRate =
      totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    const totalRent =
      property.floors?.reduce(
        (acc, floor) =>
          acc +
          floor.units.reduce(
            (sum, unit) => (unit.isOccupied ? sum + unit.monthlyRent : sum),
            0
          ),
        0
      ) || 0;

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
      const response = await updateProperty(id, updatedData);
      setProperty(response.data?.data || response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  };

  // Handle edit unit
  const handleEditUnit = (floor, unit) => {
    setSelectedFloor(floor);
    setSelectedUnit(unit);
    setShowEditUnitModal(true);
  };

  // Handle add tenant
  const handleAddTenant = (floor, unit) => {
    setSelectedFloor(floor);
    setSelectedUnit(unit);
    setShowAddTenantModal(true);
  };

  // Handle delete unit
  const handleDeleteUnit = async (floor, unit) => {
    try {
      // Create updated floors array without the unit to delete
      const updatedFloors = property.floors.map((f) => {
        if (f.floorNumber === floor.floorNumber) {
          return {
            ...f,
            units: f.units.filter((u) => u.unitNumber !== unit.unitNumber),
          };
        }
        return f;
      });

      // Update property with new floors array
      await handlePropertyUpdate({ ...property, floors: updatedFloors });
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  // Handle delete property
  const handleDeleteProperty = async () => {
    try {
      await deleteProperty(id);
      navigate("/properties");
    } catch (error) {
      console.error("Error deleting property:", error);
    }
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
          onClick={() => navigate("/properties")}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-gray-600 mb-4">Property not found</p>
        <button
          onClick={() => navigate("/properties")}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Property Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/properties")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {property.name}
            </h1>
            <p className="text-gray-500">{property.address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditProperty(true)}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Property Stats */}
      <PropertyStats stats={stats} />

      {/* Tabs Navigation */}
      <PropertyTabs
        property={property}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddUnit={() => setShowAddUnitModal(true)}
        onEditUnit={handleEditUnit}
        onDeleteUnit={handleDeleteUnit}
        onAddTenant={handleAddTenant}
        onAddPayment={() => setShowPaymentModal(true)}
      />

      {/* Modals */}
      {showEditProperty && (
        <EditPropertyModal
          property={property}
          onClose={() => setShowEditProperty(false)}
          onUpdate={handlePropertyUpdate}
        />
      )}

      {showAddUnitModal && (
        <AddUnitModal
          property={property}
          onClose={() => setShowAddUnitModal(false)}
          onUpdate={handlePropertyUpdate}
        />
      )}

      {showEditUnitModal && selectedUnit && selectedFloor && (
        <EditUnitModal
          property={property}
          floor={selectedFloor}
          unit={selectedUnit}
          onClose={() => {
            setShowEditUnitModal(false);
            setSelectedUnit(null);
            setSelectedFloor(null);
          }}
          onUpdate={handlePropertyUpdate}
        />
      )}

      {showAddTenantModal && selectedUnit && selectedFloor && (
        <AddTenantModal
          property={property}
          unit={selectedUnit}
          floor={selectedFloor}
          onClose={() => {
            setShowAddTenantModal(false);
            setSelectedUnit(null);
            setSelectedFloor(null);
          }}
          onUpdate={handlePropertyUpdate}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          property={property}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={(paymentData) => {
            console.log("Payment submitted:", paymentData);
            setShowPaymentModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
          onConfirm={handleDeleteProperty}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
