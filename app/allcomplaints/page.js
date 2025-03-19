"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Ensure correct path
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    try {
      console.log("Fetching all complaints...");
      const complaintsCollection = collection(db, "complaints");
      const complaintsSnapshot = await getDocs(complaintsCollection);

      if (!complaintsSnapshot.empty) {
        const complaintsData = complaintsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComplaints(complaintsData);
        console.log("Complaints found:", complaintsData);
      } else {
        console.warn("No complaints found in Firestore.");
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  }

  async function handleFinish(complaintId) {
    try {
      console.log(`Deleting complaint: ${complaintId}`);
      await deleteDoc(doc(db, "complaints", complaintId));
      setComplaints((prev) => prev.filter((c) => c.id !== complaintId));
      console.log("Complaint deleted successfully!");
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  }

  return (
    <div className="container">
      <h2>All Complaints</h2>
      {complaints.length > 0 ? (
        complaints.map((complaint) => (
          <div key={complaint.id} className="complaint-card">
            <h3>User: {complaint.id}</h3> {/* ID is the document name */}
            <ul>
              {Object.entries(complaint).map(([key, value]) =>
                key !== "id" ? (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ) : null
              )}
            </ul>
            <button onClick={() => handleFinish(complaint.id)} className="finish-btn">
              Finish
            </button>
          </div>
        ))
      ) : (
        <p>No complaints found.</p>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          text-align: center;
        }
        .complaint-card {
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
        .finish-btn {
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
        .finish-btn:hover {
          background-color: #cc0000;
        }
      `}</style>
    </div>
  );
}
