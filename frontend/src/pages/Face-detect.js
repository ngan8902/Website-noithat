import React, { useRef, useState, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { getFeatureVector, euclideanDistance } from "../utils/draw-mesh.util";
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
  

  useEffect(() => {
    staffFaces.current = faceList;
  }, [faceList]);


  const loadModels = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(URL_MODEL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(URL_MODEL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(URL_MODEL);
      setModelsLoaded(true);
      console.log("Face-api models loaded.");
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  const detectAndCheckIn = useCallback(async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      modelsLoaded
    ) {
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

        if (resizedDetections.length > 0) {
          const faceDetected = resizedDetections[0];
          const faceDetectVector = faceDetected.descriptor;

          for (const staff of staffFaces.current) {
            if (staff?.faceEmbedding?.length > 0) {
              const distance = euclideanDistance(faceDetectVector, staff.faceEmbedding);
              if (distance < THRESHOLD) {
                if (checkedInStaffIds.includes(staff._id)) {
                  setNotification(`Nhân viên ${staff.staffcode} - ${staff.name} đã check-in hôm nay.`);
                  return;
                }

                try {
                  const now = new Date();
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

                  console.log("Check-in successful:", response.data);
                  setCheckedInStaffIds((prev) => [...prev, staff._id]);

                  const statusText = status === "present" ? "Đúng giờ" : "Trễ";
                  setNotification(`Nhân viên ${staff.staffcode} - ${staff.name} check-in thành công (${statusText})`);
                  return;
                } catch (error) {
                  console.error("Error during check-in:", error);
                  setNotification("Lỗi khi thực hiện check-in.");
                }
              }
            }
          }

          setNotification("⚠️ Khuôn mặt không trùng khớp với bất kỳ nhân viên nào.");
        } else {
          setNotification("Không nhận diện được khuôn mặt.");
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    }
  }, [checkedInStaffIds, modelsLoaded]);

  useEffect(() => {
    const fetchCheckedInStaff = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await axios.get(
          `${process.env.REACT_APP_URL_BACKEND}/attendance/today-checkins?date=${today}`
        );
        const checkedIds = res.data.map((record) => record.staffId);
        setCheckedInStaffIds(checkedIds);
      } catch (error) {
        console.error("Lỗi khi tải danh sách check-in hôm nay:", error);
      }
    };

    loadModels();
    getAllStaffFaceEmbedding();
    fetchCheckedInStaff();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (modelsLoaded) detectAndCheckIn();
    }, 1200);

    return () => clearInterval(intervalId);
  }, [detectAndCheckIn, modelsLoaded]);

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
        {notification && (
          <div
            style={{
              position: "relative",
              top: 500,
              color: "#fff",
              backgroundColor:
                notification.includes("không trùng khớp") || notification.includes("Lỗi")
                  ? "#dc3545"
                  : "#28a745",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "18px",
              textAlign: "center",
              margin: "20px auto",
              maxWidth: 640,
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease-in-out",
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
