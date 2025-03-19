import { db, collection, getDocs, query, where } from "./lib/firebase.js"; // Adjust path if needed

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email), where("password", "==", password));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("Invalid email or password");
            } else {
                alert("Login successful");
                window.location.href = "/dashboard"; // Redirect to your page
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Error logging in");
        }
    });
});
