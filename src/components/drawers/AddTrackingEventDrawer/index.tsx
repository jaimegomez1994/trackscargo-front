import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTravelEventSchema } from '../../../lib/validation';
import type { CreateTravelEventFormData } from '../../../lib/validation';
import { useAddTravelEvent } from '../../../api/shipmentApi';
import type { Shipment } from '../../../types/api';
import DrawerHeader from './DrawerHeader';
import TabbedContent from './TabbedContent';
import DrawerFooter from './DrawerFooter';

interface AddTrackingEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

function AddTrackingEventDrawer({ isOpen, onClose, shipment }: AddTrackingEventDrawerProps) {
  const addTravelEventMutation = useAddTravelEvent();

  const form = useForm<CreateTravelEventFormData>({
    resolver: zodResolver(createTravelEventSchema),
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
      await addTravelEventMutation.mutateAsync({
        shipmentId: shipment.id,
        data: {
          status: data.status,
          location: data.location,
          eventType: 'in-transit', // Default event type
          description: data.description || undefined,
        },
      });
      
      // Success - close drawer and reset form
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to add tracking event:', error);
    }
  };

  const handleClose = () => {
    reset();
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
                    />

                    <DrawerFooter isSubmitting={addTravelEventMutation.isPending} />
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