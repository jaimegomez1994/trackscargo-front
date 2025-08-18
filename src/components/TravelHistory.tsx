import { useState } from "react";
import type { TravelEvent as ApiTravelEvent, UpdateTravelEventRequest } from "../types/api";
import TrackingEvent from "./TrackingEvent";
import EditEventSlideIn from "./slide-ins/EditEventSlideIn";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import { useUpdateTravelEvent, useDeleteTravelEvent } from "../api/shipmentApi";

type TravelHistoryProps = {
  events: ApiTravelEvent[];
  allowEditing?: boolean;
};

export default function TravelHistory({ events, allowEditing = false }: TravelHistoryProps) {
  const [editingEvent, setEditingEvent] = useState<ApiTravelEvent | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  
  const updateEventMutation = useUpdateTravelEvent();
  const deleteEventMutation = useDeleteTravelEvent();

  const handleEditEvent = (event: ApiTravelEvent) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = (eventId: string) => {
    setDeletingEventId(eventId);
  };

  const handleUpdateSubmit = (data: UpdateTravelEventRequest) => {
    if (!editingEvent) return;
    
    
    updateEventMutation.mutate(
      { eventId: editingEvent.id, data },
      {
        onSuccess: () => {
          setEditingEvent(null);
        },
        onError: (error) => {
          console.error('Failed to update event:', error);
          // You might want to show a toast notification here
        }
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingEventId) return;
    
    deleteEventMutation.mutate(deletingEventId, {
      onSuccess: () => {
        setDeletingEventId(null);
      },
      onError: (error) => {
        console.error('Failed to delete event:', error);
        // You might want to show a toast notification here
      }
    });
  };

  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Travel History</h2>
        <p className="text-neutral-500">No travel history available for this shipment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Travel History</h2>
      
      <div className="space-y-6">
        {events.map((event) => (
          <TrackingEvent 
            key={event.id} 
            event={event}
            onEdit={allowEditing ? handleEditEvent : undefined}
            onDelete={allowEditing ? handleDeleteEvent : undefined}
          />
        ))}
      </div>

      {/* Edit Event Slide-in */}
      <EditEventSlideIn
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSubmit={handleUpdateSubmit}
        isLoading={updateEventMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingEventId}
        onClose={() => setDeletingEventId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Travel Event"
        message="Are you sure you want to delete this travel event? This action cannot be undone and may affect the shipment's status."
        isLoading={deleteEventMutation.isPending}
      />
    </div>
  );
}