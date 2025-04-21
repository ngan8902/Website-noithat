import React, { useRef, useState, useEffect, useCallback } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import axios from "axios";
import * as tf from '@tensorflow/tfjs';
import Sidebar from "../components/sales/Sidebar";

const drawMesh = (faces, ctx) => {
  if (faces && faces.length > 0) {
    faces.forEach(face => {
      if (face && face.keypoints) {
        const keypoints = face.keypoints;
        for (let i = 0; i < keypoints.length; i++) {
          const {x, y} = keypoints[i];
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fillStyle = "gray";
          ctx.fill();
        }
      }
    });
  }
};

const FaceRegistration = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const captureButtonRef = useRef(null); 
  const [facemeshModel, setFacemeshModel] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [staffId, setStaffId] = useState("");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadFacemesh = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const model = await facemesh.createDetector(facemesh.SupportedModels.MediaPipeFaceMesh, {
          runtime: 'tfjs',
          solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@latest`,
          refineLandmarks: true,
        });
        setFacemeshModel(model);
        setModelLoaded(true);
        console.log("Facemesh model loaded.", model);
      } catch (error) {
        console.error("Failed to load facemesh model:", error);
        setMessage("Không tải được mô hình phát hiện khuôn mặt. Vui lòng kiểm tra kết nối mạng hoặc cấu hình trình duyệt.");
        setRegistrationStatus("error");
      }
    };
    loadFacemesh();
  }, []);

  const detect = useCallback(async (model) => {
    if (
      model &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      !capturedImage
    ) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      try {
        const faces = await model.estimateFaces(webcamRef.current.video);
        if (faces) {
          if (faces.length > 0) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawMesh(faces, ctx);
            setFaceData(faces[0]?.keypoints);
            if (captureButtonRef.current) {
              captureButtonRef.current.style.display = 'block'; 
            }
          } else {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setFaceData(null);
            if (captureButtonRef.current) {
              captureButtonRef.current.style.display = 'none'; 
            }
          }
        } else {
          console.log("estimateFaces trả về undefined.");
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          setFaceData(null);
          if (captureButtonRef.current) {
            captureButtonRef.current.style.display = 'none'; 
          }
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
        if (captureButtonRef.current) {
          captureButtonRef.current.style.display = 'none'; 
        }
      }
    }
  }, [capturedImage]);

  useEffect(() => {
    let intervalId;
    if (modelLoaded && !capturedImage) {
      intervalId = setInterval(() => {
        detect(facemeshModel);
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [detect, facemeshModel, capturedImage, modelLoaded]);

  const capture = useCallback(() => {
    setIsCapturing(true);
    setRegistrationStatus("loading");
    setMessage("Đang chụp ảnh...");
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log("faceData trước khi chụp:", faceData);
    if (imageSrc && faceData) {
      setCapturedImage(imageSrc);
      setMessage("Ảnh đã chụp, vui lòng nhập ID nhân viên và lưu.");
    } else if (!imageSrc) {
      setRegistrationStatus("error");
      setMessage("Không thể chụp ảnh. Vui lòng kiểm tra camera.");
    } else {
      setRegistrationStatus("error");
      setMessage("Không phát hiện thấy khuôn mặt rõ ràng. Vui lòng thử lại.");
    }
    // canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setIsCapturing(false);
  }, [faceData]);

  const retakePicture = () => {
    setCapturedImage(null);
    setFaceData(null);
    setRegistrationStatus("idle");
    setMessage("");
  };

  const handleStaffIdChange = (event) => {
    setStaffId(event.target.value);
  };

  const dataURLToBlob = (dataURL) => {
    const [header, base64] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  };

  const dataURLToFile = (dataURL, fileName) => {
    const blob = dataURLToBlob(dataURL);
    return new File([blob], fileName, { type: blob.type });
  };

  const saveFace = useCallback(async () => {
    if (!capturedImage || !faceData) {
      setRegistrationStatus("error");
      setMessage("Vui lòng chụp ảnh trước khi lưu.");
      return;
    }
    if (!staffId) {
      setRegistrationStatus("error");
      setMessage("Vui lòng nhập ID nhân viên.");
      return;
    }
    console.log("Bắt đầu quá trình lưu");
    setIsSaving(true);
    setMessage("Đang lưu dữ liệu khuôn mặt...");

    const faceFile = dataURLToFile(capturedImage, `${staffId}_face.jpg`);
    const formData = new FormData();
    formData.append("staffcode", staffId);
    const embeddingArray = faceData.map(point => [point.x, point.y, point.z]);
    formData.append("faceEmbedding", JSON.stringify(embeddingArray));
    formData.append("faceImage", faceFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL_BACKEND}/attendance/save-face`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("API Response:", response);
      if (response.status === 200) {
        setRegistrationStatus("success");
        setMessage("Đăng ký khuôn mặt thành công!");
        setCapturedImage(null);
        setFaceData(null);
        setStaffId("");
      } else {
        setRegistrationStatus("error");
        setMessage(`Lỗi đăng ký: ${response.data?.message || "Có lỗi xảy ra."}`);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setRegistrationStatus("error");
      setMessage(`Lỗi khi lưu khuôn mặt: ${error.message || "Lỗi kết nối hoặc backend."}`);
    } finally {
      console.log("Kết thúc quá trình lưu");
      setIsSaving(false);
    }
  }, [capturedImage, faceData, staffId]);

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">

        <div className="app-containerface">
          <header className="app-header">
            {!capturedImage && (
              <div className="webcam-container">
                <Webcam
                  ref={webcamRef}
                  className="webcam"
                  mirrored={false}
                  screenshotFormat="image/jpeg"
                />
                <canvas
                  ref={canvasRef}
                  className="overlay-canvas"
                />
              </div>
            )}
            {!capturedImage && (
              <button
                ref={captureButtonRef}
                onClick={capture}
                disabled={isCapturing || !modelLoaded || !faceData}
                className="capture-button"
              >
                {isCapturing
                  ? "Đang chụp..."
                  : !modelLoaded
                  ? "Đang tải..."
                  : !faceData
                  ? "Đang tìm khuôn mặt..."
                  : "Chụp Ảnh"}
              </button>
            )}

            {capturedImage && (
              <div className="captured-image-container">
                <h2 className="captured-image-title">Ảnh Đã Chụp:</h2>
                <img src={capturedImage} alt="Captured Face" className="captured-image" />
                <div className="controls-container">
                  <button onClick={retakePicture} className="retake-button">
                    Chụp Lại
                  </button>
                  <div className="staff-id-input">
                    <label htmlFor="staffId" className="staff-id-label">ID Nhân Viên:</label>
                    <input
                      type="text"
                      id="staffId"
                      value={staffId}
                      onChange={handleStaffIdChange}
                      placeholder="Nhập ID"
                      className="staff-id-field"
                    />
                  </div>
                  <button
                    onClick={saveFace}
                    disabled={!staffId || isSaving}
                    className="save-button"
                  >
                    {isSaving ? "Đang lưu..." : "Lưu Khuôn Mặt"}
                  </button>
                </div>
              </div>
            )}

            {registrationStatus !== "idle" && (
              <p className={`status-message ${registrationStatus}`}>
                {message}
              </p>
            )}
          </header>
        </div>

      </div>
    </div>
  );
}

export default FaceRegistration;