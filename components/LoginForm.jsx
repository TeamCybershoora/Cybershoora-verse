"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

export default function LoginForm({ initialRole = 'student' }) {
  const [role] = useState(initialRole);
  const [step, setStep] = useState(1); // 1: login, 2: otp
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailStatus, setEmailStatus] = useState(""); // "not-exists", "exists", ""
  const [emailStatusMsg, setEmailStatusMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Check email/mobile existence onBlur
  const checkEmailOrPhone = async () => {
    if (!form.emailOrPhone) return;
    setEmailStatus("");
    setEmailStatusMsg("");
    // Simple regex to check if input is email
    const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.emailOrPhone);
    try {
      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: form.emailOrPhone, userType: role }),
      });
      const data = await res.json();
      if (data.exists) {
        setEmailStatus("exists");
        setEmailStatusMsg(data.type === 'email' ? "Email exists" : data.type === 'phone' ? "Mobile exists" : "Exists");
      } else {
        setEmailStatus("not-exists");
        let msg = "Email/Mobile does not exist";
        if (data.type === 'email' || (data.type === null && isEmail)) msg = "Email does not exist";
        else if (data.type === 'phone' || (data.type === null && !isEmail)) msg = "Mobile does not exist";
        setEmailStatusMsg(msg);
        toast.error(msg);
      }
    } catch {
      setEmailStatus("not-exists");
      setEmailStatusMsg("Error checking email/mobile");
      toast.error("Error checking email/mobile");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "emailOrPhone") {
      setEmailStatus("");
      setEmailStatusMsg("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (emailStatus !== "exists") {
      setError("Please enter a valid Email/Mobile.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    
    const loginData = { ...form, userType: role };
    console.log('🔐 Sending login data:', loginData);
    console.log('🔐 Form data:', form);
    console.log('🔐 Role:', role);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      console.log('📡 Response status:', res.status);
      const data = await res.json();
      console.log('📡 Response data:', data);
      
      if (data.success) {
        setUserId(data.userId || data.studentId || data.teacherId);
        setStep(2); // Show OTP input
        toast.success("OTP sent to your email");
      } else {
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Network error");
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const deviceName = navigator.userAgent;
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are accepted
        body: JSON.stringify({
          userId: userId,
          otp,
          userType: role,
          deviceName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Set localStorage
        localStorage.setItem(role === 'student' ? "studentId" : "teacherId", userId);

        toast.success("Login successful!");
        if (role === 'student') {
          window.location.href = '/student-dashboard';
        } else {
          window.location.href = '/teacher-dashboard';
        }
      } else {
        setError(data.message || "OTP verification failed");
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      setError("Network error");
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userType: role }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP resent to your email");
        setUserId(data.userId || data.studentId || data.teacherId);
        setResendCooldown(30); // 30 seconds cooldown
      } else {
        setError(data.message || "Failed to resend OTP");
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError("Network error");
      toast.error("Network error");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <>
      <div className="logo-container">
        <img src="/assets/Shoora-tech-text.svg" alt="Shoora Logo" className="shoora-logo" />
      </div>
      <div className={`auth-container login-auth-container`}>
        <div className="form-container login-form-container">
          {/* Back Button */}
          <button
            type="button"
            className="back-btn-home"
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                router.push('/');
              }
            }}
          >
            <span className="back-arrow-circle">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13" fill="#fff" strokeWidth="2" />
                <path d="M17.5 8L12 14L17.5 20" stroke="#ff6a32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="back-btn-text">Back</span>
          </button>
          <h2 className="form-title">{role === 'student' ? 'Student' : 'Teacher'} Login</h2>
          {step === 1 && (
            <form id="login-form" onSubmit={handleLogin} autoComplete="off">

              <div className="form-group" style={{ marginTop: '3rem' }}>
                <label htmlFor="emailOrPhone">Mobile or Email</label>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  value={form.emailOrPhone}
                  onChange={handleChange}
                  onBlur={checkEmailOrPhone}
                  required
                  className={`input-field ${emailStatus === "not-exists" ? "input-error" : emailStatus === "exists" ? "input-success" : ""}`}
                  style={emailStatus === "not-exists"
                    ? { border: "1.5px solid #ff4d4f" }
                    : emailStatus === "exists"
                      ? { border: "1.5px solid #4caf50" }
                      : {}}
                />
                {emailStatusMsg && (
                  <div
                    style={{
                      color: emailStatus === "not-exists" ? "#ff4d4f" : "#4caf50",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {emailStatusMsg}
                  </div>
                )}
              </div>
              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                <a href="/forgot-password" style={{ color: '#9747ff', fontWeight: 500, fontFamily: 'NeueMachina', marginBottom: 4, cursor: 'pointer', textDecoration: 'underline' }}>Forgot password?</a>
                <a
                  href={role === 'student' ? 'student/register' : '/teacher/register'}
                  style={{ color: '#ff6a32', fontWeight: 500, fontFamily: 'NeueMachina', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  I don't have an account. Register
                </a>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || emailStatus !== "exists"}
                className="submit-btn"
                style={{ marginTop: '10px' }}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} autoComplete="off">
              <div className="form-group">
                <label htmlFor="otp">Enter OTP sent to your email</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              {error && <div className="error-msg">{error}</div>}
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? "Verifying..." : "Verify OTP & Login"}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading || resendCooldown > 0}
                className="submit-btn"
                style={{ marginTop: 10, background: resendCooldown > 0 ? '#aaa' : '#ff6a32' }}
              >
                {resendLoading ? "Resending..." : resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
      <style jsx global>{`
        body {
          background-image: url("/assets/bg.svg");
          background-position: top;
          background-size: cover;
          background-repeat: no-repeat;
          height: initial;
          
        }
        .auth-container, .auth-container.login-auth-container {
          display: flex;
          flex-direction: column;
          width: 75vh;
          margin: 5rem auto;
          border-radius: 16px;
          overflow: hidden;
          background: url("/assets/bg3.svg");
          box-shadow: 0 0 20px rgba(0,0,0,0.4);
          backdrop-filter: blur(5px);
          max-width: none;
        }
        .form-container, .login-form-container {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        @media (max-width: 600px) {
          .auth-container, .auth-container.login-auth-container {
            width: 85vw;
            margin: 50% auto;
            max-width: 98vw;
            border-radius: 12px;
          }
          .form-container, .login-form-container {
            padding: 2rem 2rem;
            max-width: 98vw;
            min-width: 0;
            width: 85vw;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
          }
        }
        .form-title {
          font-size: 24px;
          font-weight: bold;
          color: #ff6a32;
          margin-bottom: 20px;
          text-align: center;
          font-family: "NeueMachina";
        }
        .form-group {
          margin-bottom: 1.25rem;
          width: 100%;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.95rem;
          font-family: "NeueMachina";
          color:rgb(205, 205, 205);
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color:rgba(111, 111, 111, 0.25);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.95rem;
          transition: 0.3s ease;
        }
        .input-field:focus {
          outline: none;
          box-shadow: 0 0 0 2px #ff6a32;
        }
        .input-error {
          border: 1.5px solid #ff4d4f !important;
        }
        .input-success {
          border: 1.5px solid #4caf50 !important;
        }
        .submit-btn {
          width: 100%;
          background: #e95a22;
          border: none;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          font-family: "NeueMachina";
          color: white;
          border-radius: 10px;
          transition: 0.3s ease;
          margin-bottom: 8px;
        }
        .submit-btn:hover {
          background:rgb(255, 255, 255);
          color: #e95a22;
        }
        
        .error-msg {
          color: #ff4d4f;
          margin-bottom: 10px;
          font-size: 15px;
          font-family: "NeueMachina";
          text-align: center;
        }
        .back-btn-home {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          background: none;
          border: none;
          cursor: pointer;
          margin-bottom: 1.2rem;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: "NeueMachina";
          color: #ff6a32;
          transition: color 0.2s;
        }
        .back-btn-home:hover .back-arrow-circle {
          box-shadow: 0 0 0 3px #ff6a3233;
        }
        .back-arrow-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #ff6a32;
          box-shadow: 0 2px 8px #ff6a3222;
          transition: box-shadow 0.2s;
        }
        .back-btn-text {
          color: #ff6a32;
          font-weight: 600;
          font-size: 1.1rem;
          font-family: "NeueMachina";
          letter-spacing: 0.01em;
        }
       
       .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 0rem;
          margin-bottom: -4rem;
        }
        .shoora-logo {
          height: 70px;
          width: auto;
        }
        .password-group {
          position: relative;
        }
        .password-input-wrapper {
          position: relative;
          width: 100%;
        }
        .eye-btn {
          position: absolute;
          right: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          z-index: 2;
        }
      `}</style>
    </>
  );
} 