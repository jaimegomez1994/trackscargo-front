import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { 
  Shipment, 
  TravelEvent, 
  CreateShipmentRequest, 
  CreateTravelEventRequest, 
  UpdateTravelEventRequest,
  ShipmentsResponse 
} from '../types/api';

// File types
export interface EventFile {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface EventFilesResponse {
  eventId: string;
  files: EventFile[];
}

export interface FileDownloadResponse {
  downloadUrl: string;
  expiresIn: number;
  originalName: string;
  size: number;
  mimeType: string;
}

// Re-export types for convenience
export type { 
  Shipment, 
  TravelEvent, 
  CreateShipmentRequest, 
  CreateTravelEventRequest, 
  UpdateTravelEventRequest,
  ShipmentsResponse 
};

// API functions
const shipmentApi = {
  getOrganizationShipments: (): Promise<ShipmentsResponse> =>
    apiClient.get('/shipments'),

  createShipment: (data: CreateShipmentRequest): Promise<Shipment> =>
    apiClient.post('/shipments', data),

  addTravelEvent: (shipmentId: string, data: CreateTravelEventRequest): Promise<TravelEvent> =>
    apiClient.post(`/shipments/${shipmentId}/events`, data),

  trackByNumber: (trackingNumber: string): Promise<Shipment> =>
    apiClient.get(`/track/${trackingNumber}`),

  updateTravelEvent: (eventId: string, data: UpdateTravelEventRequest): Promise<TravelEvent> =>
    apiClient.put(`/events/${eventId}`, data),

  deleteTravelEvent: (eventId: string): Promise<void> =>
    apiClient.delete(`/events/${eventId}`),

  // File management
  getEventFiles: (eventId: string): Promise<EventFilesResponse> =>
    apiClient.get(`/events/${eventId}/files`),

  getFileDownloadUrl: (fileId: string): Promise<FileDownloadResponse> =>
    apiClient.get(`/files/${fileId}/download`),

  deleteFile: (fileId: string): Promise<{ success: boolean }> =>
    apiClient.delete(`/files/${fileId}`),
};

// React Query hooks
export const useShipments = () => {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: shipmentApi.getOrganizationShipments,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shipmentApi.createShipment,
    onSuccess: () => {
      // Invalidate shipments list to refetch
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
};

export const useAddTravelEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shipmentId, data }: { shipmentId: string; data: CreateTravelEventRequest }) =>
      shipmentApi.addTravelEvent(shipmentId, data),
    onSuccess: () => {
      // Invalidate both shipments list and individual tracking
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['track'] });
    },
  });
};

export const useTrackShipment = (trackingNumber: string, enabled = true) => {
  return useQuery({
    queryKey: ['track', trackingNumber],
    queryFn: () => shipmentApi.trackByNumber(trackingNumber),
    enabled: enabled && !!trackingNumber,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// File management hooks
export const useEventFiles = (eventId: string, enabled = true) => {
  return useQuery({
    queryKey: ['eventFiles', eventId],
    queryFn: () => shipmentApi.getEventFiles(eventId),
    enabled: enabled && !!eventId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFileDownload = () => {
  return useMutation({
    mutationFn: shipmentApi.getFileDownloadUrl,
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shipmentApi.deleteFile,
    onSuccess: () => {
      // Invalidate all event files queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['eventFiles'] });
    },
  });
};

// Event management hooks
export const useUpdateTravelEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: UpdateTravelEventRequest }) =>
      shipmentApi.updateTravelEvent(eventId, data),
    onSuccess: () => {
      // Invalidate and refetch queries to refresh the UI immediately
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['track'] });
      
      // Force refetch to ensure immediate UI update
      queryClient.refetchQueries({ queryKey: ['shipments'] });
    },
  });
};

export const useDeleteTravelEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shipmentApi.deleteTravelEvent,
    onSuccess: () => {
      // Invalidate and refetch queries to refresh the UI immediately
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['track'] });
      
      // Force refetch to ensure immediate UI update
      queryClient.refetchQueries({ queryKey: ['shipments'] });
    },
  });
};