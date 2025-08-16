import type { UseFormReturn } from 'react-hook-form';
import type { CreateShipmentFormData } from '../../../lib/validation';
import { commonLocations } from '../../../lib/validation';
import { useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectAuth } from '../../../store/slices/authSlice';
import { generateOrgInitials } from '../../../lib/trackingUtils';

interface FormFieldsProps {
  form: UseFormReturn<CreateShipmentFormData>;
}

function FormFields({ form }: FormFieldsProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const { organization } = useAppSelector(selectAuth);
  
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [originFilter, setOriginFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');

  const originValue = watch('origin') || '';
  const destinationValue = watch('destination') || '';
  
  // Generate organization initials for prefix display
  const orgInitials = organization?.name ? generateOrgInitials(organization.name) : '';

  // Filter functions
  const filteredOriginLocations = commonLocations.filter(location =>
    location.toLowerCase().includes(originFilter.toLowerCase())
  );

  const filteredDestinationLocations = commonLocations.filter(location =>
    location.toLowerCase().includes(destinationFilter.toLowerCase())
  );

  const handleOriginSelect = (location: string) => {
    setValue('origin', location);
    setShowOriginDropdown(false);
    setOriginFilter('');
  };

  const handleOriginInputChange = (value: string) => {
    setValue('origin', value);
    setOriginFilter(value);
    setShowOriginDropdown(value.length > 0);
  };

  const handleDestinationSelect = (location: string) => {
    setValue('destination', location);  
    setShowDestinationDropdown(false);
    setDestinationFilter('');
  };

  const handleDestinationInputChange = (value: string) => {
    setValue('destination', value);
    setDestinationFilter(value);
    setShowDestinationDropdown(value.length > 0);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Tracking Number - Full Width */}
        <div>
          <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-900 mb-2">
            Tracking Number <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <div className="relative">
              {orgInitials && (
                <div className="absolute left-4 top-0 h-full flex items-center text-gray-400 font-mono text-base pointer-events-none z-10">
                  {orgInitials}-
                </div>
              )}
              <input
                {...register('trackingNumber')}
                type="text"
                id="trackingNumber"
                className={`block w-full py-3 text-base font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  errors.trackingNumber ? 'border-red-300' : ''
                } pr-4`}
                placeholder={orgInitials ? "123" : "TRK123456789"}
                style={{
                  paddingLeft: orgInitials ? `${(orgInitials.length + 2) * 8 + 16}px` : '16px'
                }}
              />
            </div>
          </div>
          {errors.trackingNumber && (
            <p className="mt-2 text-sm text-red-600">{errors.trackingNumber.message}</p>
          )}
        </div>

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
        </div>

        {/* Total Pieces and Weight - Same Line */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pieces" className="block text-sm font-medium text-gray-900 mb-2">
              Total Pieces <span className="text-red-500">*</span>
            </label>
            <input
              {...register('pieces', { valueAsNumber: true })}
              type="text"
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
              {...register('weight', { valueAsNumber: true })}
              type="text"
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
        <div className="relative">
          <label htmlFor="origin" className="block text-sm font-medium text-gray-900 mb-2">
            Origin <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="origin"
              value={originValue}
              onChange={(e) => handleOriginInputChange(e.target.value)}
              onFocus={() => setShowOriginDropdown(true)}
              className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.origin ? 'border-red-300' : ''
              }`}
              placeholder="New York, NY"
            />
            
            {/* Origin Dropdown */}
            {showOriginDropdown && filteredOriginLocations.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                {filteredOriginLocations.slice(0, 10).map((location) => (
                  <div
                    key={location}
                    className="cursor-pointer select-none relative py-3 px-4 hover:bg-primary hover:text-white transition-colors"
                    onClick={() => handleOriginSelect(location)}
                  >
                    <span className="block truncate font-normal">{location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.origin && (
            <p className="mt-2 text-sm text-red-600">{errors.origin.message}</p>
          )}
        </div>

        {/* Destination - Full Width */}
        <div className="relative">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-900 mb-2">
            Destination <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="destination"
              value={destinationValue}
              onChange={(e) => handleDestinationInputChange(e.target.value)}
              onFocus={() => setShowDestinationDropdown(true)}
              className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.destination ? 'border-red-300' : ''
              }`}
              placeholder="Los Angeles, CA"
            />
            
            {/* Destination Dropdown */}
            {showDestinationDropdown && filteredDestinationLocations.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                {filteredDestinationLocations.slice(0, 10).map((location) => (
                  <div
                    key={location}
                    className="cursor-pointer select-none relative py-3 px-4 hover:bg-primary hover:text-white transition-colors"
                    onClick={() => handleDestinationSelect(location)}
                  >
                    <span className="block truncate font-normal">{location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.destination && (
            <p className="mt-2 text-sm text-red-600">{errors.destination.message}</p>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showOriginDropdown || showDestinationDropdown) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowOriginDropdown(false);
            setShowDestinationDropdown(false);
          }}
        />
      )}
    </>
  );
}

export default FormFields;