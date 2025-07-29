export type TabType = "shipments" | "create" | "status";

export type TravelEventType = "delivered" | "picked-up" | "in-transit";

export type TravelEvent = {
  id: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
  type: TravelEventType;
};

export type Shipment = {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
  travelHistory?: TravelEvent[];
};

export type CreateShipmentForm = {
  trackingNumber: string;
  weight: string;
  totalPieces: string;
  origin: string;
  destination: string;
  company: string;
};

export type StatusForm = {
  selectedShipment: string;
  status: string;
  location: string;
  description: string;
};