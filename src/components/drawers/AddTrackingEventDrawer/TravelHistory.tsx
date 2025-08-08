import type { Shipment } from '../../../types/api';
import EventFiles from '../../EventFiles';

interface TravelHistoryProps {
  shipment: Shipment;
}

function TravelHistory({ shipment }: TravelHistoryProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('delivered')) {
      return 'bg-green-100 text-green-800';
    } else if (normalizedStatus.includes('transit') || normalizedStatus.includes('shipped')) {
      return 'bg-blue-100 text-blue-800';
    } else if (normalizedStatus.includes('picked') || normalizedStatus.includes('pending')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (normalizedStatus.includes('exception') || normalizedStatus.includes('failed')) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  if (!shipment.travelHistory || shipment.travelHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No travel history</h3>
        <p className="mt-1 text-sm text-gray-500">
          No tracking events have been recorded for this shipment yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Travel History</h3>
      
      <div className="flow-root">
        <ul className="-mb-8">
          {shipment.travelHistory.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== shipment.travelHistory.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-white">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>
                          {event.status}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{event.location}</span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      )}
                      {/* Event Files */}
                      <EventFiles eventId={event.id} allowDelete={true} />
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={event.timestamp}>{formatDate(event.timestamp)}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TravelHistory;