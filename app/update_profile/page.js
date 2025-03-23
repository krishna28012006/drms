"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Ensure the path is correct
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
            const { role, ...userDetails } = userData;
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

  const handleChange = (index, value) => {
    const updatedDataNodes = [...dataNodes];
    updatedDataNodes[index].value = value;
    setDataNodes(updatedDataNodes);
  };

  const handleEdit = async () => {
    if (!userEmail) return;

    try {
      const userRef = doc(db, "users", userEmail);
      const updatedData = {};

      // Prepare the updated data object
      dataNodes.forEach((item) => {
        updatedData[item.field] = item.value;
      });

      // Update the user document in Firestore
      await updateDoc(userRef, updatedData);
      console.log("User  data updated successfully.");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="complaint-container">
      <h2 className="title">Your Profile Details</h2>
      {dataNodes.length > 0 ? (
        <div className="complaint-card">
          {dataNodes.map((item, index) => (
            <div key={index} className="complaint-field">
              <strong>{item.field}:</strong>
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleChange(index, e.target.value)}
                className="input-field"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="no-complaints">No data found.</p>
      )}

      <div className="button-container">
        <button className="edit-button" onClick={handleEdit}>Save</button>
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
        .input-field {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 8px;
          width: 60%; /* Adjust width as needed */
        }
        .no-complaints {
          color: #888;
          font-size: 16px;
        }
        .button-container {
          margin-top: 20px;
        }
        .edit-button {
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
        .edit-button:hover {
          background-color: #007bbf; /* Darker blue on hover */
        }
      `}</style>
    </div>
  );
}
