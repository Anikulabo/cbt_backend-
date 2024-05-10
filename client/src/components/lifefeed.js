import "./top.css";
import React, { useRef, useEffect, useState } from "react";
const MINIMUM_RESOLUTION_WIDTH = 500; // Minimum width for HD resolution
const MINIMUM_RESOLUTION_HEIGHT = 150; // Minimum height for HD resolution
export const CameraComponent = (props) => {
  const videoRef = useRef(null);
  const [brightnessMessage, setBrightnessMessage] = useState({
    message: "",
    error: false,
  });
  useEffect(() => {
    const constraints = { video: true };
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadedmetadata", () => {
            checkBrightness();
          });
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    // Clean up function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);
  useEffect(() => {
    if (props.time === 0) {
      stopCamera();
    }
  }, [props.time]);
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
  
      tracks.forEach((track) => {
        track.stop();
      });
    }
  };
  const checkBrightness = () => {
    const check = () => {
      try {
        const clarity = calculateBrightness();
        if (!clarity.resolution || !clarity.brightness) {
          setBrightnessMessage({
            message: "Camera feed is not clear enough.",
            error: true,
          });
        } else {
          setBrightnessMessage({ message: "Very Good!", error: false });
        }
        setTimeout(check, 1000); // Check brightness every second
      } catch (error) {
        console.error("Error grabbing frame:", error);
      }
    };
    check();
  };
  const calculateBrightness = () => {
    const video = videoRef.current;
    const clarity = {
      resolution: false,
      brightness: false,
    };
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let brightness = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      brightness +=
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    }
    const calculatedbrightness = brightness / (imageData.data.length / 4);
    if (calculatedbrightness > 80) {
      clarity.brightness = true;
    }
    if (
      video.videoWidth >= MINIMUM_RESOLUTION_WIDTH &&
      video.videoHeight >= MINIMUM_RESOLUTION_HEIGHT
    ) {
      clarity.resolution = true;
    }
    return clarity;
  };
  return (
    <div
      className="mt-3"
      style={{
        marginTop: "10px",
        fontWeight: "bolder",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "70%",
          maxWidth: "500px",
          marginLeft: "4rem",
          transform: "scaleX(-1)",
          borderRadius: "10px",
          border: "1px solid rgb(81, 194, 37)",
        }}
      />
      <div>
        Status :{" "}
        <span
          style={{
            color: brightnessMessage.error ? "red" : "rgb(81, 194, 37)",
          }}
        >
          {brightnessMessage.message}
        </span>
      </div>
      <div>
        Done:
        <span
          style={{
            color:
              props.answers.length < props.total ? "red" : "rgb(81, 194, 37)",
            marginLeft: "15px",
          }}
        >
          {props.answers.length}
        </span>
      </div>
      <div>
        Total: <span style={{ marginLeft: "15px" }}>{props.total}</span>
      </div>
      <button
        className="bg-lemon text-light"
        style={{ padding: "5px", marginTop: "15px", borderRadius: "5px" }}
      >
        Submit
      </button>
    </div>
  );
};
