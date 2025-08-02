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
  type: 'picked-up' | 'in-transit' | 'delivered';
}

export interface CreateShipmentRequest {
  trackingNumber: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
  company?: string;
}

export interface CreateTravelEventRequest {
  status: string;
  location: string;
  description?: string;
  eventType: 'picked-up' | 'in-transit' | 'delivered';
}

export interface ShipmentsResponse {
  shipments: Shipment[];
}