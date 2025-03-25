import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { useState, useEffect, useRef } from "react";

export default function ImageClassifier() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const imageRef = useRef(null);

  // Load the ML model when the component mounts
  useEffect(() => {
    async function loadModel() {
      console.log("Loading ML model...");
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      console.log("Model loaded successfully.");
    }
    loadModel();
  }, []);

  // Handle image selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Run classification when button is clicked
  const classifyImage = async () => {
    if (model && imageRef.current) {
      const predictions = await model.classify(imageRef.current);
      setPredictions(predictions);
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold">Image Classifier</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div className="mt-4">
          <img ref={imageRef} src={image} alt="Uploaded" className="w-64 mx-auto" />
          <button
            onClick={classifyImage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Classify Image
          </button>
        </div>
      )}
      {predictions.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Predictions:</h2>
          <ul>
            {predictions.map((p, index) => (
              <li key={index}>
                {p.className} - {Math.round(p.probability * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
