import type { UseFormReturn } from 'react-hook-form';
import type { CreateTravelEventFormData } from '../../../lib/validation';
import { commonLocations, trackingEventStatuses } from '../../../lib/validation';
import { useState, useRef } from 'react';

interface EventFormProps {
  form: UseFormReturn<CreateTravelEventFormData>;
  selectedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
}

function EventForm({ form, selectedFiles: externalFiles, onFilesChange }: EventFormProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>(externalFiles || []);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusValue = watch('status') || '';
  const locationValue = watch('location') || '';

  const filteredStatuses = trackingEventStatuses.filter(status =>
    status.toLowerCase().includes(statusFilter.toLowerCase())
  );

  const filteredLocations = commonLocations.filter(location =>
    location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const handleStatusSelect = (status: string) => {
    setValue('status', status);
    setShowStatusDropdown(false);
    setStatusFilter('');
  };

  const handleStatusInputChange = (value: string) => {
    setValue('status', value);
    setStatusFilter(value);
    setShowStatusDropdown(value.length > 0);
  };

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

  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="space-y-6">
        {/* Status */}
        <div className="relative">
          <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="status"
              value={statusValue}
              onChange={(e) => handleStatusInputChange(e.target.value)}
              onFocus={() => setShowStatusDropdown(true)}
              autoComplete="off"
              className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.status ? 'border-red-300' : ''
              }`}
              placeholder="In Transit"
            />
            
            {/* Status Dropdown */}
            {showStatusDropdown && filteredStatuses.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                {filteredStatuses.map((status) => (
                  <div
                    key={status}
                    className="cursor-pointer select-none relative py-3 px-4 hover:bg-primary hover:text-white transition-colors"
                    onClick={() => handleStatusSelect(status)}
                  >
                    <span className="block truncate font-normal">{status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.status && (
            <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
          )}
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
                    className="cursor-pointer select-none relative py-3 px-4 hover:bg-primary hover:text-white transition-colors"
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
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Attachments (Optional)
          </label>
          
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.csv,.xls,.xlsx"
            />
            
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary-dark cursor-pointer hover:underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Click to upload
                </button>
                <span> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, TXT, Images up to 10MB
              </p>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Selected Files ({selectedFiles.length})
              </h4>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showStatusDropdown || showLocationDropdown) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowStatusDropdown(false);
            setShowLocationDropdown(false);
          }}
        />
      )}
    </>
  );
}

export default EventForm;