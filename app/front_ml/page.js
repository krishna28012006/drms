import React from "react";
import ImageClassifier from "../components/ImageClassifier";
 // Import the ML Component

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ImageClassifier />
    </div>
  );
}
