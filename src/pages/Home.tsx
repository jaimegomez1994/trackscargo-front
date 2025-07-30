import { useState } from "react";
import TrackingForm from "../components/TrackingForm";
import TrackingResults from "../components/TrackingResults";
import { config } from "../config/env";
import type { Shipment } from "../types/shipment";

function Home() {
  const [searchedShipment, setSearchedShipment] = useState<Shipment | null>(
    null
  );
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (trackingNumber: string) => {
    setIsLoading(true);
    setSearchError(null);
    setSearchedShipment(null);

    try {
      const response = await fetch(`${config.apiUrl}/api/v1/track/${encodeURIComponent(trackingNumber)}`);
      
      if (response.ok) {
        const shipment = await response.json();
        setSearchedShipment(shipment);
      } else {
        const errorData = await response.json();
        setSearchError(errorData.error || `No shipment found with tracking number: ${trackingNumber}`);
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setSearchError("Unable to connect to tracking service. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <TrackingForm onTrack={handleTrack} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                Tracking your shipment...
              </div>
            </div>
          )}

          {/* Search Error */}
          {searchError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {searchError}
            </div>
          )}

          {/* Tracking Results */}
          {searchedShipment && <TrackingResults shipment={searchedShipment} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
