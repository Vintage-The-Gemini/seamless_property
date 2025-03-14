import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PropertyStats } from '../components/property/PropertyStats';
import { PropertyOverview, PropertyUnits, PropertyTenants, PropertyPayments } from '../components/property/tabs';
import { usePropertyData } from './hooks/usePropertyData';
import { usePaymentData } from '../hooks/usePaymentData';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Custom hooks for data management
  const { 
    property, 
    loading, 
    error, 
    stats,
    handlePropertyUpdate 
  } = usePropertyData(id);

  const {
    payments,
    paymentFilters,
    setPaymentFilters,
    handlePaymentActions
  } = usePaymentData(id);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onBack={() => navigate('/properties')} />;
  if (!property) return <NotFound onBack={() => navigate('/properties')} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PropertyHeader 
        property={property}
        onBack={() => navigate('/properties')}
        onEdit={() => setShowEditProperty(true)}
      />
      
      <PropertyStats stats={stats} />
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <PropertyOverview 
              stats={stats}
              onEditProperty={() => setShowEditProperty(true)}
            />
          )}
          
          {activeTab === 'units' && (
            <PropertyUnits 
              property={property}
              onAddUnit={() => setShowAddUnitModal(true)}
              onEditUnit={handleEditUnit}
              onDeleteUnit={handleDeleteUnit}
              onAddTenant={handleAddTenant}
            />
          )}
          
          {activeTab === 'tenants' && (
            <PropertyTenants 
              property={property}
              onViewTenant={handleViewTenant}
              onEditTenant={handleEditTenant}
              onDeleteTenant={handleDeleteTenant}
            />
          )}
          
          {activeTab === 'payments' && (
            <PropertyPayments 
              payments={payments}
              property={property}
              filters={paymentFilters}
              onFilterChange={setPaymentFilters}
              {...handlePaymentActions}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalsContainer
        property={property}
        selectedUnit={selectedUnit}
        selectedFloor={selectedFloor}
        selectedTenant={selectedTenant}
        selectedPayment={selectedPayment}
        modalStates={modalStates}
        onModalClose={handleModalClose}
        onUpdate={handlePropertyUpdate}
      />
    </div>
  );
};

export default PropertyDetails;