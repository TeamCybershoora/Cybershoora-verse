'use client';

import { useState, useEffect } from 'react';

export default function AdvertisementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerConfig, setBannerConfig] = useState({
    text: '🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!',
    backgroundColor: 'linear-gradient(90deg, rgb(234, 92, 3), rgb(255, 225, 0))',
    textColor: '#000000',
    fontSize: '18',
    fontWeight: 'bold',
    isActive: true,
    scrollSpeed: '20'
  });

  const handleClose = () => {
    setIsVisible(false);
    // Store in localStorage to remember user's preference
    localStorage.setItem('adBannerClosed', 'true');
    // Remove class from body
    document.body.classList.remove('ad-banner-visible');
  };

  useEffect(() => {
    // Load banner configuration from localStorage
    const savedConfig = localStorage.getItem('adBannerConfig');
    if (savedConfig) {
      setBannerConfig(JSON.parse(savedConfig));
    }

    // Check if user previously closed the banner
    const bannerClosed = localStorage.getItem('adBannerClosed');
    if (bannerClosed === 'true') {
      setIsVisible(false);
    } else {
      // Add class to body when banner is visible
      document.body.classList.add('ad-banner-visible');
    }
  }, []);

  // Update CSS custom properties when bannerConfig changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--banner-bg', bannerConfig.backgroundColor);
    root.style.setProperty('--banner-text-color', bannerConfig.textColor);
    root.style.setProperty('--banner-font-size', `${bannerConfig.fontSize}px`);
    root.style.setProperty('--banner-font-weight', bannerConfig.fontWeight);
    root.style.setProperty('--banner-scroll-speed', `${bannerConfig.scrollSpeed}s`);
    
    console.log('Banner config updated:', bannerConfig);
    console.log('CSS variables set:', {
      '--banner-bg': bannerConfig.backgroundColor,
      '--banner-text-color': bannerConfig.textColor,
      '--banner-font-size': `${bannerConfig.fontSize}px`,
      '--banner-font-weight': bannerConfig.fontWeight,
      '--banner-scroll-speed': `${bannerConfig.scrollSpeed}s`
    });
  }, [bannerConfig]);

  // Listen for storage changes to update banner in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'adBannerConfig') {
        const newConfig = JSON.parse(e.newValue || '{}');
        console.log('Storage change detected:', newConfig);
        setBannerConfig(newConfig);
      }
    };

    // Check for updates every 1 second (for cross-tab updates)
    const interval = setInterval(() => {
      const savedConfig = localStorage.getItem('adBannerConfig');
      if (savedConfig) {
        const newConfig = JSON.parse(savedConfig);
        if (JSON.stringify(newConfig) !== JSON.stringify(bannerConfig)) {
          console.log('Config change detected via interval:', newConfig);
          setBannerConfig(newConfig);
        }
      }
    }, 1000);

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [bannerConfig]);

  if (!isVisible || !bannerConfig.isActive) return null;

  return (
    <>
      <div 
        className="Discountoffer"
        style={{
          background: bannerConfig.backgroundColor,
          fontSize: `${bannerConfig.fontSize}px`,
          fontWeight: bannerConfig.fontWeight
        }}
      >
        <div className="marquee-wrapper">
          <div 
            className="marquee"
            style={{
              animation: `scrollText ${bannerConfig.scrollSpeed}s linear infinite`
            }}
          >
            <span style={{ color: bannerConfig.textColor }}>{bannerConfig.text}</span>
            <span style={{ color: bannerConfig.textColor }}>{bannerConfig.text}</span>
            <span style={{ color: bannerConfig.textColor }}>{bannerConfig.text}</span>
            <span style={{ color: bannerConfig.textColor }}>{bannerConfig.text}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .Discountoffer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: var(--banner-bg, linear-gradient(90deg,rgb(234, 92, 3),rgb(255, 225, 0)));
          padding: 7px 0;
          font-size: var(--banner-font-size, 18px);
          font-weight: var(--banner-font-weight, bold);
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
          animation: scrollText var(--banner-scroll-speed, 20s) linear infinite;
          min-width: fit-content;
        }

        .marquee span {
          font-size: 1.4rem;
          display: inline-block;
          padding-right: 10px;
          color: var(--banner-text-color, rgb(0, 0, 0));
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
          color: var(--banner-text-color, black);
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