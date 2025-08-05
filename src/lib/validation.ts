import { z } from 'zod';
import locationsData from '../data/locations.json';

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

// Common locations for auto-complete (combined from JSON data)
export const commonLocations = [
  ...locationsData.usa.map(location => location.name),
  ...locationsData.mexico.map(location => location.name),
].sort();

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

// Tracking event statuses for detailed tracking
export const trackingEventStatuses = [
  'Picked Up',
  'At Origin Facility',
  'In Transit to Distribution Center',
  'At Distribution Center',
  'Departed Facility',
  'In Transit',
  'Arrived at Facility',
  'Out for Delivery',
  'Delivered',
  'Exception',
  'Delivery Attempted',
  'Customer Not Available',
  'Weather Delay',
  'Mechanical Delay',
  'Address Correction Required',
  'Package Damaged',
  'Returned to Sender',
  'Held at Location'
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
    .max(255, 'Description is too long')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
});

export type CreateTravelEventFormData = z.infer<typeof createTravelEventSchema>;