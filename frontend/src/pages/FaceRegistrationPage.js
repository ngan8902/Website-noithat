import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import axios from "axios";
import Sidebar from "../components/sales/Sidebar";

const MODEL_URL = "/models";

const FaceRegistrationPage = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [staffcode, setStaffcode] = useState("");
  const [notification, setNotification] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [saving, setSaving] = useState(false);


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
      setCapturing(true);
      setNotification("");

      setTimeout(async () => {
        const video = webcamRef.current.video;

        try {
          const detection = await faceapi
            .detectSingleFace(video)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            setFaceDescriptor(detection.descriptor);
            drawFace(detection);
            setTimeout(() => {
              setNotification("✅ Khuôn mặt đã được ghi nhận.");
              const context = canvasRef.current.getContext("2d");
              context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }, 3000);
          } else {
            setNotification("⚠️ Không phát hiện khuôn mặt.");
          }
        } catch (err) {
          console.error("Lỗi khi nhận diện khuôn mặt:", err);
          setNotification("Lỗi nhận diện khuôn mặt.");
        } finally {
          setCapturing(false);
        }
      }, 0);
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

    const staffCodePattern = /^NV\d+$/;

    if (!staffCodePattern.test(staffcode.trim())) {
      setNotification("⚠️ Mã nhân viên không hợp lệ. Định dạng hợp lệ: NV1, NV2...");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("staffcode", staffcode);
      formData.append("faceEmbedding", JSON.stringify(Array.from(faceDescriptor)));

      const res = await axios.post(
        `${process.env.REACT_APP_URL_BACKEND}/attendance/save-face`,
        formData
      );

      setNotification(res.data.message);
    } catch (err) {
      console.error("Save face failed:", err);
      setNotification("Lỗi khi lưu khuôn mặt");
    } finally {
      setSaving(false);
    }
  };

  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`d-flex app-container ${collapsed && window.innerWidth < 768 ? "sidebar-open" : ""}`}>
      {collapsed && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(false)}></div>
      )}
      <Sidebar />
      <div className="main-content d-flex justify-content-center">
        <div 
          style={{
            backgroundColor: "#fff",
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            maxWidth: 800,
            width: "100%",
          }}
        >
          <h2 className="text-center mb-4">Đăng ký khuôn mặt cho nhân viên</h2>

          {notification && (
            <div
              style={{
                marginBottom: 10,
                padding: 10,
                textAlign: "center",
                backgroundColor: notification.includes("thành công") || notification.includes("đã được ghi nhận")
                  ? "#28a745"
                  : "#dc3545",
                color: "#fff",
                borderRadius: 6,
                maxWidth: 300,
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: 18,
                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
              }}
            >
              {notification}
            </div>
          )}

          <div className="text-center mb-3">
            <input
              type="text"
              placeholder="Nhập mã của nhân viên"
              value={staffcode}
              onChange={(e) => setStaffcode(e.target.value)}
              style={{
                padding: "12px 16px",
                width: "80%",
                maxWidth: 400,
                fontSize: 16,
                borderRadius: 10,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 640,
              height: 480,
              margin: "auto",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
              style={{ width: "100%", height: "100%" }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4" style={{ marginTop: 30 }}>
            <button
              onClick={captureFace}
              disabled={capturing}
              style={{
                backgroundColor: capturing ? "#6c757d" : "#007bff",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 8,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {capturing ? (
                <>
                  <span className="spinner" /> Đang xử lý...
                </>
              ) : (
                "📸 Chụp khuôn mặt"
              )}
            </button>

            {faceDescriptor && (
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: "#ffc107",
                  color: "#000",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 16,
                }}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" /> Đang lưu...
                  </>
                ) : (
                  "💾 Lưu khuôn mặt"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRegistrationPage;
