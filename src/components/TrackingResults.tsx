import type { Shipment } from "../types/shipment";
import PackageDetails from "./PackageDetails";
import TravelHistory from "./TravelHistory";

type TrackingResultsProps = {
  shipment: Shipment;
};

export default function TrackingResults({ shipment }: TrackingResultsProps) {
  return (
    <div className="space-y-6">
      <PackageDetails shipment={shipment} />
      <TravelHistory events={shipment.travelHistory || []} />
    </div>
  );
}