'use client';

import { useState, useEffect } from 'react';

export default function NewAdvertisementBanner() {
  const [bannerText, setBannerText] = useState('🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Load banner text from localStorage
    const savedText = localStorage.getItem('adBannerText');
    if (savedText) {
      setBannerText(savedText);
    }

    // Load banner active status
    const savedActive = localStorage.getItem('adBannerActive');
    if (savedActive !== null) {
      setIsActive(savedActive === 'true');
    }

    // Add class to body if banner is active
    if (isActive) {
      document.body.classList.add('ad-banner-visible');
    } else {
      document.body.classList.remove('ad-banner-visible');
    }

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'adBannerText') {
        setBannerText(e.newValue || '');
      }
      if (e.key === 'adBannerActive') {
        const newActive = e.newValue === 'true';
        setIsActive(newActive);
        if (newActive) {
          document.body.classList.add('ad-banner-visible');
        } else {
          document.body.classList.remove('ad-banner-visible');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check for updates every 1 second
    const interval = setInterval(() => {
      const currentText = localStorage.getItem('adBannerText');
      if (currentText && currentText !== bannerText) {
        setBannerText(currentText);
      }
      
      const currentActive = localStorage.getItem('adBannerActive');
      if (currentActive !== null) {
        const newActive = currentActive === 'true';
        if (newActive !== isActive) {
          setIsActive(newActive);
          if (newActive) {
            document.body.classList.add('ad-banner-visible');
          } else {
            document.body.classList.remove('ad-banner-visible');
          }
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [bannerText, isActive]);

  if (!isActive) return null;



  return (
    <>
      <div className="Discountoffer">
        <div className="marquee-wrapper">
          <div className="marquee">
            <span>{bannerText}</span>
            <span>{bannerText}</span>
            <span>{bannerText}</span>
            <span>{bannerText}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .Discountoffer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(90deg,rgb(234, 92, 3),rgb(255, 225, 0));
          padding: 7px 0;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          overflow: hidden;
          z-index: 1000;
        }

        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          display: flex;
          white-space: nowrap;
          position: relative;
        }

        .marquee {
          display: flex;
          animation: scrollText 20s linear infinite;
          min-width: fit-content;
        }

        .marquee span {
          font-size: 1.4rem;
          display: inline-block;
          padding-right: 10px;
          color: rgb(0, 0, 0);
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .Discountoffer {
            padding: 4px 0;
          }

          .marquee span {
            font-size: 0.9rem;
          }
        }

        .marquee strong {
          font-weight: 600;
          color: black;
        }

        b {
          margin: 0 1rem;
        }

        @keyframes scrollText {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .view {
          padding-top: 50px;
        }
      `}</style>
    </>
  );
} 