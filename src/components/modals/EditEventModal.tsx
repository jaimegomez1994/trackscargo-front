import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TravelEvent, UpdateTravelEventRequest } from '../../types/api';
import { Button } from '../ui/primitives/Button';
import { Input } from '../ui/primitives/Input';
import { FormField } from '../ui/primitives/FormField';
import { StatusDropdown } from '../ui/StatusDropdown';

// Validation schema
const editEventSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  timestamp: z.string().min(1, 'Date and time is required'),
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

  // Helper function to format timestamp for datetime-local input
  const formatTimestampForInput = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      // datetime-local format: YYYY-MM-DDTHH:mm
      return date.toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      status: event.status,
      location: event.location,
      description: event.description || '',
      timestamp: formatTimestampForInput(event.timestamp)
    }
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const statusValue = watch('status') || '';

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Reset form with current event data
      reset({
        status: event.status,
        location: event.location,
        description: event.description || '',
        timestamp: formatTimestampForInput(event.timestamp)
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen, event, reset]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (datePickerTimeoutRef.current) {
        clearTimeout(datePickerTimeoutRef.current);
      }
    };
  }, []);


  const handleFormSubmit = (data: EditEventFormData) => {
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

    // Convert datetime-local back to ISO timestamp
    const formattedData = {
      ...data,
      timestamp: new Date(data.timestamp).toISOString(),
      eventType: getEventType(data.status)
    };
    onSubmit(formattedData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleBackdropClick = () => {
    // Don't close modal if date picker is open
    if (isDatePickerOpen) {
      setIsDatePickerOpen(false); // Just close the date picker
      return;
    }
    handleClose();
  };

  const handleDatePickerFocus = () => {
    if (datePickerTimeoutRef.current) {
      clearTimeout(datePickerTimeoutRef.current);
    }
    setIsDatePickerOpen(true);
  };

  const handleDatePickerBlur = () => {
    // Use a small delay to allow the backdrop click to check the state
    datePickerTimeoutRef.current = setTimeout(() => {
      setIsDatePickerOpen(false);
    }, 100);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-white/10 transition-opacity duration-200"
        onClick={handleBackdropClick}
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
            <StatusDropdown
              value={statusValue}
              onChange={(value) => setValue('status', value)}
              disabled={isLoading}
              error={errors.status?.message}
            />
          </FormField>

          <FormField label="Location" error={errors.location?.message} required>
            <Input
              {...register('location')}
              placeholder="e.g., New York Distribution Center"
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Date & Time" error={errors.timestamp?.message} required>
            <input
              type="datetime-local"
              {...register('timestamp')}
              disabled={isLoading}
              onFocus={handleDatePickerFocus}
              onBlur={handleDatePickerBlur}
              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <Input
              {...register('description')}
              placeholder="Optional additional details"
              disabled={isLoading}
            />
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

    </div>,
    document.body
  );
}