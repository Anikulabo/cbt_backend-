import React, { useRef, useEffect } from "react";
export const CameraComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { video: true };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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

  return (
    <div className="mt-3">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "70%",
          maxWidth: "500px",
          marginLeft:"4rem",
          transform: 'scaleX(-1)',
          borderRadius:"10px",
          border:"1px solid rgb(81, 194, 37)"
        }}
      />
    </div>
  );
};
