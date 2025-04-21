import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { euclideanDistance } from "../utils/draw-mesh.util";
import { THRESHOLD } from "../constants/face-mesh.constant";
import useStaffStore from "../store/staffStore";
import axios from "axios";

const URL_MODEL = "/models";

function FaceDetect() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const staffFaces = useRef([]);
  const [notification, setNotification] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { faceList, getAllStaffFaceEmbedding } = useStaffStore((state) => state);
  const [checkedInStaffIds, setCheckedInStaffIds] = useState([]);
  const [checkedInStaff, setCheckedInStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    staffFaces.current = faceList;
  }, [faceList]);

  const loadModels = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(URL_MODEL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(URL_MODEL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(URL_MODEL);
      setModelsLoaded(true);
      console.log("✅ Face-api models loaded.");
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  const fetchCheckedInStaff = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await axios.get(
        `${process.env.REACT_APP_URL_BACKEND}/attendance/today-checkins?date=${today}`
      );
      setCheckedInStaffIds(res.data.map((r) => r.staffId));
      setCheckedInStaff(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách check-in hôm nay:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadModels();
      await getAllStaffFaceEmbedding();
      await fetchCheckedInStaff();
    };
    init();
  }, []);

  const detectAndProcess = async (type) => {
    if (
      !webcamRef.current?.video ||
      webcamRef.current.video.readyState !== 4 ||
      !modelsLoaded ||
      loading
    ) return;

    setLoading(true);
    setNotification("");

    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const displaySize = { width: videoWidth, height: videoHeight };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    try {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

      if (resizedDetections.length === 0) {
        setNotification("Không nhận diện được khuôn mặt!");
        setLoading(false);
        setTimeout(() => setNotification(""), 4000);
        return;
      }

      const faceDetected = resizedDetections[0];
      const faceVector = faceDetected.descriptor;
      const now = new Date();

      for (const staff of staffFaces.current) {
        if (!staff?.faceEmbedding?.length) continue;

        const distance = euclideanDistance(faceVector, staff.faceEmbedding);
        if (distance < THRESHOLD) {
          const matchedStaff = checkedInStaff.find((item) => item.staffId === staff._id);

          if (type === "check-in") {
            if (matchedStaff) {
              setNotification(`Nhân viên ${staff.staffcode} đã check-in hôm nay.`);
              setTimeout(() => setNotification(""), 4000);
              break;
            }

            const status = now.getHours() > 8 ? "late" : "present";
            const checkInData = {
              staffId: staff._id,
              staffcode: staff.staffcode,
              checkInTime: now.toISOString(),
              notes: "Check-in bằng nhận diện khuôn mặt",
              status,
            };

            const response = await axios.post(
              `${process.env.REACT_APP_URL_BACKEND}/attendance/check-in`,
              checkInData
            );

            const attendance = response.data.data;

            setCheckedInStaffIds((prev) => [...prev, staff._id]);
            setCheckedInStaff((prev) => [
              ...prev,
              {
                staffId: staff._id,
                checkInTime: now.toISOString(),
                attendanceId: attendance._id,
              },
            ]);

            const statusText = status === "present" ? "Đúng giờ" : "Trễ";
            setNotification(`Nhân viên ${staff.staffcode} check-in thành công (${statusText})`);
            setTimeout(() => setNotification(""), 4000);
            break;
          }

          if (type === "check-out") {
            if (!matchedStaff) {
              setNotification(`⚠️ Nhân viên ${staff.staffcode} chưa check-in hôm nay.`);
              setTimeout(() => setNotification(""), 4000);
              break;
            }

            const checkInTime = new Date(matchedStaff.checkInTime);
            const diffTime = (now - checkInTime) / (1000 * 60 * 60);

            if (diffTime < 5) {
              setNotification(`Chưa đủ 5 giờ để check-out. Còn lại ${(5 - diffTime).toFixed(2)} giờ.`);
              setTimeout(() => setNotification(""), 4000);
              break;
            }

            await axios.patch(`${process.env.REACT_APP_URL_BACKEND}/attendance/check-out`, {
              attendanceId: matchedStaff._id,
              checkOutTime: now.toISOString(),
            });

            setNotification(`Nhân viên ${staff.staffcode} đã check-out thành công.`);
            setTimeout(() => setNotification(""), 4000);
            break;
          }
        }
      }

      if (!notification) {
        setNotification("⚠️ Khuôn mặt không trùng khớp với bất kỳ nhân viên nào.");
        setTimeout(() => setNotification(""), 4000);
      }
    } catch (error) {
      console.error("Lỗi khi nhận diện:", error);
      setNotification("Lỗi khi nhận diện khuôn mặt.");
      setTimeout(() => setNotification(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
            marginTop: '5%'
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <div
          className="checkin-button"
        >
          <button
            onClick={() => detectAndProcess("check-in")}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Đang xử lý..." : "Đi vào (check-in)"}
          </button>
          <button
            onClick={() => detectAndProcess("check-out")}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ffc107",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Đang xử lý..." : "Đi ra (check-out)"}
          </button>
        </div>
        {notification && (
          <div
            style={{
              position: "relative",
              top: "auto",
              color: "#fff",
              backgroundColor:
                notification.includes("Không") || notification.includes("Lỗi") || notification.includes("không")
                  ? "#dc3545"
                  : "#28a745",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "18px",
              textAlign: "center",
              margin: "20px auto",
              maxWidth: 640,
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            {notification}
          </div>
        )}
      </header>
    </div>
  );
}

export default FaceDetect;
