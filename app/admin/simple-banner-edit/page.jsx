'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function SimpleBannerEditPage() {
  const [bannerText, setBannerText] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Load current banner text
    const savedText = localStorage.getItem('adBannerText');
    if (savedText) {
      setBannerText(savedText);
    } else {
      setBannerText('🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!');
    }

    // Check if banner is active
    const bannerActive = localStorage.getItem('adBannerActive');
    if (bannerActive === 'false') {
      setIsActive(false);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('adBannerText', bannerText);
      localStorage.setItem('adBannerActive', isActive.toString());
      
      // Trigger storage event for real-time updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'adBannerText',
        newValue: bannerText
      }));

      toast.success('Banner text updated successfully!');
    } catch (error) {
      toast.error('Failed to save banner text');
    }
  };

  const handleReset = () => {
    const defaultText = '🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!';
    setBannerText(defaultText);
    setIsActive(true);
    toast.success('Banner reset to default');
  };

  const handlePreview = () => {
    // Temporarily set the text for preview
    localStorage.setItem('adBannerText', bannerText);
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'adBannerText',
      newValue: bannerText
    }));
    toast.success('Preview applied! Check the banner at the top of the page.');
  };

  return (
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
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '60px' // Space for banner
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
            Simple Banner Editor
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#ccc',
            margin: 0
          }}>
            Edit your advertisement banner text easily
          </p>
        </div>

        {/* Editor */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: '#9747ff',
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0 0 1.5rem 0'
          }}>
            Banner Text
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
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
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
              display: 'flex',
              alignItems: 'center',
              color: '#ccc',
              fontWeight: '500',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{
                  marginRight: '0.5rem',
                  transform: 'scale(1.2)'
                }}
              />
              Banner Active
            </label>
          </div>

          {/* Preview */}
          <div style={{
            padding: '1rem',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #ea5c03, #ffe100)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: '#000',
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '1.5rem'
          }}>
            Preview: {bannerText.substring(0, 80)}...
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
              background: '#22c55e',
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
            Preview
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
            <li>Edit the advertisement text in the text area above</li>
            <li>Use emojis and special characters as needed</li>
            <li>Click "Preview" to see how it looks</li>
            <li>Click "Save Changes" to apply the banner across all pages</li>
            <li>Use "Reset to Default" to restore original text</li>
            <li>Toggle "Banner Active" to show/hide the banner</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 