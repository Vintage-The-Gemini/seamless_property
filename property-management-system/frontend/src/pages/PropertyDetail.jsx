// src/pages/PropertyDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Users, 
  Home, 
  Plus, 
  Settings, 
  Banknote, 
  Wrench  // Changed from Tool to Wrench
} from 'lucide-react';
import propertyService from '../services/propertyService';

// Floor Card Component
const FloorCard = ({ floor, propertyId, onAddUnit }) => {
  const { data: units = [] } = useQuery({
    queryKey: ['units', propertyId, floor.id],
    queryFn: () => propertyService.getUnits(propertyId, floor.id)
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Floor {floor.number}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {units.length} Units
          </p>
        </div>
        <button
          onClick={() => onAddUnit(floor.id)}
          className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
};

// Unit Card Component
const UnitCard = ({ unit }) => {
  const statusColors = {
    vacant: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    occupied: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    maintenance: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    reserved: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Unit {unit.number}</h4>
          <span className={`text-sm px-2 py-1 rounded-full ${statusColors[unit.status]}`}>
            {unit.status}
          </span>
        </div>
        <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Home className="h-4 w-4 mr-2" />
          {unit.type} - {unit.size}sq ft
        </div>
        {unit.tenant && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 mr-2" />
            {unit.tenant.name}
          </div>
        )}
        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
          <Banknote className="h-4 w-4 mr-2" />
          ${unit.rent}/month
        </div>
      </div>
    </div>
  );
};

// Property Statistics Card
const StatCard = ({ title, value, icon: Icon, trend, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
    <div className="flex items-center justify-between mb-2">
      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
    <p className="text-xl font-semibold text-gray-900 dark:text-white">
      {value}
    </p>
    {trend && (
      <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
      </p>
    )}
  </div>
);

// Main Property Detail Component
const PropertyDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState(null);

  // Fetch property details
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id)
  });

  // Fetch floors
  const { data: floors = [], isLoading: floorsLoading } = useQuery({
    queryKey: ['floors', id],
    queryFn: () => propertyService.getFloors(id)
  });

  // Fetch property statistics
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['property-stats', id],
    queryFn: () => propertyService.getPropertyStats(id)
  });

  // Mutations
  const addFloorMutation = useMutation({
    mutationFn: (data) => propertyService.addFloor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['floors', id]);
      setIsFloorModalOpen(false);
    }
  });

  const addUnitMutation = useMutation({
    mutationFn: ({ floorId, data }) => propertyService.addUnit(id, floorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['units', id]);
      setIsUnitModalOpen(false);
      setSelectedFloorId(null);
    }
  });

  if (propertyLoading) {
    return <div className="text-center p-8">Loading property details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {property?.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {property?.address}
            </p>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Property Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Total Units"
            value={stats.totalUnits}
            icon={Home}
            trend={stats.unitsTrend}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon={Users}
            trend={stats.occupancyTrend}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue?.toLocaleString()}`}
            icon={Banknote}
            trend={stats.revenueTrend}
          />
            <StatCard
            title="Maintenance"
            value={stats.maintenanceRequests}
            icon={Wrench}  // Changed from Tool to Wrench
          />
        </div>
      </div>

      {/* Floors Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Floors & Units
          </h2>
          <button
            onClick={() => setIsFloorModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 
                     text-white rounded-lg flex items-center space-x-2 hover:from-primary-700 
                     hover:to-primary-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Floor</span>
          </button>
        </div>

        {floorsLoading ? (
          <div className="text-center p-8">Loading floors...</div>
        ) : (
          <div className="space-y-6">
            {floors.map((floor) => (
              <FloorCard
                key={floor.id}
                floor={floor}
                propertyId={id}
                onAddUnit={(floorId) => {
                  setSelectedFloorId(floorId);
                  setIsUnitModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddFloorModal
        isOpen={isFloorModalOpen}
        onClose={() => setIsFloorModalOpen(false)}
        onSubmit={(data) => addFloorMutation.mutate(data)}
        isLoading={addFloorMutation.isLoading}
      />

      <AddUnitModal
        isOpen={isUnitModalOpen}
        onClose={() => {
          setIsUnitModalOpen(false);
          setSelectedFloorId(null);
        }}
        onSubmit={(data) => addUnitMutation.mutate({
          floorId: selectedFloorId,
          data
        })}
        isLoading={addUnitMutation.isLoading}
      />
    </div>
  );
};

export default PropertyDetail;