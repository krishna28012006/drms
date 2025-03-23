"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Ensure the path is correct
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Profile() {
  const [dataNodes, setDataNodes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // Corrected line

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
    }
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (isClient && userEmail) {
      async function fetchData() {
        try {
          const userRef = doc(db, "users", userEmail);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const { password, ...userDetails } = userData;

            const formattedData = Object.entries(userDetails).map(([key, value]) => ({
              field: key,
              value: value,
            }));

            setDataNodes(formattedData);
            setNewName(userData.name || "");
          } else {
            console.warn("No user found.");
            setDataNodes([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      fetchData();
    }
  }, [isClient, userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    if (isClient) router.push("/");
  };

  const handleEditProfile = async () => {
    if (!newName) return;
    try {
      const userRef = doc(db, "users", userEmail);
      await updateDoc(userRef, { name: newName });
      setIsEditing(false);
      setDataNodes((prevData) =>
        prevData.map((item) =>
          item.field === "name" ? { ...item, value: newName } : item
        )
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl text-center mb-6 font-semibold text-gray-800">Your Profile</h2>

        {dataNodes.length > 0 ? (
          <div className="space-y-4">
            {dataNodes.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{item.field}:</span>
                <span className="text-gray-500">{item.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading...</p>
        )}

        <div className="mt-6 space-x-4 flex justify-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {isEditing && (
          <div className="mt-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                placeholder="Enter your new name"
              />
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleEditProfile}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
