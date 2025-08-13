import type { Shipment } from '../../../types/api';
import TravelHistoryMain from '../../TravelHistory';

interface TravelHistoryProps {
  shipment: Shipment;
}

function TravelHistory({ shipment }: TravelHistoryProps) {
  return (
    <div>
      <TravelHistoryMain 
        events={shipment.travelHistory || []}
        allowEditing={true}
      />
    </div>
  );
}

export default TravelHistory;