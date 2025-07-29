import type { CreateShipmentForm } from "../types/shipment";

type CreateShipmentTabProps = {
  form: CreateShipmentForm;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CreateShipmentTab({ form, onFormChange, onSubmit }: CreateShipmentTabProps) {
  return (
    <div className="mt-8">
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900">Create New Shipment</h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tracking Number */}
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                Tracking Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="trackingNumber"
                value={form.trackingNumber}
                onChange={(e) => onFormChange("trackingNumber", e.target.value)}
                placeholder="TRK123456789"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-neutral-700 mb-2">
                Weight
              </label>
              <input
                type="text"
                id="weight"
                value={form.weight}
                onChange={(e) => onFormChange("weight", e.target.value)}
                placeholder="2.5 lbs"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={form.company}
                onChange={(e) => onFormChange("company", e.target.value)}
                placeholder="ABC Logistics Inc."
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Total Pieces */}
            <div>
              <label htmlFor="totalPieces" className="block text-sm font-medium text-neutral-700 mb-2">
                Total Pieces <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="totalPieces"
                value={form.totalPieces}
                onChange={(e) => onFormChange("totalPieces", e.target.value)}
                placeholder="1"
                min="1"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Origin */}
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-neutral-700 mb-2">
                Origin <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="origin"
                value={form.origin}
                onChange={(e) => onFormChange("origin", e.target.value)}
                placeholder="New York, NY"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-neutral-700 mb-2">
                Destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="destination"
                value={form.destination}
                onChange={(e) => onFormChange("destination", e.target.value)}
                placeholder="Los Angeles, CA"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
                <path d="M2 7l10 5 10-5"/>
                <path d="M12 22V12"/>
              </svg>
              Create Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}