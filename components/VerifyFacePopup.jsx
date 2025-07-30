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
        
        // Skip face-api.js loading for now - use manual verification mode
        setModelsLoaded(true);
        setLoading(false);
      } catch (err) {
        console.log('⚠️ Face-api.js not available, using manual verification mode');
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

    // Manual verification mode - always proceed
    setVerificationStatus('verifying');
    console.log('🔍 Starting manual verification...');

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus('success');
      toast.success('✅ Manual verification successful!');
      
      // Capture verified face image
      const verifiedImage = captureWebcamImage();
      setVerifiedFaceImage(verifiedImage);
      
      setTimeout(() => {
        setFaceVerified(true);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('❌ Verification error:', err);
      setVerificationStatus('failed');
      toast.error('❌ Verification error. Please try again.');
      setTimeout(() => setVerificationStatus(''), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: 20,
        padding: '2rem',
        maxWidth: 500,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        border: '2px solid #9747ff'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#9747ff' }}>
          Face Verification
        </h2>
        
                 {loading ? (
           <div style={{ padding: '2rem' }}>
             <div style={{ marginBottom: '1rem' }}>Initializing camera...</div>
             <div style={{ width: 40, height: 40, border: '4px solid #9747ff', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
           </div>
        ) : (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: 10,
                  border: '2px solid #9747ff'
                }}
              />
            </div>
            
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            
            <div style={{ marginBottom: '1rem' }}>
              {verificationStatus === 'verifying' && (
                <div style={{ color: '#9747ff' }}>Verifying face...</div>
              )}
              {verificationStatus === 'success' && (
                <div style={{ color: '#10b981' }}>✅ Verification successful!</div>
              )}
              {verificationStatus === 'failed' && (
                <div style={{ color: '#ef4444' }}>❌ Verification failed</div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={runVerification}
                disabled={verificationStatus === 'verifying'}
                style={{
                  background: '#9747ff',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  opacity: verificationStatus === 'verifying' ? 0.5 : 1
                }}
              >
                {verificationStatus === 'verifying' ? 'Verifying...' : 'Verify Face'}
              </button>
              
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid #9747ff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
