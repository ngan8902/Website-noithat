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

      // Lấy bản ghi chưa check-out (checkOutTime === null)
      const activeCheckIns = res.data.filter(r => r.checkOutTime === null);

      // Gộp bản ghi theo staffId (chỉ giữ 1 bản ghi cho mỗi staff)
      const uniqueCheckIns = Object.values(
        activeCheckIns.reduce((acc, item) => {
          if (!acc[item.staffId]) {
            acc[item.staffId] = {
              staffId: item.staffId,
              attendanceId: item._id,
              checkInTime: item.checkInTime,
            };
          }
          return acc;
        }, {})
      );

      setCheckedInStaffIds(uniqueCheckIns.map((r) => r.staffId));
      setCheckedInStaff(uniqueCheckIns);
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

        for (const staff of staffFaces.current) {
          if (!staff?.faceEmbedding?.length) continue;

          const distance = euclideanDistance(faceVector, staff.faceEmbedding);

          if (distance < THRESHOLD) {
            const matchedStaff = checkedInStaff.find((item) => item.staffId === staff._id);

            if (type === "check-in") {
              if (matchedStaff) {
                setNotification(`⚠️ Nhân viên ${staff.staffcode} đã check-in hôm nay.`);
                setTimeout(() => setNotification(""), 4000);
                return;
              }

              const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 0);
              const status = isLate ? "late" : "present";

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
              setNotification(`✅ Nhân viên ${staff.staffcode} check-in thành công (${statusText})`);
              setTimeout(() => setNotification(""), 5000);
              break;
            }

            if (type === "check-out") {
              if (!matchedStaff) {
                setNotification(`⚠️ Nhân viên ${staff.staffcode} chưa check-in hôm nay.`);
                setTimeout(() => setNotification(""), 4000);
                break;
              }

              await axios.patch(`${process.env.REACT_APP_URL_BACKEND}/attendance/check-out`, {
                attendanceId: matchedStaff.attendanceId,
                checkOutTime: now.toISOString(),
              });

              setNotification(`✅ Nhân viên ${staff.staffcode} đã check-out thành công.`);
              setTimeout(() => setNotification(""), 4000);
              break;
            }
          }
        }

        // if (!notification) {
        //   setNotification("⚠️ Khuôn mặt không trùng khớp với bất kỳ nhân viên nào.");
        //   setTimeout(() => setNotification(""), 4000);
        // }
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
        <div style={{ position: "relative", width: 640, height: 480, margin: "0 auto" }}>
          <Webcam
            ref={webcamRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              objectFit: "cover",
              zIndex: 2,
            }}
          />
        </div>

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

        <div
          className="checkin-button"
        >
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
            {checkInLoading ?
              <>
                <span className="spinner" /> Đang xử lý...
              </> : "Đi vào (check-in)"}
          </button>
          <button
            onClick={() => detectAndProcess("check-out")}
            disabled={checkInLoading || checkOutLoading}
            style={{
              padding: "12px 24px",
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: checkOutLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {checkOutLoading ?
              <>
                <span className="spinner" /> Đang xử lý...
              </> : "Đi ra (check-out)"}
          </button>
        </div>
        {notification && (
          <div
            style={{
              marginTop: "30px",
              backgroundColor:
                notification.includes("Không") || notification.includes("Lỗi") || notification.includes("không") || notification.includes("đã check-in")
                  ? "#dc3545"
                  : "#28a745",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
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
