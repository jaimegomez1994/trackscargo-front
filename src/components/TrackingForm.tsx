import { useState, useEffect } from "react";

type TrackingFormProps = {
  onTrack: (trackingNumber: string) => void;
  initialValue?: string;
};

export default function TrackingForm({ onTrack, initialValue }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialValue || "");

  // Update input when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setTrackingNumber(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onTrack(trackingNumber.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
      <h1 className="text-3xl font-bold text-center text-neutral-900 mb-8">
        Track Your Shipment
      </h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number (for example: TRK123456789)"
            className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 placeholder-neutral-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          Track
        </button>
      </form>
    </div>
  );
}