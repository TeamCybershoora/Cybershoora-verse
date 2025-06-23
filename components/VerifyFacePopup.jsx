// components/VerifyFacePopup.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';

Modal.setAppElement('#__next');

export default function VerifyFacePopup({ isOpen, onClose, imageSrc, setFaceVerified }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setLoadingModels(false);
      } catch (error) {
        toast.error('❌ Error loading models');
        console.error(error);
      }
    };

    loadModels();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || loadingModels) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    });

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, loadingModels]);

  const handleVerify = async () => {
    if (!videoRef.current || !imageSrc) return;

    const uploadedImage = await faceapi.fetchImage(imageSrc);
    const displaySize = { width: 320, height: 240 };

    faceapi.matchDimensions(canvasRef.current, displaySize);

    const uploadedDescriptor = await faceapi
      .detectSingleFace(uploadedImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const liveResult = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!uploadedDescriptor || !liveResult) {
      toast.error('❌ Face not detected clearly. Try again in good light.');
      return;
    }

    const distance = faceapi.euclideanDistance(uploadedDescriptor.descriptor, liveResult.descriptor);
    const accuracy = Math.max(0, (1 - distance) * 100).toFixed(2);

    if (distance < 0.5) {
      toast.success(`✅ Face Matched (${accuracy}% confidence)`);
      setFaceVerified(true);
      onClose();
    } else {
      toast.error(`❌ Face Not Matched (${accuracy}% confidence)`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Face Verification"
      className="popup-modal"
      overlayClassName="popup-overlay"
    >
      <h2 className="popup-title">Face Verification</h2>
      <p className="popup-instructions">Ensure you are in good light. Match your face with the selected image.</p>
      <div className="popup-content">
        <img src={imageSrc} alt="Uploaded Face" className="popup-img" />
        <video ref={videoRef} width="320" height="240" className="popup-video" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <button onClick={handleVerify} className="verify-btn">Verify Face</button>
    </Modal>
  );
}
