"use client";
import { unstable_noStore as noStore } from 'next/cache';

import { useState, useEffect } from "react";
import LoginFormStyle from "../../components/LoginFormStyle";

export default function SuperAdminPage() {
  // Force dynamic rendering to prevent static generation issues
  noStore();
  
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if admin is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        
        if (data.success && data.admin) {
          // Admin is already logged in, redirect to dashboard
          window.location.href = '/admin/dashboard';
          return;
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "cybershoora@gmail.com", password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setError("");
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <>
        <LoginFormStyle />
        <div className="logo-container">
          <img src="/assets/Shoora-tech-text.svg" alt="Shoora Logo" className="shoora-logo" />
        </div>
        <div className="auth-container login-auth-container">
          <div className="form-container login-form-container">
            <div style={{ textAlign: 'center', color: '#9747ff', fontSize: '1.1rem' }}>
              Checking authentication...
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LoginFormStyle />
      <div className="logo-container">
        <img src="/assets/Shoora-tech-text.svg" alt="Shoora Logo" className="shoora-logo" />
      </div>
      <div className="auth-container login-auth-container">
        <div className="form-container login-form-container">
          <h2 className="form-title">Super Admin Login</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <button
                  type="button"
                  className="eye-btn"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6a32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.05 0-9.29-3.14-11-8 1.21-3.06 3.6-5.5 6.58-6.71"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.93 0 3.5-1.57 3.5-3.5 0-.47-.09-.92-.26-1.33"/></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6a32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login as Super Admin"}
            </button>
          </form>
          {success && <div style={{ color: "#4caf50", marginTop: 18, textAlign: "center", fontWeight: 600 }}>Welcome, Super Admin!</div>}
          
          {/* Return to Home Button */}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: '#ff6a32',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                fontFamily: 'NeueMachina, sans-serif'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(255, 106, 50, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ← Return to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 