"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Ensure the path is correct
import { doc, getDoc } from "firebase/firestore";

export default function ComplaintBox() {
  const [dataNodes, setDataNodes] = useState([]);
  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  useEffect(() => {
    if (!userEmail) {
      console.warn("No user email found.");
      return;
    }

    async function fetchData() {
      try {
        console.log("Fetching complaints for:", userEmail);
        const complaintRef = doc(db, "complaints", userEmail);
        const complaintSnap = await getDoc(complaintRef);

        if (complaintSnap.exists()) {
          const complaintData = complaintSnap.data();
          console.log("Complaint Data Found:", complaintData);

          // Convert object fields into an array for rendering
          const formattedData = Object.entries(complaintData).map(([key, value]) => ({
            field: key,
            value: value,
          }));

          setDataNodes(formattedData);
        } else {
          console.warn("No complaints found.");
          setDataNodes([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [userEmail]);

  return (
    <div className="complaint-container">
      <h2>Your Complaint Details</h2>
      {dataNodes.length > 0 ? (
        <div className="complaint-card">
          {dataNodes.map((item, index) => (
            <div key={index} className="complaint-field">
              <strong>{item.field}:</strong> <span>{item.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-complaints">No complaints found.</p>
      )}

      <style jsx>{`
        .complaint-container {
          padding: 20px;
          text-align: center;
        }
        .complaint-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          max-width: 400px;
          margin: 20px auto;
        }
        .complaint-field {
          display: flex;
          justify-content: space-between;
          background: #ffffff;
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .no-complaints {
          color: #888;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
