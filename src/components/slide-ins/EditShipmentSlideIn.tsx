import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResponsiveDrawer } from '../ui/ResponsiveDrawer';
import { OriginDropdown } from '../ui/OriginDropdown';
import { DestinationDropdown } from '../ui/DestinationDropdown';
import type { Shipment, UpdateShipmentRequest } from '../../types/api';

// Validation schema for editing shipment (excluding tracking number)
const editShipmentSchema = z.object({
  company: z.string().optional(),
  pieces: z.number().int().min(1, 'Total pieces must be at least 1'),
  weight: z.number().min(0, 'Weight must be non-negative').optional(),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
});

type EditShipmentFormData = z.infer<typeof editShipmentSchema>;

interface EditShipmentSlideInProps {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateShipmentRequest) => void;
  isLoading?: boolean;
}

export function EditShipmentSlideIn({
  shipment,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: EditShipmentSlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<EditShipmentFormData>({
    resolver: zodResolver(editShipmentSchema),
    defaultValues: {
      company: '',
      pieces: 1,
      weight: 0,
      origin: '',
      destination: '',
    }
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = form;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (shipment && isOpen) {
      reset({
        company: shipment.company || '',
        pieces: shipment.pieces || 1,
        weight: shipment.weight || 0,
        origin: shipment.origin || '',
        destination: shipment.destination || '',
      });
    }
  }, [shipment, isOpen, reset]);

  const originValue = watch('origin') || '';
  const destinationValue = watch('destination') || '';

  const handleFormSubmit = (data: EditShipmentFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!shipment || !isVisible) return null;

  return (
    <ResponsiveDrawer
      isOpen={isOpen}
      onClose={handleClose}
      width="w-screen sm:max-w-[65vw]" // Same width as Create Shipment
      zIndex={80} // Higher than EditEvent (60) and AddTracking (40)
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-6 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Edit Shipment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update details for {shipment.trackingNumber}
                </p>
              </div>
            </div>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={handleClose}
                disabled={isLoading}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6">
            <div className="space-y-6">
              {/* Shipper - Full Width */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                  Shipper
                </label>
                <input
                  {...register('company')}
                  type="text"
                  id="company"
                  className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="ABC Logistics Inc."
                />
                {errors.company && (
                  <p className="mt-2 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              {/* Total Pieces and Weight - Same Line */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pieces" className="block text-sm font-medium text-gray-900 mb-2">
                    Total Pieces <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('pieces', { 
                      setValueAs: (value) => {
                        if (value === '' || value == null) return '';
                        const num = Number(value);
                        return isNaN(num) ? value : num;
                      }
                    })}
                    type="number"
                    id="pieces"
                    className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.pieces ? 'border-red-300' : ''
                    }`}
                    placeholder="1"
                  />
                  {errors.pieces && (
                    <p className="mt-2 text-sm text-red-600">{errors.pieces.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-900 mb-2">
                    Weight
                  </label>
                  <input
                    {...register('weight', { 
                      setValueAs: (value) => {
                        if (value === '' || value == null) return '';
                        const num = Number(value);
                        return isNaN(num) ? value : num;
                      }
                    })}
                    type="number"
                    id="weight"
                    className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.weight ? 'border-red-300' : ''
                    }`}
                    placeholder="2.5 lbs"
                  />
                  {errors.weight && (
                    <p className="mt-2 text-sm text-red-600">{errors.weight.message}</p>
                  )}
                </div>
              </div>

              {/* Origin - Full Width */}
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-900 mb-2">
                  Origin <span className="text-red-500">*</span>
                </label>
                <OriginDropdown
                  value={originValue}
                  onChange={(value) => setValue('origin', value)}
                  error={errors.origin?.message}
                />
              </div>

              {/* Destination - Full Width */}
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-900 mb-2">
                  Destination <span className="text-red-500">*</span>
                </label>
                <DestinationDropdown
                  value={destinationValue}
                  onChange={(value) => setValue('destination', value)}
                  error={errors.destination?.message}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md bg-primary py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </ResponsiveDrawer>
  );
}

export default EditShipmentSlideIn;