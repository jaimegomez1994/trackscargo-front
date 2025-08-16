// Shared API types
export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
  company?: string;
  travelHistory: TravelEvent[];
}

export interface TravelEvent {
  id: string;
  status: string;
  location: string;
  description?: string;
  timestamp: string;
}

export interface CreateShipmentRequest {
  trackingNumber: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
  company?: string;
  description?: string;
}

export interface CreateTravelEventRequest {
  status: string;
  location: string;
  description?: string;
  eventType: 'picked-up' | 'in-transit' | 'delivered' | 'exception' | 'out-for-delivery' | 'attempted-delivery' | 'at-facility' | 'customs-clearance' | 'returned';
}

export interface UpdateTravelEventRequest {
  status?: string;
  location?: string;
  description?: string;
  timestamp?: string;
  eventType?: 'picked-up' | 'in-transit' | 'delivered' | 'exception' | 'out-for-delivery' | 'attempted-delivery' | 'at-facility' | 'customs-clearance' | 'returned';
}

export interface ShipmentsResponse {
  shipments: Shipment[];
}