import type { Shipment } from "../types/shipment";

type ShipmentsTabProps = {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  onShipmentSelect: (shipment: Shipment) => void;
};

export default function ShipmentsTab({ shipments, loading, error, onShipmentSelect }: ShipmentsTabProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-900">
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-2xl font-semibold text-neutral-900">All Shipments</h2>
      </div>

      {loading && (
        <div className="text-center py-8 text-neutral-500">Loading shipments...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        {shipments.map((shipment) => (
          <div 
            key={shipment.id} 
            className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-neutral-300 transition-all duration-200"
            onClick={() => onShipmentSelect(shipment)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {shipment.trackingNumber}
                </h3>
                <p className="text-neutral-600 mb-3">
                  {shipment.origin} → {shipment.destination}
                </p>
                <div className="flex gap-6 text-sm text-neutral-600">
                  <span>Weight: {shipment.weight} lbs / {(shipment.weight * 0.453592).toFixed(2)} kgs</span>
                  <span>Pieces: {shipment.pieces}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShipmentSelect(shipment);
                  }}
                  className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}