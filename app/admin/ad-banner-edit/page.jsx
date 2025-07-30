'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AdBannerEditPage() {
  const [bannerConfig, setBannerConfig] = useState({
    text: '🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!',
    backgroundColor: 'linear-gradient(90deg, rgb(234, 92, 3), rgb(255, 225, 0))',
    textColor: '#000000',
    fontSize: '18',
    fontWeight: 'bold',
    isActive: true,
    scrollSpeed: '20'
  });

  const [previewBanner, setPreviewBanner] = useState(false);

  useEffect(() => {
    // Load saved banner configuration from localStorage
    const savedConfig = localStorage.getItem('adBannerConfig');
    if (savedConfig) {
      setBannerConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('adBannerConfig', JSON.stringify(bannerConfig));
      // Trigger storage event to update all banner instances
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'adBannerConfig',
        newValue: JSON.stringify(bannerConfig)
      }));
      toast.success('Advertisement banner settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save banner settings');
    }
  };

  const handleReset = () => {
    const defaultConfig = {
      text: '🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!',
      backgroundColor: 'linear-gradient(90deg, rgb(234, 92, 3), rgb(255, 225, 0))',
      textColor: '#000000',
      fontSize: '18',
      fontWeight: 'bold',
      isActive: true,
      scrollSpeed: '20'
    };
    setBannerConfig(defaultConfig);
    toast.success('Banner settings reset to default');
  };

  const handlePreview = () => {
    setPreviewBanner(!previewBanner);
  };

  return (
    <div className="ad-banner-edit-content">
      <div style={{
        minHeight: '100vh',
        background: 'url("/assets/bg.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        fontFamily: 'NeueMachina',
        padding: '2rem',
        color: '#fff'
      }}>
        <div className="ad-banner-edit-inner">
          {/* Preview Banner */}
          {previewBanner && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              background: bannerConfig.backgroundColor,
              padding: '7px 0',
              fontSize: `${bannerConfig.fontSize}px`,
              fontWeight: bannerConfig.fontWeight,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <div style={{
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  animation: `scrollText ${bannerConfig.scrollSpeed}s linear infinite`,
                  minWidth: 'fit-content'
                }}>
                  <span style={{ color: bannerConfig.textColor }}>
                    {bannerConfig.text}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Advertisement Banner Editor
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              Customize your advertisement banner settings
            </p>
          </div>

          {/* Banner Configuration Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Banner Settings</h2>
            
            {/* Banner Text */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Banner Text:
              </label>
              <textarea
                value={bannerConfig.text}
                onChange={(e) => setBannerConfig({...bannerConfig, text: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Enter your banner text here..."
              />
            </div>

            {/* Background Color */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Background Color:
              </label>
              <input
                type="text"
                value={bannerConfig.backgroundColor}
                onChange={(e) => setBannerConfig({...bannerConfig, backgroundColor: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
                placeholder="e.g., linear-gradient(90deg, #ff6b6b, #4ecdc4)"
              />
            </div>

            {/* Text Color */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Text Color:
              </label>
              <input
                type="color"
                value={bannerConfig.textColor}
                onChange={(e) => setBannerConfig({...bannerConfig, textColor: e.target.value})}
                style={{
                  width: '60px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Font Size */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Font Size (px):
              </label>
              <input
                type="number"
                value={bannerConfig.fontSize}
                onChange={(e) => setBannerConfig({...bannerConfig, fontSize: e.target.value})}
                style={{
                  width: '100px',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
                min="12"
                max="48"
              />
            </div>

            {/* Font Weight */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Font Weight:
              </label>
              <select
                value={bannerConfig.fontWeight}
                onChange={(e) => setBannerConfig({...bannerConfig, fontWeight: e.target.value})}
                style={{
                  width: '150px',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="bolder">Bolder</option>
              </select>
            </div>

            {/* Scroll Speed */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Scroll Speed (seconds):
              </label>
              <input
                type="number"
                value={bannerConfig.scrollSpeed}
                onChange={(e) => setBannerConfig({...bannerConfig, scrollSpeed: e.target.value})}
                style={{
                  width: '100px',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '1rem'
                }}
                min="5"
                max="60"
              />
            </div>

            {/* Active Status */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={bannerConfig.isActive}
                  onChange={(e) => setBannerConfig({...bannerConfig, isActive: e.target.checked})}
                  style={{ width: '18px', height: '18px' }}
                />
                Banner Active
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handlePreview}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {previewBanner ? 'Hide Preview' : 'Preview Banner'}
            </button>

            <button
              onClick={handleSave}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Save Settings
            </button>

            <button
              onClick={handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animation for scrolling text */}
      <style jsx>{`
        @keyframes scrollText {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
} 