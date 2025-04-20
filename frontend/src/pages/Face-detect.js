import React, { useRef, useState, useEffect, useCallback } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { getFeatureVector, euclideanDistance } from "../utils/draw-mesh.util";
import { THRESHOLD } from '../constants/face-mesh.constant';
import useStaffStore from "../store/staffStore";
import axios from "axios";
import { model } from "mongoose";
// import * as tf from '@tensorflow/tfjs';

function FaceDetect() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const staffFaces = useRef([]);
  const [facemeshModel, setFacemeshModel] = useState(null);
  const { faceList, getAllStaffFaceEmbedding } = useStaffStore((state) => state);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkInTimeoutId, setCheckInTimeoutId] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  staffFaces.current = faceList;

  const runFacemesh = useCallback(async () => {
    try {
      const model = await facemesh.createDetector(facemesh.SupportedModels.MediaPipeFaceMesh, {
        runtime: 'tfjs',
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@latest`,
        refineLandmarks: true,
      });
      setFacemeshModel(model);
      console.log("Facemesh model loaded.", model);

    } catch (error) {
      console.error("Failed to load facemesh model:", error);
    }
  }, []);

  const detect = useCallback(async (model) => {
    if (
      model &&
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      try {
        const faces = await model.estimateFaces(video);
        if (faces && faces.length > 0) {
          setIsFaceDetected(true);
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          const faceDetected = faces[0];
          const faceDetectVector = getFeatureVector(faceDetected.keypoints);

          staffFaces.current.forEach(async (staff) => {
            if (staff && staff.faceEmbedding && staff.faceEmbedding.length > 0) {
              const distance = euclideanDistance(faceDetectVector, staff.faceEmbedding);
              if (distance < THRESHOLD && !hasCheckedInToday && isCheckingIn) {
                try {
                  const now = new Date();
                  const expectedCheckInHour = 8;
                  const checkInHour = now.getHours();
                  let status = 'present';
                  if (checkInHour > expectedCheckInHour) {
                    status = 'late';
                  }

                  const checkInData = {
                    staffId: staff._id,
                    staffcode: staff.staffcode,
                    checkInTime: now.toISOString(),
                    notes: "Chấm công bằng nhận diện khuôn mặt",
                    status: status
                  };
                  const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/attendance/check-in`, checkInData);
                  console.log("Chấm công thành công:", response.data);
                  setIsCheckingIn(false);
                  setHasCheckedInToday(true);

                  const timeoutId = setTimeout(() => {
                    setHasCheckedInToday(false);
                    console.log("Đã qua 5 tiếng. Bây giờ có thể check-out.");
                  }, 5 * 60 * 60 * 1000);

                  setCheckInTimeoutId(timeoutId);

                } catch (error) {
                  console.error("Lỗi trong quá trình chấm công:", error);
                  setIsCheckingIn(false);
                }
              } else if (distance >= THRESHOLD && isCheckingIn) {
                console.log("Khuôn mặt không khớp.");
              } else if (hasCheckedInToday && isCheckingIn) {
                console.log("Đã chấm công hôm nay.");
                setIsCheckingIn(false);
              }
            }
          });
        } else {
          setIsFaceDetected(false);
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      } catch (error) {
        console.error("Lỗi khi nhận diện khuôn mặt:", error);
      }
    }
  }, [model, isCheckingIn, hasCheckedInToday]);

  const handleCheckInButtonClick = () => {
    setIsCheckingIn(true);
    console.log("Nút chấm công đã được nhấn.");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (facemeshModel) {
        detect(facemeshModel);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [detect, facemeshModel]);

  useEffect(() => {
    const resetCheckInStatus = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const timeUntilMidnight = midnight.getTime() + 24 * 60 * 60 * 1000 - now.getTime();

      const timeoutId = setTimeout(() => {
        setHasCheckedInToday(false);
        console.log("Trạng thái chấm công đã được reset cho ngày mới.");
      }, timeUntilMidnight);

      return () => clearTimeout(timeoutId);
    };

    resetCheckInStatus();
    getAllStaffFaceEmbedding();
    runFacemesh();
  }, []);

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
            zindex: 9,
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
            zindex: 10, // Đảm bảo canvas có z-index cao hơn nút nếu cần
            width: 640,
            height: 480,
          }}
        />
        {isFaceDetected && (
          <button onClick={handleCheckInButtonClick} disabled={hasCheckedInToday} className="checkin-button">
            {hasCheckedInToday ? "Đã Chấm Công" : "Chấm Công"}
          </button>
        )}
        {!isFaceDetected && <p className="searching-text">Đang tìm kiếm khuôn mặt...</p>}
      </header>
    </div>
  )
}

export default FaceDetect;