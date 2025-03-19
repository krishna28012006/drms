"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

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

  async function handleDelete(alertId) {
    try {
      console.log(`Deleting alert: ${alertId}`);
      await deleteDoc(doc(db, "alerts", alertId));
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
      console.log("Alert deleted successfully!");
    } catch (error) {
      console.error("Error deleting alert:", error);
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
            <h3>Alert ID: {alert.id}</h3>
            <ul>
              {Object.entries(alert).map(([key, value]) =>
                key !== "id" ? (
                  <li key={key}>
                    <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : value}
                  </li>
                ) : null
              )}
            </ul>
            <button onClick={() => handleDelete(alert.id)} className="delete-btn">
              Delete
            </button>
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
          position: relative;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin-bottom: 5px;
        }
        .delete-btn {
          background-color: #ff4d4d;
          color: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 5px;
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
        .delete-btn:hover {
          background-color: #cc0000;
        }
      `}</style>
    </div>
  );
}
