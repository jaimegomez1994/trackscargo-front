import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/shipments")
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
