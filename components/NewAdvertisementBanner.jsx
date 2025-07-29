'use client';

import { useState, useEffect } from 'react';

export default function NewAdvertisementBanner() {
  const [bannerText, setBannerText] = useState('🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!');
  const [isActive, setIsActive] = useState(true);
  const [bannerColors, setBannerColors] = useState(['#ea5c03', '#ffe100']);
  const [bannerFont, setBannerFont] = useState({ size: 18, weight: 'bold', color: '#000000' });
  const [scrollSpeed, setScrollSpeed] = useState(20); // Default 20 seconds

  useEffect(() => {
    // Load banner text from localStorage
    const savedText = localStorage.getItem('adBannerText');
    if (savedText && savedText !== bannerText) {
      setBannerText(savedText);
    }

    // Load banner active status
    const savedActive = localStorage.getItem('adBannerActive');
    if (savedActive !== null) {
      const newActive = savedActive === 'true';
      if (newActive !== isActive) {
        setIsActive(newActive);
      }
    }

    // Load banner colors
    const savedColors = localStorage.getItem('adBannerColors');
    if (savedColors) {
      try {
        const parsedColors = JSON.parse(savedColors);
        if (JSON.stringify(parsedColors) !== JSON.stringify(bannerColors)) {
          setBannerColors(parsedColors);
        }
      } catch (e) {
        console.error('Error parsing banner colors:', e);
      }
    }

    // Load banner font settings
    const savedFont = localStorage.getItem('adBannerFont');
    if (savedFont) {
      try {
        const parsedFont = JSON.parse(savedFont);
        if (JSON.stringify(parsedFont) !== JSON.stringify(bannerFont)) {
          setBannerFont(parsedFont);
        }
      } catch (e) {
        console.error('Error parsing banner font:', e);
      }
    }

    // Load scroll speed
    const savedScrollSpeed = localStorage.getItem('adBannerScrollSpeed');
    if (savedScrollSpeed) {
      const speed = parseInt(savedScrollSpeed);
      if (!isNaN(speed) && speed !== scrollSpeed) {
        setScrollSpeed(speed);
      }
    }
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'adBannerText' && e.newValue !== bannerText) {
        setBannerText(e.newValue || '');
      }
      if (e.key === 'adBannerActive') {
        const newActive = e.newValue === 'true';
        if (newActive !== isActive) {
          setIsActive(newActive);
        }
      }
      if (e.key === 'adBannerColors') {
        try {
          const newColors = JSON.parse(e.newValue || '["#ea5c03", "#ffe100"]');
          if (JSON.stringify(newColors) !== JSON.stringify(bannerColors)) {
            setBannerColors(newColors);
          }
        } catch (error) {
          console.error('Error parsing banner colors:', error);
        }
      }
      if (e.key === 'adBannerFont') {
        try {
          const newFont = JSON.parse(e.newValue || '{"size": 18, "weight": "bold", "color": "#000000"}');
          if (JSON.stringify(newFont) !== JSON.stringify(bannerFont)) {
            setBannerFont(newFont);
          }
        } catch (error) {
          console.error('Error parsing banner font:', error);
        }
      }
      if (e.key === 'adBannerScrollSpeed') {
        const speed = parseInt(e.newValue || '20');
        if (!isNaN(speed) && speed !== scrollSpeed) {
          setScrollSpeed(speed);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [bannerText, isActive, bannerColors, bannerFont]); // Add dependencies

  useEffect(() => {
    // Check for updates every 5 seconds (increased for better performance)
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
        }
      }

      const currentColors = localStorage.getItem('adBannerColors');
      if (currentColors) {
        try {
          const parsedColors = JSON.parse(currentColors);
          if (JSON.stringify(parsedColors) !== JSON.stringify(bannerColors)) {
            setBannerColors(parsedColors);
          }
        } catch (error) {
          console.error('Error parsing banner colors:', error);
        }
      }

      const currentFont = localStorage.getItem('adBannerFont');
      if (currentFont) {
        try {
          const parsedFont = JSON.parse(currentFont);
          if (JSON.stringify(parsedFont) !== JSON.stringify(bannerFont)) {
            setBannerFont(parsedFont);
          }
        } catch (error) {
          console.error('Error parsing banner font:', error);
        }
      }

      const currentScrollSpeed = localStorage.getItem('adBannerScrollSpeed');
      if (currentScrollSpeed) {
        const speed = parseInt(currentScrollSpeed);
        if (!isNaN(speed) && speed !== scrollSpeed) {
          setScrollSpeed(speed);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerText, isActive, bannerColors, bannerFont, scrollSpeed]); // Add scrollSpeed to dependencies

  // Separate useEffect to handle body class changes
  useEffect(() => {
    if (isActive) {
      document.body.classList.add('ad-banner-visible');
    } else {
      document.body.classList.remove('ad-banner-visible');
    }
  }, [isActive]);

  if (!isActive) return null;

  // Use scroll speed from state (controlled by admin)
  const scrollDuration = scrollSpeed;

  return (
    <>
      <div className="Discountoffer" style={{
        background: `linear-gradient(90deg,${bannerColors.join(',')})`,
        padding: '7px 0',
        fontSize: `${bannerFont.size}px`,
        fontWeight: bannerFont.weight,
        display: isActive ? 'flex' : 'none',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '10px'
      }}>
        <div className="marquee-wrapper">
          <div className="marquee" style={{
            display: 'flex',
            animation: `scrollText ${scrollDuration}s linear infinite`,
            minWidth: 'fit-content'
          }}>
            {[...Array(8)].map((_, i) => (
              <span key={i} style={{
                fontSize: bannerFont.size,
                display: 'inline-block',
                paddingRight: 10,
                color: bannerFont.color,
                fontWeight: bannerFont.weight,
                whiteSpace: 'nowrap'
              }}>{bannerText}</span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .Discountoffer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          font-family: "NeueMachina", sans-serif;
          white-space: nowrap;
          width: 100vw;
          max-width: 100vw;
          overflow: hidden;
        }

        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          display: flex;
          white-space: nowrap;
          position: relative;
        }

        @keyframes scrollText {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }

        /* Responsive fixes for small screens */
        @media (max-width: 768px) {
          .Discountoffer {
            font-size: 14px !important;
            padding: 5px 0 !important;
          }
          
          .marquee span {
            font-size: 14px !important;
            padding-right: 8px !important;
          }
        }

        @media (max-width: 480px) {
          .Discountoffer {
            font-size: 12px !important;
            padding: 4px 0 !important;
          }
          
          .marquee span {
            font-size: 12px !important;
            padding-right: 6px !important;
          }
        }
      `}</style>
    </>
  );
} 