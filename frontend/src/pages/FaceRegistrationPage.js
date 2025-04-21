import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";

const MODEL_URL = "/models";

const FaceRegistrationPage = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [staffcode, setStaffcode] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models", err);
      }
    };
    loadModels();
  }, []);

  const captureFace = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      modelsLoaded
    ) {
      const video = webcamRef.current.video;

      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setFaceDescriptor(detection.descriptor);
        drawFace(detection);
        setNotification("✅ Khuôn mặt đã được ghi nhận.");
      } else {
        setNotification("⚠️ Không phát hiện khuôn mặt.");
      }
    }
  };

  const drawFace = (detection) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current.video;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
    const resized = faceapi.resizeResults(detection, displaySize);

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);
  };

  const handleSave = async () => {
    if (!faceDescriptor) {
      setNotification("⚠️ Chưa chụp khuôn mặt.");
      return;
    }
    if (!staffcode.trim()) {
      setNotification("⚠️ Vui lòng nhập mã nhân viên.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("staffcode", staffcode);
      formData.append("faceEmbedding", JSON.stringify(Array.from(faceDescriptor)));

      const res = await axios.post(
        `${process.env.REACT_APP_URL_BACKEND}/attendance/save-face`,
        formData
      );

      setNotification("✅ " + res.data.message);
    } catch (err) {
      console.error("Save face failed:", err);
      setNotification("❌ Lỗi khi lưu khuôn mặt");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Đăng ký khuôn mặt nhân viên</h2>

      <input
        type="text"
        placeholder="Nhập mã nhân viên (VD: NV1)"
        value={staffcode}
        onChange={(e) => setStaffcode(e.target.value)}
        style={{
          padding: 10,
          width: 300,
          fontSize: 16,
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 20,
        }}
      />

      <div style={{ position: "relative", width: 640, height: 480, margin: "auto" }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          style={{ borderRadius: 12 }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <button
          onClick={captureFace}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            borderRadius: 8,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            marginRight: 10,
            cursor: "pointer",
          }}
        >
          📸 Chụp khuôn mặt
        </button>

        {faceDescriptor && (
          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 8,
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            💾 Lưu khuôn mặt
          </button>
        )}
      </div>

      {notification && (
        <div
          style={{
            marginTop: 30,
            padding: 15,
            backgroundColor: notification.includes("✅")
              ? "#28a745"
              : "#dc3545",
            color: "#fff",
            borderRadius: 6,
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: 16,
            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          }}
        >
          {notification}
        </div>
      )}
    </div>
  );
};

export default FaceRegistrationPage;
