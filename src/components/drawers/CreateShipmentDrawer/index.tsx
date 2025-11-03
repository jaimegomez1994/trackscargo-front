import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createShipmentSchema } from '../../../lib/validation';
import type { CreateShipmentFormData } from '../../../lib/validation';
import { useCreateShipment } from '../../../api/shipmentApi';
import { ResponsiveDrawer } from '../../ui/ResponsiveDrawer';
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
      status: 'created',
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
        weight: data.weight || undefined,
        pieces: data.pieces!, // pieces is required by validation, so we know it exists
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
    <ResponsiveDrawer
      isOpen={isOpen}
      onClose={handleClose}
      width="w-screen sm:max-w-[65vw]" // Match original drawer width
      zIndex={50}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
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
    </ResponsiveDrawer>
  );
}

export default CreateShipmentDrawer;