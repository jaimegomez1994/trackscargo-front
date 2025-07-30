import { useState, useEffect } from "react";
import { config } from "../config/env";
import type {
  TabType,
  Shipment,
  CreateShipmentForm,
  StatusForm,
} from "../types/shipment";
import { mockShipments } from "../data/mockShipments";
import ShipmentsTab from "../components/ShipmentsTab";
import CreateShipmentTab from "../components/CreateShipmentTab";
import AddStatusTab from "../components/AddStatusTab";
import ShipmentDetailsModal from "../components/ShipmentDetailsModal";

function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("shipments");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );

  // Create Shipment form state
  const [createForm, setCreateForm] = useState<CreateShipmentForm>({
    trackingNumber: "",
    weight: "",
    totalPieces: "",
    origin: "",
    destination: "",
    company: "",
  });

  // Add Status form state
  const [statusForm, setStatusForm] = useState<StatusForm>({
    selectedShipment: "",
    status: "",
    location: "",
    description: "",
  });

  // Track window width for responsive dropdown
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/api/v1/shipments`, {
        headers: {
          "x-api-key": config.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shipments");
      }

      const data = await response.json();
      if (data.shipments && data.shipments.length > 0) {
        setShipments(data.shipments);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Keep shipments empty so mock data will be used
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const displayShipments = shipments.length > 0 ? shipments : mockShipments;

  // Form handlers
  const handleFormChange = (field: string, value: string) => {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${config.apiUrl}/api/v1/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
        },
        body: JSON.stringify({
          trackingNumber: createForm.trackingNumber,
          origin: createForm.origin,
          destination: createForm.destination,
          weight: createForm.weight,
          pieces: createForm.totalPieces,
          status: "Picked up",
          company: createForm.company,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create shipment");
      }

      // Reset form after successful submission
      setCreateForm({
        trackingNumber: "",
        weight: "",
        totalPieces: "",
        origin: "",
        destination: "",
        company: "",
      });

      // Refresh shipments list
      fetchShipments();
      
      // Optionally show success message
      console.log("Shipment created successfully!");
    } catch (error) {
      console.error("Error creating shipment:", error);
      setError(error instanceof Error ? error.message : "Failed to create shipment");
    }
  };

  const handleStatusFormChange = (field: string, value: string) => {
    setStatusForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Determine event type based on status
      let eventType = "in-transit";
      if (statusForm.status.toLowerCase() === "delivered") {
        eventType = "delivered";
      } else if (statusForm.status.toLowerCase() === "picked up") {
        eventType = "picked-up";
      }

      const response = await fetch(`${config.apiUrl}/api/v1/shipments/${statusForm.selectedShipment}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
        },
        body: JSON.stringify({
          status: statusForm.status,
          location: statusForm.location,
          description: statusForm.description,
          eventType: eventType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add status update");
      }

      // Reset form after successful submission
      setStatusForm({
        selectedShipment: "",
        status: "",
        location: "",
        description: "",
      });

      // Refresh shipments list
      fetchShipments();
      
      console.log("Status update added successfully!");
    } catch (error) {
      console.error("Error adding status update:", error);
      setError(error instanceof Error ? error.message : "Failed to add status update");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "shipments":
        return (
          <ShipmentsTab
            shipments={displayShipments}
            loading={loading}
            error={error}
            onShipmentSelect={setSelectedShipment}
          />
        );
      case "create":
        return (
          <CreateShipmentTab
            form={createForm}
            onFormChange={handleFormChange}
            onSubmit={handleCreateSubmit}
          />
        );
      case "status":
        return (
          <AddStatusTab
            shipments={displayShipments}
            statusForm={statusForm}
            isMobile={isMobile}
            onFormChange={handleStatusFormChange}
            onSubmit={handleStatusSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Admin Dashboard
          </h1>
          <p className="text-neutral-600 mt-2">
            Manage shipments and track status updates
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-1">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("shipments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "shipments"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Shipments
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "create"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Create Shipment
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "status"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Add Status
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Slide-in Shipment Details Modal */}
      {selectedShipment && (
        <ShipmentDetailsModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
}

export default Admin;
