import type { UseFormReturn } from 'react-hook-form';
import type { CreateTravelEventFormData } from '../../../lib/validation';
import { commonLocations } from '../../../lib/validation';
import { StatusDropdown } from '../../ui/StatusDropdown';
import { FileUploadZone } from '../../ui/FileUploadZone';
import { useState } from 'react';

interface EventFormProps {
  form: UseFormReturn<CreateTravelEventFormData>;
  selectedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
}

function EventForm({ form, selectedFiles = [], onFilesChange }: EventFormProps) {
  const { register, formState: { errors }, watch, setValue } = form;

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');

  const statusValue = watch('status') || '';
  const locationValue = watch('location') || '';

  const filteredLocations = commonLocations.filter(location =>
    location.toLowerCase().includes(locationFilter.toLowerCase())
  );


  const handleLocationSelect = (location: string) => {
    setValue('location', location);
    setShowLocationDropdown(false);
    setLocationFilter('');
  };

  const handleLocationInputChange = (value: string) => {
    setValue('location', value);
    setLocationFilter(value);
    setShowLocationDropdown(value.length > 0);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <StatusDropdown
            value={statusValue}
            onChange={(value) => setValue('status', value)}
            error={errors.status?.message}
          />
        </div>

        {/* Location */}
        <div className="relative">
          <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
            Current Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="location"
              value={locationValue}
              onChange={(e) => handleLocationInputChange(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              autoComplete="off"
              className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.location ? 'border-red-300' : ''
              }`}
              placeholder="Chicago, IL"
            />
            
            {/* Location Dropdown */}
            {showLocationDropdown && filteredLocations.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                {filteredLocations.slice(0, 10).map((location) => (
                  <div
                    key={location}
                    className="cursor-pointer select-none relative py-3 px-4 hover:bg-blue-600 hover:text-white transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <span className="block truncate font-normal">{location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.location && (
            <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Additional details about this tracking event..."
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* File Attachments */}
        {onFilesChange && (
          <FileUploadZone
            selectedFiles={selectedFiles}
            onFilesChange={onFilesChange}
          />
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {showLocationDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowLocationDropdown(false);
          }}
        />
      )}
    </>
  );
}

export default EventForm;