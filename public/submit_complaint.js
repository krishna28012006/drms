document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit_complaint");

    submitButton.addEventListener("click", async () => {
        const complaintInput = document.getElementById("new_complaint");
        const userEmail = localStorage.getItem("userEmail");

        if (!userEmail) {
            alert("User email not found! Please log in.");
            return;
        }

        const complaintText = complaintInput.value.trim();
        if (complaintText === "") {
            alert("Complaint cannot be empty!");
            return;
        }

        try {
            const response = await fetch("https://drms-five.vercel.app/api/submit-complaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, complaint: complaintText }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Complaint submitted successfully!");
                complaintInput.value = ""; // Clear input after submission
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
           
            console.error("Error submitting complaint:", error);
              alert("Failed to submit complaint. Please try again.");
           
        }
    });
});
