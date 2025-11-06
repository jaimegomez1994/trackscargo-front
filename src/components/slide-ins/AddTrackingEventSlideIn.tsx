import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTravelEventSchema } from '../../lib/validation';
import type { CreateTravelEventFormData } from '../../lib/validation';
import { useAddTravelEvent, useUpdateShipment } from '../../api/shipmentApi';
import type { Shipment } from '../../types/api';
import { apiClient } from '../../lib/api';
import { ResponsiveDrawer } from '../ui/ResponsiveDrawer';
import TabbedContent from '../drawers/AddTrackingEventDrawer/TabbedContent';
import EditShipmentSlideIn from './EditShipmentSlideIn';
import { EditButton } from '../ui/EditButton';
import { CopyButton } from '../ui/CopyButton';

interface AddTrackingEventSlideInProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

export function AddTrackingEventSlideIn({
  isOpen,
  onClose,
  shipment
}: AddTrackingEventSlideInProps) {
  const addTravelEventMutation = useAddTravelEvent();
  const updateShipmentMutation = useUpdateShipment();
  const [currentTab, setCurrentTab] = useState<'add-status' | 'travel-history'>('add-status');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditingShipment, setIsEditingShipment] = useState(false);

  const form = useForm<CreateTravelEventFormData>({
    resolver: zodResolver(createTravelEventSchema) as any,
    defaultValues: {
      status: '',
      location: '',
      description: '',
    },
    mode: 'onSubmit', // Only validate on submit, not on every change
  });

  const { handleSubmit, reset, clearErrors } = form;

  const onSubmit = async (data: CreateTravelEventFormData) => {
    if (!shipment) return;

    try {
      // Map status to a valid eventType for backend validation
      const getEventType = (status: string): 'picked-up' | 'in-transit' | 'delivered' | 'exception' | 'out-for-delivery' | 'attempted-delivery' | 'at-facility' | 'customs-clearance' | 'returned' => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('picked') || statusLower.includes('pickup')) return 'picked-up';
        if (statusLower.includes('delivered')) return 'delivered';
        if (statusLower.includes('exception') || statusLower.includes('error') || statusLower.includes('failed')) return 'exception';
        if (statusLower.includes('out for delivery')) return 'out-for-delivery';
        if (statusLower.includes('attempted')) return 'attempted-delivery';
        if (statusLower.includes('facility') || statusLower.includes('warehouse')) return 'at-facility';
        if (statusLower.includes('customs')) return 'customs-clearance';
        if (statusLower.includes('returned')) return 'returned';
        return 'in-transit'; // default for any custom status
      };

      const eventData = {
        ...data,
        eventType: getEventType(data.status)
      };

      const newEvent = await addTravelEventMutation.mutateAsync({
        shipmentId: shipment.id,
        data: eventData
      });

      // Handle file uploads if any
      if (selectedFiles.length > 0 && newEvent) {
        setIsUploadingFiles(true);
        
        // Upload files sequentially
        for (const file of selectedFiles) {
          console.log('Uploading file:', file.name, file.size, file.type);
          
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${apiClient.baseURL}/events/${newEvent.id}/files`, {
            method: 'POST',
            body: formData,
          });

          console.log('Upload response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to upload file:', file.name, 'Error:', errorText);
          } else {
            const responseData = await response.json();
            console.log('File uploaded successfully:', file.name, responseData);
          }
        }
        
        setIsUploadingFiles(false);
      }

      // Success - reset form but don't close
      reset();
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Failed to add travel event:', error);
      setIsUploadingFiles(false);
    }
  };

  const handleTabChange = (tab: 'add-status' | 'travel-history') => {
    // Clear any validation errors when switching tabs
    clearErrors();
    setCurrentTab(tab);
  };

  const handleClose = () => {
    reset();
    setSelectedFiles([]);
    setCurrentTab('add-status'); // Reset to add tab
    setCopied(false); // Reset copied state
    onClose();
  };

  const handleCopyLink = async () => {
    if (!shipment) return;
    
    const trackingUrl = `${window.location.origin}/?trackid=${shipment.trackingNumber}`;
    
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.error('Failed to copy link:', err);
    }
  };

  const handleEditShipment = () => {
    setIsEditingShipment(true);
  };

  const handleCloseEditShipment = () => {
    setIsEditingShipment(false);
  };

  const handleUpdateShipment = async (data: any) => {
    if (!shipment) return;
    
    try {
      await updateShipmentMutation.mutateAsync({
        shipmentId: shipment.id,
        data: {
          company: data.company || undefined,
          pieces: data.pieces,
          weight: data.weight || undefined,
          weightUnit: data.weightUnit,
          origin: data.origin,
          destination: data.destination,
        }
      });
      setIsEditingShipment(false);
    } catch (error) {
      console.error('Failed to update shipment:', error);
    }
  };

  const isSubmitting = addTravelEventMutation.isPending || isUploadingFiles;

  return (
    <ResponsiveDrawer
      isOpen={isOpen}
      onClose={handleClose}
      width="w-screen sm:max-w-[65vw]" // Same width as CreateShipment
      zIndex={40} // Lower z-index so EditEvent can layer on top
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-6 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Add Tracking Event
                </h2>
                {shipment && (
                  <p className="text-sm text-gray-500 mt-1">
                    Update status for shipment {shipment.trackingNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={handleClose}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Shipment Details */}
          {shipment && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Shipment Details</h4>
                <div className="flex items-center space-x-2">
                  <EditButton onClick={handleEditShipment} />
                  <CopyButton onClick={handleCopyLink} copied={copied} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Route:</span>
                  <p className="font-medium text-gray-900 truncate">{shipment.origin} → {shipment.destination}</p>
                </div>
                <div>
                  <span className="text-gray-500">Company:</span>
                  <p className="font-medium text-gray-900 truncate">{shipment.company || 'N/A'}</p>
                </div>
                <div className="sm:col-span-1 col-span-2">
                  <span className="text-gray-500">Details:</span>
                  <p className="font-medium text-gray-900">{shipment.weight > 0 ? `${shipment.weight} ${shipment.weightUnit || 'kg'}` : 'Weight not specified'} • {shipment.pieces} piece{shipment.pieces !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {shipment && (
          <TabbedContent
            form={form}
            shipment={shipment}
            error={addTravelEventMutation.error}
            onTabChange={handleTabChange}
            selectedFiles={selectedFiles}
            onFilesChange={setSelectedFiles}
          />
        )}

        {/* Footer - Only show on Add Status tab */}
        {currentTab === 'add-status' && (
          <div className="flex-shrink-0 px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {isSubmitting ? 'Adding Tracking Event...' : 'Add Tracking Event'}
            </button>
          </div>
        )}
      </form>

      {/* Edit Shipment Slide-in */}
      <EditShipmentSlideIn
        shipment={shipment}
        isOpen={isEditingShipment}
        onClose={handleCloseEditShipment}
        onSubmit={handleUpdateShipment}
        isLoading={updateShipmentMutation.isPending}
      />
    </ResponsiveDrawer>
  );
}

export default AddTrackingEventSlideIn;