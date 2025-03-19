import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8s1TWWjx3pYrYZjbw243RBACYkZrtmSo",
  authDomain: "drms-44bcc.firebaseapp.com",
  projectId: "drms-44bcc",
  storageBucket: "drms-44bcc.firebasestorage.app",
  messagingSenderId: "111500403496",
  appId: "1:111500403496:web:730530ae3533dd89e1261d",
  measurementId: "G-Y2XMZMD1L7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔽 Add this test function
async function testFirestore() {
  try {
    const testDoc = doc(db, "test_collection", "test_doc");
    await setDoc(testDoc, { message: "Firestore is working!" });
    console.log("✅ Firestore test write successful!");
  } catch (error) {
    console.error("❌ Firestore test failed:", error);
  }
}

testFirestore();

export { db };
