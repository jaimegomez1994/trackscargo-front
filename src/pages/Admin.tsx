import { useState, useEffect } from "react";
import { config } from "../config/env";

function Admin() {
  const [shipments, setShipments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.log({ data });
      setShipments(data.shipments);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return <div className="p-5 max-w-4xl mx-auto">admin</div>;
}

export default Admin;
