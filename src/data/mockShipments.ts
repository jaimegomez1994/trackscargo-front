import type { Shipment } from "../types/shipment";

export const mockShipments: Shipment[] = [
  {
    id: "1",
    trackingNumber: "TRK123456789",
    origin: "Saint Louis, MO",
    destination: "Laredo, TX",
    weight: 1690,
    pieces: 8,
    status: "Delivered",
    travelHistory: [
      {
        id: "1",
        status: "Delivered",
        location: "Laredo, TX",
        description: "Arrived at customer location for delivery",
        timestamp: "7/17/2025 at 3:54:00 AM",
        type: "delivered"
      },
      {
        id: "2",
        status: "In Transit",
        location: "Austin, TX",
        description: "Package in transit to destination",
        timestamp: "7/16/2025 at 11:20:00 PM",
        type: "in-transit"
      },
      {
        id: "3",
        status: "Picked up",
        location: "Saint Louis, MO",
        description: "Package picked up from origin",
        timestamp: "7/8/2025 at 2:47:00 AM",
        type: "picked-up"
      }
    ]
  },
  {
    id: "2", 
    trackingNumber: "TRK987654321",
    origin: "Houston, TX",
    destination: "Miami, FL",
    weight: 2450,
    pieces: 12,
    status: "In Transit",
    travelHistory: [
      {
        id: "4",
        status: "In Transit",
        location: "Jacksonville, FL",
        description: "Package is on the way to destination",
        timestamp: "7/28/2025 at 1:30:00 PM",
        type: "in-transit"
      },
      {
        id: "5",
        status: "In Transit",
        location: "Tallahassee, FL",
        description: "Package processed at sorting facility",
        timestamp: "7/27/2025 at 6:45:00 AM",
        type: "in-transit"
      },
      {
        id: "6",
        status: "Picked up",
        location: "Houston, TX",
        description: "Package picked up from origin",
        timestamp: "7/26/2025 at 8:15:00 AM",
        type: "picked-up"
      }
    ]
  },
  {
    id: "3",
    trackingNumber: "TRK555888999",
    origin: "Los Angeles, CA",
    destination: "Seattle, WA",
    weight: 850,
    pieces: 3,
    status: "Out for Delivery",
    travelHistory: [
      {
        id: "7",
        status: "Out for Delivery",
        location: "Seattle, WA",
        description: "Package is out for delivery",
        timestamp: "7/29/2025 at 7:30:00 AM",
        type: "in-transit"
      },
      {
        id: "8",
        status: "In Transit",
        location: "Portland, OR",
        description: "Package arrived at delivery facility",
        timestamp: "7/28/2025 at 10:15:00 PM",
        type: "in-transit"
      },
      {
        id: "9",
        status: "Picked up",
        location: "Los Angeles, CA",
        description: "Package picked up from origin",
        timestamp: "7/27/2025 at 4:30:00 PM",
        type: "picked-up"
      }
    ]
  },
  {
    id: "4",
    trackingNumber: "TRK111222333",
    origin: "Chicago, IL",
    destination: "Boston, MA",
    weight: 3200,
    pieces: 15,
    status: "Exception",
    travelHistory: [
      {
        id: "10",
        status: "Exception",
        location: "Cleveland, OH",
        description: "Delivery attempt failed - recipient not available",
        timestamp: "7/28/2025 at 2:15:00 PM",
        type: "in-transit"
      },
      {
        id: "11",
        status: "In Transit",
        location: "Cleveland, OH",
        description: "Package arrived at local facility",
        timestamp: "7/27/2025 at 9:00:00 AM",
        type: "in-transit"
      },
      {
        id: "12",
        status: "Picked up",
        location: "Chicago, IL",
        description: "Package picked up from origin",
        timestamp: "7/25/2025 at 1:45:00 PM",
        type: "picked-up"
      }
    ]
  },
  {
    id: "5",
    trackingNumber: "TRK777444111",
    origin: "Phoenix, AZ",
    destination: "Denver, CO",
    weight: 1250,
    pieces: 6,
    status: "Delivered",
    travelHistory: [
      {
        id: "13",
        status: "Delivered",
        location: "Denver, CO",
        description: "Package delivered successfully",
        timestamp: "7/26/2025 at 11:45:00 AM",
        type: "delivered"
      },
      {
        id: "14",
        status: "Out for Delivery",
        location: "Denver, CO",
        description: "Package out for delivery",
        timestamp: "7/26/2025 at 6:30:00 AM",
        type: "in-transit"
      },
      {
        id: "15",
        status: "In Transit",
        location: "Albuquerque, NM",
        description: "Package in transit",
        timestamp: "7/24/2025 at 8:20:00 PM",
        type: "in-transit"
      },
      {
        id: "16",
        status: "Picked up",
        location: "Phoenix, AZ",
        description: "Package picked up from origin",
        timestamp: "7/23/2025 at 3:10:00 PM",
        type: "picked-up"
      }
    ]
  },
  {
    id: "6",
    trackingNumber: "TRK999888777",
    origin: "Atlanta, GA",
    destination: "Nashville, TN",
    weight: 675,
    pieces: 2,
    status: "In Transit",
    travelHistory: [
      {
        id: "17",
        status: "In Transit",
        location: "Birmingham, AL",
        description: "Package processed at sorting facility",
        timestamp: "7/29/2025 at 12:20:00 PM",
        type: "in-transit"
      },
      {
        id: "18",
        status: "Picked up",
        location: "Atlanta, GA",
        description: "Package picked up from origin",
        timestamp: "7/29/2025 at 9:00:00 AM",
        type: "picked-up"
      }
    ]
  },
  {
    id: "7",
    trackingNumber: "TRK333666999",
    origin: "New York, NY",
    destination: "Washington, DC",
    weight: 420,
    pieces: 1,
    status: "Delivered",
    travelHistory: [
      {
        id: "19",
        status: "Delivered",
        location: "Washington, DC",
        description: "Package delivered to front desk",
        timestamp: "7/25/2025 at 4:20:00 PM",
        type: "delivered"
      },
      {
        id: "20",
        status: "Out for Delivery",
        location: "Washington, DC",
        description: "Package out for delivery",
        timestamp: "7/25/2025 at 8:00:00 AM",
        type: "in-transit"
      },
      {
        id: "21",
        status: "In Transit",
        location: "Baltimore, MD",
        description: "Package in transit to destination",
        timestamp: "7/24/2025 at 11:30:00 PM",
        type: "in-transit"
      },
      {
        id: "22",
        status: "Picked up",
        location: "New York, NY",
        description: "Package picked up from origin",
        timestamp: "7/24/2025 at 2:15:00 PM",
        type: "picked-up"
      }
    ]
  }
];