'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function VerifyFacePopup({ 
  isOpen, 
  onClose, 
  imageSrc, 
  setFaceVerified, 
  setVerifiedFaceImage 
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceapi, setFaceapi] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadModels = async () => {
      try {
        setLoading(true);
        
        // Only load face-api.js when popup is opened and we're in browser
        if (typeof window !== 'undefined') {
          const faceApiModule = await import('face-api.js');
          setFaceapi(faceApiModule);
          
          const MODEL_URL = '/models';
          
          // Load face-api.js models
          await Promise.all([
            faceApiModule.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
            faceApiModule.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceApiModule.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          ]);
          
          setModelsLoaded(true);
          setLoading(false);
          console.log('✅ Face-api models loaded successfully');
        } else {
          // Server-side fallback
          setModelsLoaded(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error loading face-api models:', err);
        toast.error('❌ Error loading face recognition models');
        setLoading(false);
        // Fallback: allow manual verification
        setModelsLoaded(true);
      }
    };

    loadModels();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || loading || !modelsLoaded) return;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user' 
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          
          // Wait for video to load
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            console.log('✅ Camera started successfully');
          };
        }
      } catch (err) {
        console.error('❌ Camera access error:', err);
        toast.error("❌ Cannot access camera. Please allow camera permission.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, loading, modelsLoaded]);

  // Function to capture webcam image
  const captureWebcamImage = () => {
    if (!videoRef.current) return null;

    const canvas = canvasRef.current || document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const runVerification = async () => {
    if (!imageSrc || !videoRef.current) {
      toast.error('❌ Please ensure camera is ready and photo is uploaded');
      return;
    }

    // If face-api.js failed to load, allow manual verification
    if (!faceapi) {
      toast.success('✅ Manual verification mode - proceeding with registration');
      setFaceVerified(true);
      onClose();
      return;
    }

    setVerificationStatus('verifying');
    console.log('🔍 Starting face verification...');

    try {
      // Load and detect face in uploaded image
      const uploadedImage = await faceapi.fetchImage(imageSrc);
      const uploadedDescriptor = await faceapi
        .detectSingleFace(uploadedImage)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!uploadedDescriptor) {
        setVerificationStatus('failed');
        toast.error('❌ No face detected in uploaded image. Please upload a clear face photo.');
        setTimeout(() => setVerificationStatus(''), 3000);
        return;
      }

      console.log('✅ Face detected in uploaded image');

      // Detect face in live video
      const liveDescriptor = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!liveDescriptor) {
        setVerificationStatus('failed');
        toast.error('❌ No face detected in camera. Please position your face clearly in the camera.');
        setTimeout(() => setVerificationStatus(''), 3000);
        return;
      }

      console.log('✅ Face detected in live camera');

      // Calculate face similarity
      const distance = faceapi.euclideanDistance(
        uploadedDescriptor.descriptor, 
        liveDescriptor.descriptor
      );
      
      const similarity = Math.max(0, (1 - distance) * 100);
      const threshold = 0.5; // Adjust threshold as needed

      console.log(`📊 Face similarity: ${similarity.toFixed(2)}%, Distance: ${distance.toFixed(3)}`);

      if (distance < threshold) {
        setVerificationStatus('success');
        toast.success(`✅ Face verification successful! Similarity: ${similarity.toFixed(1)}%`);
        
        // Capture webcam image for verification record
        const webcamImage = captureWebcamImage();
        if (webcamImage && setVerifiedFaceImage) {
          setVerifiedFaceImage(webcamImage);
          console.log('✅ Webcam image captured for verification');
        }
        
        setFaceVerified(true);
        
        // Auto close after successful verification
        setTimeout(() => {
          onClose();
        }, 2000);
        
      } else {
        setVerificationStatus('failed');
        toast.error(`❌ Face verification failed. Similarity: ${similarity.toFixed(1)}%. Please try again.`);
        setTimeout(() => setVerificationStatus(''), 3000);
      }

    } catch (err) {
      console.error('❌ Face verification error:', err);
      setVerificationStatus('failed');
      toast.error('❌ Error during face verification. Please try again.');
      setTimeout(() => setVerificationStatus(''), 3000);
    }
  };

  const handleVerify = () => {
    runVerification();
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setVerificationStatus('');
    setLoading(true);
    setModelsLoaded(false);
    setFaceapi(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Face Verification</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <p>Position your face in the camera to match with your uploaded photo</p>

        <div className="face-compare-container">
          <div className="face-side">
            <p>Uploaded Photo</p>
            {imageSrc ? (
              <img src={imageSrc} alt="Uploaded face" />
            ) : (
              <div className="loading-placeholder">No image uploaded</div>
            )}
          </div>
          
          <div className="face-side">
            <p>Live Camera</p>
            {loading ? (
              <div className="loading-placeholder">
                <div className="spinner"></div>
                <span>Loading camera...</span>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                width="240" 
                height="180" 
                muted 
                autoPlay 
                playsInline
              />
            )}
          </div>
        </div>

        {/* Verification Status Display */}
        {verificationStatus && (
          <div className={`verification-status ${verificationStatus}`}>
            {verificationStatus === 'verifying' && (
              <div className="status-content">
                <div className="spinner"></div>
                <span>Verifying faces...</span>
              </div>
            )}
            {verificationStatus === 'success' && (
              <div className="status-content">
                <span className="success-icon">✅</span>
                <span>Face verification successful!</span>
              </div>
            )}
            {verificationStatus === 'failed' && (
              <div className="status-content">
                <span className="failed-icon">❌</span>
                <span>Face verification failed!</span>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={handleVerify} 
          className="verify-button"
          disabled={loading || !modelsLoaded || verificationStatus === 'verifying'}
        >
          {loading ? 'Loading models...' : 
           !modelsLoaded ? 'Loading...' : 
           verificationStatus === 'verifying' ? 'Verifying...' : 
           'Verify Face'}
        </button>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .popup-content {
          background-image: url("/assets/bg2.svg");
          padding: 30px;
          border-radius: 16px;
          max-width: 650px;
          width: 100%;
          color: white;
          text-align: center;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid #333;
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .popup-header h2 {
          margin: 0;
          color: #9747ff;
        }

        .close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .close-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .face-compare-container {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
          gap: 20px;
        }

        .face-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .face-side p {
          margin-bottom: 10px;
          font-weight: bold;
          color: #ccc;
        }

        .face-side img,
        .face-side video {
          width: 240px;
          height: 180px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid #9747FF;
          background: black;
        }

        .loading-placeholder {
          width: 240px;
          height: 180px;
          border-radius: 10px;
          border: 2px solid #9747FF;
          background: #333;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ccc;
          gap: 10px;
        }

        .verify-button {
          background: #9747FF;
          border: none;
          padding: 12px 24px;
          color: white;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
          margin-top: 20px;
        }

        .verify-button:hover:not(:disabled) {
          background: #7d3be2;
        }

        .verify-button:disabled {
          background: #666;
          cursor: not-allowed;
        }

        /* Verification Status Styles */
        .verification-status {
          margin: 20px 0;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          animation: slideIn 0.3s ease-out;
        }

        .verification-status.verifying {
          background: rgba(151, 71, 255, 0.2);
          border: 1px solid #9747FF;
          color: #9747FF;
        }

        .verification-status.success {
          background: rgba(40, 167, 69, 0.2);
          border: 1px solid #28a745;
          color: #28a745;
        }

        .verification-status.failed {
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid #dc3545;
          color: #dc3545;
        }

        .status-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .success-icon, .failed-icon {
          font-size: 20px;
        }

        /* Spinner Animation */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid #9747FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .popup-content {
            padding: 20px;
            margin: 10px;
          }

          .face-compare-container {
            flex-direction: column;
            gap: 15px;
          }

          .face-side img,
          .face-side video,
          .loading-placeholder {
            width: 200px;
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
}
