'use client'
import React, { useState, useEffect } from 'react';


const MLoader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto hide loader after 3 seconds
    const autoHideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(() => onComplete(), 300);
      }
    }, 2000);

    return () => {
      clearTimeout(autoHideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="mloader-container">
      <div className="loader"></div>

      <style jsx>{`
        @font-face {
          font-family: 'Juana';
          font-weight: 500;
          font-style: normal;
        }

        .mloader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: transparent;
          backdrop-filter: blur(0.5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
          transition: opacity 0.3s ease-out;
        }

        .loader {
          width: fit-content;
          font-size: 20vw;
          font-family: 'BeniBold', system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: #0000;
          -webkit-text-stroke: 0px #fff;
          background:
            radial-gradient(0.71em at 50% 1em, #fff 99%, #0000 101%) calc(50% - 1em) 1em/2em 200% repeat-x text,
            radial-gradient(0.71em at 50% -0.5em, #0000 99%, #fff 101%) 50% 1.5em/2em 200% repeat-x text;
          animation: 
            l10-0 .8s linear infinite alternate,
            l10-1 2s linear infinite;
        }

        

        .loader:before {
          content: "SHOORAVERSE";
        }

        @keyframes l10-0 {
          to {
            background-position-x: 50%, calc(50% + 1em);
          }
        }

        @keyframes l10-1 {
          to {
            background-position-y: -.5em, 0;
          }
        }

        @media (max-width: 768px) {
          .loader {
            font-size: 8vh;
          }
        }

        @media (max-width: 480px) {
          .loader {
            font-size: 8vh;
          }
        }
      `}</style>
    </div>
  );
};

export default MLoader;