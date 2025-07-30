import type { TravelEvent } from "../types/shipment";
import TrackingEvent from "./TrackingEvent";

type TravelHistoryProps = {
  events: TravelEvent[];
};

export default function TravelHistory({ events }: TravelHistoryProps) {
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
          <TrackingEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}