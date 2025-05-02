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
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

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

      // Gộp bản ghi theo staffId, lấy bản ghi mới nhất
      const groupedByStaff = Object.values(
        res.data.reduce((acc, item) => {
          if (!acc[item.staffId] || new Date(item.checkInTime) > new Date(acc[item.staffId].checkInTime)) {
            acc[item.staffId] = {
              staffId: item.staffId,
              attendanceId: item._id,
              checkInTime: item.checkInTime,
              checkOutTime: item.checkOutTime,
            };
          }
          return acc;
        }, {})
      );

      setCheckedInStaffIds(groupedByStaff.map((r) => r.staffId));
      setCheckedInStaff(groupedByStaff);
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
      checkInLoading ||
      checkOutLoading
    ) return;

    if (type === "check-in") setCheckInLoading(true);
    if (type === "check-out") setCheckOutLoading(true);
    setNotification("");

    setTimeout(async () => {
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
          setNotification("⚠️ Không nhận diện được khuôn mặt!");
          setCheckInLoading(false);
          setCheckOutLoading(false);
          setTimeout(() => setNotification(""), 4000);
          return;
        }

        const faceDetected = resizedDetections[0];
        const faceVector = faceDetected.descriptor;
        const now = new Date();

        let matched = false;

        for (const staff of staffFaces.current) {
          if (!staff?.faceEmbedding?.length) continue;

          const distance = euclideanDistance(faceVector, staff.faceEmbedding);

          if (distance < THRESHOLD) {
            matched = true;
            const matchedStaff = checkedInStaff.find((item) => item.staffId === staff._id);

            if (type === "check-in") {
              if (matchedStaff && matchedStaff.checkInTime) {
                setNotification(`⚠️ Nhân viên ${staff.staffcode}-${staff.name} đã check-in hôm nay.`);
                setTimeout(() => {
                  setNotification("")
                  context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }, 4000);
                return;
              }

              const isLate = now.getHours() > 10 || (now.getHours() === 10 && now.getMinutes() > 0);
              const status = isLate ? "late" : "present";

              const checkInData = {
                staffId: staff._id,
                staffcode: staff.staffcode,
                checkInTime: now.toISOString(),
                notes: "Check-in bằng nhận diện khuôn mặt",
                status,
              };

              await axios.post(
                `${process.env.REACT_APP_URL_BACKEND}/attendance/check-in`,
                checkInData
              );

              await fetchCheckedInStaff();

              const statusText = status === "present" ? "Đúng giờ" : "Trễ";
              setNotification(`✅ Nhân viên ${staff.staffcode}-${staff.name} check-in thành công (${statusText})`);
              setTimeout(() => {
                setNotification("")
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              }, 5000);
              return;
            }

            if (type === "check-out") {
              if (!matchedStaff || matchedStaff.checkOutTime) {
                setNotification(`⚠️ Nhân viên ${staff.staffcode}-${staff.name} chưa check-in hoặc đã check-out.`);
                setTimeout(() => {
                  setNotification("")
                  context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }, 4000);
                return;
              }

              await axios.patch(`${process.env.REACT_APP_URL_BACKEND}/attendance/check-out`, {
                attendanceId: matchedStaff.attendanceId,
                checkOutTime: now.toISOString(),
              });

              await fetchCheckedInStaff();

              setNotification(`✅ Nhân viên ${staff.staffcode}-${staff.name} đã check-out thành công.`);
              setTimeout(() => {
                setNotification("")
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              }, 5000);
              return;
            }
          }
        }

        if (!matched) {
          setNotification("⚠️ Gương mặt của bạn chưa được lưu trong hệ thống.");
          setTimeout(() => {
            setNotification("");
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }, 4000);
        }
      } catch (error) {
        console.error("Lỗi khi nhận diện:", error);
        setNotification("Lỗi khi nhận diện khuôn mặt.");
        setTimeout(() => setNotification(""), 4000);
      } finally {
        if (type === "check-in") setCheckInLoading(false);
        if (type === "check-out") setCheckOutLoading(false);
      }
    }, 0);
  };

  return (
    <div className="App" style={{ backgroundColor: "#f7f7f7", minHeight: "100vh", paddingTop: "40px" }}>
      <header
        className="App-header"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", width: "100%", paddingTop: "75%", margin: "0 auto" }}>
          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "80%",
              borderRadius: "12px",
              objectFit: "cover",
              zIndex: 2,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
        </div>

        {notification && (
          <div
            className={`notification-message ${notification.includes("Không")
              || notification.includes("Lỗi")
              || notification.includes("không")
              || notification.includes("đã check-in")
              || notification.includes("chưa check-in hoặc đã check-out")
              || notification.includes("chưa được lưu")
              ? "error"
              : ""
              }`}
          >
            {notification}
          </div>
        )}

        <div className="checkin-button">
          <button
            onClick={() => detectAndProcess("check-in")}
            disabled={checkInLoading || checkOutLoading}
            style={{
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: checkInLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {checkInLoading ? <><span className="spinner" /> Đang xử lý...</> : "Đi vào (check-in)"}
          </button>
          <button
            onClick={() => detectAndProcess("check-out")}
            disabled={checkInLoading || checkOutLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ffc107",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: checkOutLoading ? "not-allowed" : "pointer",
              maxWidth: "300px",
            }}
          >
            {checkOutLoading ? <><span className="spinner" /> Đang xử lý...</> : "Đi ra (check-out)"}
          </button>
        </div>
      </header>
    </div>
  );
}

export default FaceDetect;
