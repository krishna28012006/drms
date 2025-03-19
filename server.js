import express from "express";
import cors from "cors";
import { db } from "./lib/firebase.js"; 
import { doc, setDoc } from "firebase/firestore";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/submit-complaint", async (req, res) => {
  const { email, complaint } = req.body;

  if (!email || !complaint) {
    return res.status(400).json({ error: "Email and complaint are required!" });
  }

  try {
    const complaintDoc = doc(db, "complaints", email); // Store complaint under the user's email
    await setDoc(complaintDoc, {
      complaint,
      timestamp: new Date().toISOString(),
    });

    console.log(`✅ Complaint saved in Firestore: ${JSON.stringify({ email, complaint })}`);

    res.status(200).json({ message: "Complaint submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving complaint to Firestore:", error);
    res.status(500).json({ error: "Failed to save complaint." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
