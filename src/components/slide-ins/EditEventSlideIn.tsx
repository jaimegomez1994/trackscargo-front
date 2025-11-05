import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { ResponsiveDrawer } from '../ui/ResponsiveDrawer';
import { StatusDropdown } from '../ui/StatusDropdown';
import { OriginDropdown } from '../ui/OriginDropdown';
import { FileUploadZone } from '../ui/FileUploadZone';
import EventFiles from '../EventFiles';
import { apiClient } from '../../lib/api';
import type { TravelEvent, UpdateTravelEventRequest } from '../../types/api';

// Form validation schema for editing events
const editEventSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  timestamp: z.string().min(1, 'Date and time is required')
});

type EditEventFormData = z.infer<typeof editEventSchema>;

interface EditEventSlideInProps {
  event: TravelEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateTravelEventRequest) => void;
  isLoading?: boolean;
}

export function EditEventSlideIn({
  event,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: EditEventSlideInProps) {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const form = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      status: '',
      location: '',
      description: '',
      timestamp: ''
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
    if (event && isOpen) {
      // Convert ISO timestamp to datetime-local format
      const eventDate = new Date(event.timestamp);
      const localDateTime = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      reset({
        status: event.status || '',
        location: event.location || '',
        description: event.description || '',
        timestamp: localDateTime
      });
    }
  }, [event, isOpen, reset]);

  const statusValue = watch('status') || '';

  const handleFormSubmit = async (data: EditEventFormData) => {
    if (!event) return;

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

      // Convert datetime-local back to ISO timestamp
      const formattedData = {
        ...data,
        timestamp: new Date(data.timestamp).toISOString(),
        eventType: getEventType(data.status)
      };

      // First update the event
      onSubmit(formattedData);

      // Then upload files if any are selected
      if (selectedFiles.length > 0) {
        setIsUploadingFiles(true);

        // Upload files sequentially
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${apiClient.baseURL}/events/${event.id}/files`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            console.error('Failed to upload file:', file.name);
          }
        }

        // Invalidate the event files cache to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['eventFiles', event.id] });

        setIsUploadingFiles(false);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      setIsUploadingFiles(false);
    }
  };

  const handleClose = () => {
    if (!isLoading && !isUploadingFiles) {
      setSelectedFiles([]);
      onClose();
    }
  };


  if (!event || !isVisible) return null;

  return (
    <ResponsiveDrawer
      isOpen={isOpen}
      onClose={handleClose}
      width="w-96" // Smaller width for edit form
      zIndex={60} // Higher z-index to layer on top of AddTrackingEvent
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-6 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Edit Event
              </h2>
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
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="space-y-6">
            {/* Status Field */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <StatusDropdown
                value={statusValue}
                onChange={(value) => setValue('status', value)}
                error={errors.status?.message}
                placeholder="Select or enter status"
              />
            </div>

            {/* Location Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <OriginDropdown
                value={watch('location') || ''}
                onChange={(value) => setValue('location', value)}
                error={errors.location?.message}
              />
            </div>

            {/* Date and Time Field */}
            <div>
              <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
                Date and Time <span className="text-red-500">*</span>
              </label>
              <input
                {...register('timestamp')}
                type="datetime-local"
                id="timestamp"
                className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  errors.timestamp ? 'border-red-300' : ''
                }`}
              />
              {errors.timestamp && (
                <p className="mt-2 text-sm text-red-600">{errors.timestamp.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={3}
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                placeholder="Optional description"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Existing Files */}
            <div>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">Current Attachments</h3>
              <EventFiles eventId={event.id} allowDelete={true} />
            </div>

            {/* Upload New Files */}
            <FileUploadZone
              selectedFiles={selectedFiles}
              onFilesChange={setSelectedFiles}
            />
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
              disabled={isLoading || isUploadingFiles}
              className="inline-flex justify-center rounded-md bg-primary py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {isUploadingFiles ? 'Uploading Files...' : isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </ResponsiveDrawer>
  );
}

export default EditEventSlideIn;