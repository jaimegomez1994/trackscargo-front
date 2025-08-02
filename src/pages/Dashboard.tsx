import { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectAuth } from '../store/slices/authSlice';
import { useShipments } from '../api/shipmentApi';
import ShipmentsList from '../components/dashboard/ShipmentsList';
import CreateShipmentDrawer from '../components/drawers/CreateShipmentDrawer';
import AddTrackingEventDrawer from '../components/drawers/AddTrackingEventDrawer';
import type { Shipment } from '../types/api';

function Dashboard() {
  const { user, organization } = useAppSelector(selectAuth);
  const { data: shipmentsResponse, isLoading, error } = useShipments();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isAddEventDrawerOpen, setIsAddEventDrawerOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  
  const shipments = shipmentsResponse?.shipments || [];

  const handleAddTrackingEvent = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsAddEventDrawerOpen(true);
  };

  const handleCloseAddEventDrawer = () => {
    setIsAddEventDrawerOpen(false);
    setSelectedShipment(null);
  };

  // Auto-populate tracking ID from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackingId = urlParams.get('trackid');
    
    if (trackingId && shipments.length > 0) {
      // Find shipment by tracking number
      const foundShipment = shipments.find(
        shipment => shipment.trackingNumber.toLowerCase() === trackingId.toLowerCase()
      );
      
      if (foundShipment) {
        // Auto-open the tracking event drawer with the found shipment
        handleAddTrackingEvent(foundShipment);
        
        // Clean up URL parameter to prevent reopening on refresh
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('trackid');
        window.history.replaceState({}, '', newUrl.pathname + newUrl.search);
      }
    }
  }, [shipments]); // Depend on shipments so it runs when data loads

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-4 sm:px-0">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold leading-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1 max-w-4xl text-sm text-gray-500">
              Welcome back, {user?.displayName}! Manage your shipments and track logistics for {organization?.name}.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 sm:px-0 mt-4 flex gap-3">
          <button
            onClick={() => setIsCreateDrawerOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Shipment
          </button>
          
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Track Shipment
          </a>
        </div>

        {/* Shipments List */}
        <div className="px-4 sm:px-0 mt-4">
          <ShipmentsList 
            shipments={shipments} 
            isLoading={isLoading} 
            error={error?.message || null}
            onCreateShipment={() => setIsCreateDrawerOpen(true)}
            onAddTrackingEvent={handleAddTrackingEvent}
          />
        </div>
      </div>

      {/* Create Shipment Drawer */}
      <CreateShipmentDrawer 
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
      />

      {/* Add Tracking Event Drawer */}
      <AddTrackingEventDrawer 
        isOpen={isAddEventDrawerOpen}
        onClose={handleCloseAddEventDrawer}
        shipment={selectedShipment}
      />
    </div>
  );
}

export default Dashboard;