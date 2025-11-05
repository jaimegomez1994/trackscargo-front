import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { createTravelEventSchema } from '../../../lib/validation';
import type { CreateTravelEventFormData } from '../../../lib/validation';
import { useAddTravelEvent } from '../../../api/shipmentApi';
import type { Shipment } from '../../../types/api';
import { apiClient } from '../../../lib/api';
import DrawerHeader from './DrawerHeader';
import TabbedContent from './TabbedContent';
import DrawerFooter from './DrawerFooter';

interface AddTrackingEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

function AddTrackingEventDrawer({ isOpen, onClose, shipment }: AddTrackingEventDrawerProps) {
  const queryClient = useQueryClient();
  const addTravelEventMutation = useAddTravelEvent();
  const [currentTab, setCurrentTab] = useState<'add-status' | 'travel-history'>('add-status');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const form = useForm<CreateTravelEventFormData>({
    resolver: zodResolver(createTravelEventSchema) as any,
    defaultValues: {
      status: '',
      location: '',
      description: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset } = form;

  const onSubmit = async (data: CreateTravelEventFormData) => {
    if (!shipment) return;

    try {
      // First, create the tracking event
      // Map status to a valid eventType for backend validation
      const getEventType = (status: string) => {
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

      const result = await addTravelEventMutation.mutateAsync({
        shipmentId: shipment.id,
        data: {
          status: data.status,
          location: data.location,
          description: data.description || undefined,
          eventType: getEventType(data.status),
        },
      });

      // Then upload files if any are selected  
      if (selectedFiles.length > 0 && result) {
        setIsUploadingFiles(true);
        console.log('Uploading files to event:', result.id);
        console.log('Selected files:', selectedFiles);

        // Upload files sequentially
        for (const file of selectedFiles) {
          console.log('Uploading file:', file.name, file.size, file.type);

          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${apiClient.baseURL}/events/${result.id}/files`, {
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

        // Invalidate the event files cache to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['eventFiles', result.id] });

        setIsUploadingFiles(false);
      }
      
      // Success - close drawer and reset form
      reset();
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Failed to add tracking event:', error);
      setIsUploadingFiles(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFiles([]);
    setCurrentTab('add-status'); // Reset to Add Status tab
    onClose();
  };

  if (!shipment) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0 transition-opacity" 
            style={{ backdropFilter: 'blur(0.8px)' }}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen sm:max-w-[65vw]">
                  <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col bg-white shadow-xl">
                    <DrawerHeader onClose={handleClose} shipment={shipment} />

                    {/* Tabbed Content */}
                    <TabbedContent 
                      form={form} 
                      shipment={shipment} 
                      error={addTravelEventMutation.error}
                      onTabChange={setCurrentTab}
                      selectedFiles={selectedFiles}
                      onFilesChange={setSelectedFiles}
                    />

                    {/* Footer - Only show on Add Status tab */}
                    {currentTab === 'add-status' && (
                      <DrawerFooter 
                        isSubmitting={addTravelEventMutation.isPending} 
                        isUploadingFiles={isUploadingFiles}
                        selectedFilesCount={selectedFiles.length}
                      />
                    )}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default AddTrackingEventDrawer;