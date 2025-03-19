"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AlertsList() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      console.log("Fetching alerts...");
      const alertsCollection = collection(db, "alerts");
      const alertsSnapshot = await getDocs(alertsCollection);

      if (!alertsSnapshot.empty) {
        const alertsData = alertsSnapshot.docs.map((doc) => {
          let data = doc.data();

          // Convert Firestore Timestamps to readable date
          Object.keys(data).forEach((key) => {
            if (data[key] && data[key].seconds) {
              data[key] = new Date(data[key].seconds * 1000).toLocaleString();
            }
          });

          return { id: doc.id, ...data };
        });

        setAlerts(alertsData);
        console.log("Alerts fetched:", alertsData);
      } else {
        console.warn("No alerts found.");
        setAlerts([]);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>All Alerts</h2>

      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length > 0 ? (
        alerts.map((alert) => (
          <div key={alert.id} className="alert-card">
            <div className="alert-field">
              <strong>Alert ID:</strong> {alert.id}
            </div>
            {Object.entries(alert).map(([key, value]) =>
              key !== "id" ? (
                <div key={key} className="alert-field">
                  <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : value}
                </div>
              ) : null
            )}
          </div>
        ))
      ) : (
        <p>No alerts found.</p>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          text-align: center;
        }
        .alert-card {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          margin-bottom: 15px;
          text-align: left;
        }
        .alert-field {
          background: #ffffff;
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
