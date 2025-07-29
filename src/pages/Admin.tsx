import { useState, useEffect } from "react";
import { config } from "../config/env";

function Admin() {
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

  if (loading) {
    return <div className="p-5 max-w-4xl mx-auto">Loading...</div>;
  }

  if (error) {
    return <div className="p-5 max-w-4xl mx-auto">Error: {error}</div>;
  }

  return <div className="p-5 max-w-4xl mx-auto">admin</div>;
}

export default Admin;
