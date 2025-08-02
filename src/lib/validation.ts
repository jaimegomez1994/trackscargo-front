import { z } from 'zod';

// Shipment creation form schema
export const createShipmentSchema = z.object({
  // Basic Info (Step 1)
  trackingNumber: z
    .string()
    .min(3, 'Tracking number must be at least 3 characters')
    .max(50, 'Tracking number is too long')
    .regex(/^[A-Za-z0-9-_]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
  
  company: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform(val => val || undefined),
  
  weight: z
    .number()
    .min(0.1, 'Weight must be greater than 0')
    .max(10000, 'Weight is too large'),
  
  pieces: z
    .number()
    .int()
    .min(1, 'Must have at least 1 piece')
    .max(999, 'Too many pieces'),

  // Route Details (Step 2)
  origin: z
    .string()
    .min(2, 'Origin location is required')
    .max(100, 'Origin location is too long'),
  
  destination: z
    .string()
    .min(2, 'Destination location is required')
    .max(100, 'Destination location is too long'),

  // Status (Step 3)
  status: z
    .string()
    .min(1, 'Status is required'),

  // Optional fields
  description: z
    .string()
    .max(255, 'Description is too long')
    .optional()
    .or(z.literal(''))
    .transform(val => val || undefined),
});

export type CreateShipmentFormData = z.infer<typeof createShipmentSchema>;

// Common locations for auto-complete
export const commonLocations = [
  // Major US Cities
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'San Francisco, CA',
  'Indianapolis, IN',
  'Seattle, WA',
  'Denver, CO',
  'Washington, DC',
  'Boston, MA',
  'El Paso, TX',
  'Nashville, TN',
  'Detroit, MI',
  'Oklahoma City, OK',
  'Portland, OR',
  'Las Vegas, NV',
  'Memphis, TN',
  'Louisville, KY',
  'Baltimore, MD',
  'Milwaukee, WI',
  'Albuquerque, NM',
  'Tucson, AZ',
  'Fresno, CA',
  'Sacramento, CA',
  'Mesa, AZ',
  'Kansas City, MO',
  'Atlanta, GA',
  'Long Beach, CA',
  'Colorado Springs, CO',
  'Raleigh, NC',
  'Miami, FL',
  'Virginia Beach, VA',
  'Omaha, NE',
  'Oakland, CA',
  'Minneapolis, MN',
  'Tulsa, OK',
  'Arlington, TX',
  'Tampa, FL',
  'New Orleans, LA',
  
  // Major International Cities
  'Toronto, ON, Canada',
  'Vancouver, BC, Canada',
  'Montreal, QC, Canada',
  'London, UK',
  'Paris, France',
  'Berlin, Germany',
  'Amsterdam, Netherlands',
  'Brussels, Belgium',
  'Madrid, Spain',
  'Rome, Italy',
  'Tokyo, Japan',
  'Seoul, South Korea',
  'Hong Kong',
  'Singapore',
  'Sydney, Australia',
  'Melbourne, Australia',
  'Mexico City, Mexico',
  'Guadalajara, Mexico',
  'São Paulo, Brazil',
  'Buenos Aires, Argentina',
];

// Common carriers/companies
export const commonCarriers = [
  'FedEx',
  'UPS',
  'DHL',
  'USPS',
  'Amazon Logistics',
  'OnTrac',
  'LaserShip',
  'Canada Post',
  'Purolator',
  'TNT',
  'Aramex',
  'Blue Dart',
  'SF Express',
  'China Post',
  'Japan Post',
  'Royal Mail',
  'Deutsche Post',
  'La Poste',
  'Correos',
  'PostNL',
  'Australia Post',
  'Correo Argentino',
  'Other',
];

// Common statuses
export const shipmentStatuses = [
  { value: 'picked-up', label: 'Picked Up', description: 'Package collected from sender' },
  { value: 'in-transit', label: 'In Transit', description: 'Package is on its way' },
  { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Package is being delivered' },
  { value: 'delivered', label: 'Delivered', description: 'Package delivered successfully' },
  { value: 'exception', label: 'Exception', description: 'Delivery issue occurred' },
  { value: 'returned', label: 'Returned', description: 'Package returned to sender' },
];

// Travel event creation form schema
export const createTravelEventSchema = z.object({
  status: z
    .string()
    .min(1, 'Status is required'),
  
  location: z
    .string()
    .min(2, 'Location is required')
    .max(100, 'Location is too long'),
  
  description: z
    .string()
    .optional()
    .transform(val => val === '' || val === undefined ? undefined : val)
    .refine(val => val === undefined || val.length <= 255, {
      message: 'Description is too long'
    }),
});

export type CreateTravelEventFormData = z.infer<typeof createTravelEventSchema>;