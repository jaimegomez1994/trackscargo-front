import type { TravelEvent } from "../types/shipment";

type TrackingEventProps = {
  event: TravelEvent;
};

export default function TrackingEvent({ event }: TrackingEventProps) {
  const getEventIcon = (type: string, status: string) => {
    if (status.toLowerCase() === "delivered") {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-600">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    
    if (type === "picked-up") {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600">
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }

    if (status.toLowerCase().includes("exception")) {
      return (
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-600">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      );
    }

    // Default for in-transit, on the way, etc.
    return (
      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-600">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">
        {getEventIcon(event.type, event.status)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <p className="font-semibold text-neutral-900">{event.status}</p>
            <p className="text-sm text-neutral-600 flex items-center gap-1 mt-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {event.location}
            </p>
            <p className="text-sm text-neutral-500 mt-1">{event.description}</p>
          </div>
          <p className="text-sm text-neutral-500 whitespace-nowrap">{event.timestamp}</p>
        </div>
      </div>
    </div>
  );
}