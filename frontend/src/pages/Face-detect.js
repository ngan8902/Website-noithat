import React, { useRef, useState, useEffect, useCallback } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { getFeatureVector, euclideanDistance } from "../utils/draw-mesh.util";
import { THRESHOLD } from '../constants/face-mesh.constant';
import useStaffStore from "../store/staffStore";
// import * as tf from '@tensorflow/tfjs';


function FaceDetect() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const staffFaces = useRef([]);
  const [facemeshModel, setFacemeshModel] = useState(null);
  const {faceList, getAllStaffFaceEmbedding} = useStaffStore((state) => state);

  console.log('list face registrationed', faceList)
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
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          //drawMesh(faces, ctx);
          const faceDetected = faces[0];
          const faceDetectVector = getFeatureVector(faceDetected.keypoints);

          staffFaces.current.forEach((staff) => {
            if(staff && staff.faceEmbedding && staff.faceEmbedding.length > 0) {
              const distance = euclideanDistance(faceDetectVector, staff.faceEmbedding);
              if (distance < THRESHOLD) {
                console.log("Faces match!", staff.name); 
              } else {
                console.log("Faces do NOT match.");
              }
            }
          })
        } else {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (facemeshModel) {
        detect(facemeshModel);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [detect, facemeshModel]);

  useEffect(() => {
    runFacemesh();
    getAllStaffFaceEmbedding();
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
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  )
}

export default FaceDetect;