import { useState, useEffect } from "react";
import "./App.css";
import { config } from "./config/env";

function App() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetch(`${config.apiUrl}/api/v1/shipments`, {
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setShipments(data.shipments));
  }, []);

  return (
    <>
      {shipments.map((shipment) => (
        <div key={shipment}>{shipment}</div>
      ))}
    </>
  );
}

export default App;
