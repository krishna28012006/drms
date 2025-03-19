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
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className="alert-item">
              <strong>Alert ID:</strong> {alert.id}
              {Object.entries(alert).map(([key, value]) =>
                key !== "id" ? (
                  <div key={key} className="alert-detail">
                    <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : value}
                  </div>
                ) : null
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No alerts found.</p>
      )}

      <style jsx>{`
        .container {
          padding: 40px;
          text-align: center;
          background: #f3f4f6; /* Light gray background */
          color: #1f2937; /* Dark gray text */
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
          font-family: 'Arial', sans-serif; /* Professional font */
        }
        h2 {
          margin-bottom: 30px;
          font-size: 2rem; /* Reduced font size */
          color: #3f51b5; /* Indigo 500 color */
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        .alerts-list {
          text-align: left; /* Align text to the left */
        }
        .alert-item {
          background: rgba(63, 81, 181, 0.1); /* Light indigo background */
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(63, 81, 181, 0.2); /* Indigo shadow */
          margin-bottom: 15px;
          font-size: 0.9rem; /* Reduced font size for alert items */
        }
        .alert-detail {
          margin-top: 5px; /* Space between details */
          color: #1f2937; /* Dark gray text for alert details */
        }
        @media (max-width: 600px) {
          .container {
            padding: 20px;
          }
          h2 {
            font-size: 1.5rem; /* Further reduce heading size on small screens */
          }
          .alert-item {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}
