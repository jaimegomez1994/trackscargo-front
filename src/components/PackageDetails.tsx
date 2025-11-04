import type { Shipment } from "../types/shipment";

type PackageDetailsProps = {
  shipment: Shipment;
};

export default function PackageDetails({ shipment }: PackageDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "exception":
        return "bg-red-100 text-red-800";
      case "out for delivery":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
            <path d="M2 7l10 5 10-5"/>
            <path d="M12 22V12"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Package Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Tracking Number
          </label>
          <p className="text-neutral-900 font-semibold">{shipment.trackingNumber}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Weight
          </label>
          <p className="text-neutral-900 font-semibold">
            {shipment.weight} lbs / {(shipment.weight * 0.453592).toFixed(2)} kgs
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Total Pieces
          </label>
          <p className="text-neutral-900 font-semibold">{shipment.pieces}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Current Status
          </label>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
            {shipment.status}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Origin
          </label>
          <p className="text-neutral-900 font-semibold">{shipment.origin}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Destination
          </label>
          <p className="text-neutral-900 font-semibold">{shipment.destination}</p>
        </div>

        {shipment.gpsTrackingUrl && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              GPS Tracking
            </label>
            <a
              href={shipment.gpsTrackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline break-all font-semibold"
            >
              {shipment.gpsTrackingUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}