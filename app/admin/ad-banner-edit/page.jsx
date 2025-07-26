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
                  <span style={{
                    fontSize: '1.4rem',
                    display: 'inline-block',
                    paddingRight: '10px',
                    color: bannerConfig.textColor,
                    fontWeight: '400'
                  }}>
                    {bannerConfig.text}
                  </span>
                  <span style={{
                    fontSize: '1.4rem',
                    display: 'inline-block',
                    paddingRight: '10px',
                    color: bannerConfig.textColor,
                    fontWeight: '400'
                  }}>
                    {bannerConfig.text}
                  </span>
                  <span style={{
                    fontSize: '1.4rem',
                    display: 'inline-block',
                    paddingRight: '10px',
                    color: bannerConfig.textColor,
                    fontWeight: '400'
                  }}>
                    {bannerConfig.text}
                  </span>
                  <span style={{
                    fontSize: '1.4rem',
                    display: 'inline-block',
                    paddingRight: '10px',
                    color: bannerConfig.textColor,
                    fontWeight: '400'
                  }}>
                    {bannerConfig.text}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            paddingTop: previewBanner ? '60px' : '0'
          }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 1rem 0',
                background: 'linear-gradient(135deg, #9747ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Advertisement Banner Editor
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#ccc',
                margin: 0
              }}>
                Customize your advertisement banner text, colors, and animation
              </p>
            </div>

            {/* Editor Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Left Column - Text Settings */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{
                  color: '#9747ff',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '0 0 1.5rem 0'
                }}>
                  Banner Text & Content
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#ccc',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    Advertisement Text
                  </label>
                  <textarea
                    value={bannerConfig.text}
                    onChange={(e) => setBannerConfig(prev => ({ ...prev, text: e.target.value }))}
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #9747ff',
                      fontSize: '16px',
                      background: '#181828',
                      color: '#fff',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Enter your advertisement text here..."
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#ccc',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    Font Size (px)
                  </label>
                  <input
                    type="number"
                    value={bannerConfig.fontSize}
                    onChange={(e) => setBannerConfig(prev => ({ ...prev, fontSize: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid #9747ff',
                      fontSize: '16px',
                      background: '#181828',
                      color: '#fff'
                    }}
                    min="12"
                    max="32"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#ccc',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    Font Weight
                  </label>
                  <select
                    value={bannerConfig.fontWeight}
                    onChange={(e) => setBannerConfig(prev => ({ ...prev, fontWeight: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid #9747ff',
                      fontSize: '16px',
                      background: '#181828',
                      color: '#fff'
                    }}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="600">Semi Bold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra Bold</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#ccc',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    Scroll Speed (seconds)
                  </label>
                  <input
                    type="number"
                    value={bannerConfig.scrollSpeed}
                    onChange={(e) => setBannerConfig(prev => ({ ...prev, scrollSpeed: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid #9747ff',
                      fontSize: '16px',
                      background: '#181828',
                      color: '#fff'
                    }}
                    min="5"
                    max="60"
                  />
                </div>
              </div>

              {/* Right Column - Color Settings */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{
                  color: '#9747ff',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '0 0 1.5rem 0'
                }}>
                  Colors & Styling
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#ccc',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    Background Color
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="color"
                      value="#ea5c03"
                      onChange={(e) => {
                        const color1 = e.target.value;
                        const color2 = bannerConfig.backgroundColor.includes('rgb(255, 225, 0)') ? 'rgb(255, 225, 0)' : '#ffe100';
                        setBannerConfig(prev => ({
                          ...prev,
                          backgroundColor: `linear-gradient(90deg, ${color1}, ${color2})`
                        }));
                      }}
                      style={{
                        width: '60px',
                        height: '50px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="color"
                      value="#ffe100"
                      onChange={(e) => {
                        const color2 = e.target.value;
                        const color1 = bannerConfig.backgroundColor.includes('rgb(234, 92, 3)') ? 'rgb(234, 92, 3)' : '#ea5c03';
                        setBannerConfig(prev => ({
                          ...prev,
                          backgroundColor: `linear-gradient(90deg, ${color1}, ${color2})`
                        }));
                      }}
                      style={{
                        width: '60px',
                        height: '50px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  <div style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    background: bannerConfig.backgroundColor,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                    color: '#000',
                    fontWeight: 'bold'
                  }}>
                    Preview Background
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#ccc',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={bannerConfig.textColor}
                    onChange={(e) => setBannerConfig(prev => ({ ...prev, textColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '50px',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#ccc',
                    fontWeight: '500',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={bannerConfig.isActive}
                      onChange={(e) => setBannerConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                      style={{
                        marginRight: '0.5rem',
                        transform: 'scale(1.2)'
                      }}
                    />
                    Banner Active
                  </label>
                </div>

                <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: bannerConfig.backgroundColor,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  color: bannerConfig.textColor,
                  fontWeight: bannerConfig.fontWeight,
                  fontSize: `${bannerConfig.fontSize}px`
                }}>
                  Text Preview: {bannerConfig.text.substring(0, 50)}...
                </div>
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
                  background: previewBanner ? '#ef4444' : '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {previewBanner ? 'Hide Preview' : 'Show Preview'}
              </button>

              <button
                onClick={handleSave}
                style={{
                  background: 'linear-gradient(135deg, #9747ff, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Save Changes
              </button>

              <button
                onClick={() => {
                  const savedConfig = localStorage.getItem('adBannerConfig');
                  console.log('Current saved config:', savedConfig);
                  if (savedConfig) {
                    console.log('Parsed config:', JSON.parse(savedConfig));
                  }
                  toast.success('Check console for saved configuration');
                }}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Check Saved Config
              </button>

              <button
                onClick={handleReset}
                style={{
                  background: '#f59e0b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Reset to Default
              </button>
            </div>

            {/* Instructions */}
            <div style={{
              marginTop: '3rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                color: '#9747ff',
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 0 1rem 0'
              }}>
                How to Use
              </h3>
              <ul style={{
                color: '#ccc',
                lineHeight: '1.6',
                paddingLeft: '1.5rem'
              }}>
                <li>Edit the advertisement text to customize your message</li>
                <li>Choose background colors using the color pickers</li>
                <li>Select text color for optimal readability</li>
                <li>Adjust font size and weight as needed</li>
                <li>Control scroll speed (lower = faster)</li>
                <li>Use "Show Preview" to see the banner in action</li>
                <li>Click "Save Changes" to apply your settings</li>
                <li>Use "Reset to Default" to restore original settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scrollText {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
} 