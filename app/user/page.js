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
        console.log("Fetching user details for:", userEmail);
        const userRef = doc(db, "users", userEmail);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("User  Data Found:", userData);

          // Exclude the password field
          const { password, ...userDetails } = userData;

          // Convert object fields into an array for rendering
          const formattedData = Object.entries(userDetails).map(([key, value]) => ({
            field: key,
            value: value,
          }));

          setDataNodes(formattedData);
        } else {
          console.warn("No user found.");
          setDataNodes([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [userEmail]);

  const handleLogout = () => {
    // Logic for logging out the user
    console.log("Logout button clicked");
    localStorage.removeItem("userEmail"); // Example of clearing user data
    // Redirect to login or home page
    window.location.href = "/"; // Redirect to home page (adjust as needed)
  };

  return (
    <div className="complaint-container">
      <h2 className="title">Your Profile Details</h2>
      {dataNodes.length > 0 ? (
        <div className="complaint-card">
          {dataNodes.map((item, index) => (
            <div key={index} className="complaint-field">
              <strong>{item.field}:</strong> <span>{item.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-complaints">No data found.</p>
      )}

      <div className="button-container">
        <button className="edit-button" onClick= window.location.href = "/update_profile"; >Edit</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <style jsx>{`
        .complaint-container {
          padding: 20px;
          text-align: center;
          background-color: #fafafa; /* Light background color */
          min-height: 100vh; /* Ensure it covers the full height */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
        .complaint-card {
          background: white; /* White background for the card */
          padding: 20px;
          border-radius: 12px; /* Rounded corners */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow */
          max-width: 400px;
          width: 100%; /* Responsive width */
          margin: 20px auto;
        }
        .complaint-field {
          display: flex;
          justify-content: space-between;
          background: #f9f9f9; /* Light gray background for fields */
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px; /* Rounded corners */
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        }
        .no-complaints {
          color: #888;
          font-size: 16px;
        }
        .button-container {
          margin-top: 20px;
        }
        .edit-button, .logout-button {
          background-color: #0095f6; /* Instagram blue */
          color: white;
          border: none;
          border-radius: 5px;
          padding: 10px 15px;
          margin: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        .edit-button:hover, .logout-button:hover {
          background-color: #007bbf; /* Darker blue on hover */
        }
      `}</style>
    </div>
  );
}
