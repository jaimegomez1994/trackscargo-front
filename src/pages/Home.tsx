import { useState } from "react";
import TrackingForm from "../components/TrackingForm";
import TrackingResults from "../components/TrackingResults";
import { mockShipments } from "../data/mockShipments";
import type { Shipment } from "../types/shipment";

function Home() {
  const [searchedShipment, setSearchedShipment] = useState<Shipment | null>(
    null
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleTrack = (trackingNumber: string) => {
    // Find shipment in mock data
    const foundShipment = mockShipments.find(
      (shipment) =>
        shipment.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
    );

    if (foundShipment) {
      setSearchedShipment(foundShipment);
      setSearchError(null);
    } else {
      setSearchedShipment(null);
      setSearchError(
        `No shipment found with tracking number: ${trackingNumber}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <TrackingForm onTrack={handleTrack} />
          </div>

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
