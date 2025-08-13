import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TravelEvent, UpdateTravelEventRequest } from '../../types/api';
import { Button } from '../ui/primitives/Button';
import { Input } from '../ui/primitives/Input';
import { FormField } from '../ui/primitives/FormField';

// Validation schema
const editEventSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  eventType: z.enum([
    'picked-up',
    'in-transit', 
    'delivered',
    'exception',
    'out-for-delivery',
    'attempted-delivery',
    'at-facility',
    'customs-clearance',
    'returned'
  ])
});

type EditEventFormData = z.infer<typeof editEventSchema>;

interface EditEventModalProps {
  event: TravelEvent;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateTravelEventRequest) => void;
  isLoading?: boolean;
}

export default function EditEventModal({
  event,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: EditEventModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      status: event.status,
      location: event.location,
      description: event.description || '',
      eventType: event.type
    }
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Reset form with current event data
      reset({
        status: event.status,
        location: event.location,
        description: event.description || '',
        eventType: event.type
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen, event, reset]);

  const handleFormSubmit = (data: EditEventFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-white/10 transition-opacity duration-200"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-200 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Event</h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <FormField label="Status" error={errors.status?.message} required>
            <Input
              {...register('status')}
              placeholder="e.g., Delivered, In Transit, Exception"
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Location" error={errors.location?.message} required>
            <Input
              {...register('location')}
              placeholder="e.g., New York Distribution Center"
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <Input
              {...register('description')}
              placeholder="Optional additional details"
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Event Type" error={errors.eventType?.message} required>
            <select
              {...register('eventType')}
              disabled={isLoading}
              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="picked-up">Picked Up</option>
              <option value="in-transit">In Transit</option>
              <option value="at-facility">At Facility</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="attempted-delivery">Attempted Delivery</option>
              <option value="exception">Exception</option>
              <option value="customs-clearance">Customs Clearance</option>
              <option value="returned">Returned</option>
            </select>
          </FormField>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}