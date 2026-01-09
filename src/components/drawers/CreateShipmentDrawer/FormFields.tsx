import type { UseFormReturn } from 'react-hook-form';
import type { CreateShipmentFormData } from '../../../lib/validation';
import { useAppSelector } from '../../../store/hooks';
import { selectAuth } from '../../../store/slices/authSlice';
import { generateOrgInitials } from '../../../lib/trackingUtils';
import { OriginDropdown } from '../../ui/OriginDropdown';
import { DestinationDropdown } from '../../ui/DestinationDropdown';

interface FormFieldsProps {
  form: UseFormReturn<CreateShipmentFormData>;
}

function FormFields({ form }: FormFieldsProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const { organization } = useAppSelector(selectAuth);
  
  const originValue = watch('origin') || '';
  const destinationValue = watch('destination') || '';
  
  // Generate organization initials for prefix display
  const orgInitials = organization?.name ? generateOrgInitials(organization.name) : '';

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

        {/* Trailer - Full Width */}
        <div>
          <label htmlFor="trailer" className="block text-sm font-medium text-gray-900 mb-2">
            Trailer
          </label>
          <input
            {...register('trailer')}
            type="text"
            id="trailer"
            className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="T-12345"
          />
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
            <div className="flex gap-2">
              <input
                {...register('weight', {
                  setValueAs: (value) => {
                    if (value === '' || value == null) return '';
                    const num = Number(value);
                    return isNaN(num) ? value : num;
                  }
                })}
                type="number"
                step="any"
                id="weight"
                className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  errors.weight ? 'border-red-300' : ''
                }`}
                placeholder="2.5"
              />
              <select
                {...register('weightUnit')}
                className="px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-white"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
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

        {/* Pickup Date and Delivery Date - Same Line */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-900 mb-2">
              Pickup Date
            </label>
            <input
              {...register('pickupDate')}
              type="date"
              id="pickupDate"
              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-900 mb-2">
              Delivery Date
            </label>
            <input
              {...register('deliveryDate')}
              type="date"
              id="deliveryDate"
              className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* GPS Tracking URL - Full Width */}
        <div>
          <label htmlFor="gpsTrackingUrl" className="block text-sm font-medium text-gray-900 mb-2">
            GPS Tracking URL
          </label>
          <input
            {...register('gpsTrackingUrl')}
            type="url"
            id="gpsTrackingUrl"
            className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.gpsTrackingUrl ? 'border-red-300' : ''
            }`}
            placeholder="https://..."
          />
          {errors.gpsTrackingUrl && (
            <p className="mt-2 text-sm text-red-600">{errors.gpsTrackingUrl.message}</p>
          )}
        </div>
      </div>

    </>
  );
}

export default FormFields;