import type { Shipment, StatusForm } from "../types/shipment";
import { Button } from './ui';

type AddStatusTabProps = {
  shipments: Shipment[];
  statusForm: StatusForm;
  isMobile: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function AddStatusTab({ 
  shipments, 
  statusForm, 
  isMobile, 
  onFormChange, 
  onSubmit 
}: AddStatusTabProps) {
  return (
    <div className="mt-8">
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900">Add Status Update</h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-4 sm:p-6">
          {/* Select Shipment */}
          <div className="mb-6 relative">
            <label htmlFor="selectedShipment" className="block text-sm font-medium text-neutral-700 mb-2">
              Select Shipment <span className="text-red-500">*</span>
            </label>
            <select
              id="selectedShipment"
              value={statusForm.selectedShipment}
              onChange={(e) => onFormChange("selectedShipment", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              required
            >
              <option value="">Choose a shipment</option>
              {shipments.map((shipment) => (
                <option key={shipment.id} value={shipment.id}>
                  {isMobile 
                    ? shipment.trackingNumber 
                    : `${shipment.trackingNumber} - ${shipment.origin} → ${shipment.destination}`
                  }
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={statusForm.status}
                onChange={(e) => onFormChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                required
              >
                <option value="">Select status</option>
                <option value="Picked up">Picked up</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Exception">Exception</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={statusForm.location}
                onChange={(e) => onFormChange("location", e.target.value)}
                placeholder="Denver, CO"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={statusForm.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              placeholder="Additional details about this status update..."
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="blue"
              size="lg"
              fullWidth
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              }
            >
              Add Status Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}