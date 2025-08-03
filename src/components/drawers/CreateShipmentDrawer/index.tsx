import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createShipmentSchema } from '../../../lib/validation';
import type { CreateShipmentFormData } from '../../../lib/validation';
import { useCreateShipment } from '../../../api/shipmentApi';
import DrawerHeader from './DrawerHeader';
import FormFields from './FormFields';
import ErrorDisplay from './ErrorDisplay';
import DrawerFooter from './DrawerFooter';

interface CreateShipmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateShipmentDrawer({ isOpen, onClose }: CreateShipmentDrawerProps) {
  const createShipmentMutation = useCreateShipment();

  const form = useForm<CreateShipmentFormData>({
    resolver: zodResolver(createShipmentSchema) as any,
    defaultValues: {
      trackingNumber: '',
      company: '',
      weight: 1,
      pieces: 1,
      origin: '',
      destination: '',
      status: 'picked-up',
      description: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset } = form;

  const onSubmit = async (data: CreateShipmentFormData) => {
    try {
      await createShipmentMutation.mutateAsync({
        trackingNumber: data.trackingNumber,
        company: data.company || undefined,
        weight: data.weight,
        pieces: data.pieces,
        origin: data.origin,
        destination: data.destination,
        status: data.status,
        description: data.description || undefined,
      });
      
      // Success - close drawer and reset form
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
                    <DrawerHeader onClose={handleClose} />

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-4 py-6 sm:px-6">
                        <FormFields form={form} />
                        <div className="mt-6">
                          <ErrorDisplay error={createShipmentMutation.error} />
                        </div>
                      </div>
                    </div>

                    <DrawerFooter isSubmitting={createShipmentMutation.isPending} />
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

export default CreateShipmentDrawer;