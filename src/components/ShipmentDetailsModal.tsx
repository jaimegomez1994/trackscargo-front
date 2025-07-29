import type { Shipment } from "../types/shipment";

type ShipmentDetailsModalProps = {
  shipment: Shipment;
  onClose: () => void;
};

export default function ShipmentDetailsModal({ shipment, onClose }: ShipmentDetailsModalProps) {
  return (
    <>
      {/* Very Subtle Backdrop Blur */}
      <div className="fixed inset-0 z-40" style={{ backdropFilter: 'blur(0.8px)' }} />
      
      {/* Slide-in Panel */}
      <div 
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
                   w-full md:w-[60%]"
        style={{ maxWidth: '100vw' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-neutral-900">Shipment Details</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 hover:bg-neutral-100 rounded-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6L18 18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Package Details Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-900">
                <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-xl font-semibold text-neutral-900">Package Details</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Tracking Number</label>
                <p className="text-neutral-900 font-semibold">{shipment.trackingNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Weight</label>
                <p className="text-neutral-900">{shipment.weight} lbs / {(shipment.weight * 0.453592).toFixed(2)} kgs</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Total Pieces</label>
                <p className="text-neutral-900 font-semibold">{shipment.pieces}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Current Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  shipment.status === "Delivered" 
                    ? "bg-green-100 text-green-800"
                    : shipment.status === "Exception"
                    ? "bg-red-100 text-red-800"
                    : shipment.status === "Out for Delivery"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {shipment.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Origin</label>
                <p className="text-neutral-900 font-semibold">{shipment.origin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Destination</label>
                <p className="text-neutral-900 font-semibold">{shipment.destination}</p>
              </div>
            </div>
          </div>

          {/* Travel History Section */}
          {shipment.travelHistory && shipment.travelHistory.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">Travel History</h3>
              
              <div className="space-y-4">
                {shipment.travelHistory.map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    {/* Timeline Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {event.type === "delivered" ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-600">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : event.type === "picked-up" ? (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-600">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Event Details */}
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}