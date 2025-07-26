'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: select option, 2: enter details, 3: OTP verification
  const [selectedOption, setSelectedOption] = useState('');
  const [userType, setUserType] = useState('student'); // student or teacher
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    otp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedOption === 'receive-password') {
        // Option 1: Receive password on email
        const response = await fetch('/api/auth/forgot-password/receive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            userType: userType
          })
        });

        const data = await response.json();
        if (data.success) {
          toast.success('Password sent to your email!');
          router.push(userType === 'teacher' ? '/teacher-login' : '/student-login');
        } else {
          toast.error(data.message || 'Failed to send password');
        }
      } else if (selectedOption === 'email-otp') {
        // Option 3: Email OTP
        const response = await fetch('/api/auth/forgot-password/email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            userType: userType
          })
        });

        const data = await response.json();
        if (data.success) {
          toast.success('OTP sent to your email!');
          setStep(3);
        } else {
          toast.error(data.message || 'Failed to send OTP');
        }
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: formData.otp,
          newPassword: newPassword,
          userType: userType,
          method: selectedOption
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Password reset successfully!');
        router.push(userType === 'teacher' ? '/teacher-login' : '/student-login');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedOption('');
    } else if (step === 3) {
      setStep(2);
      setFormData({ ...formData, otp: '' });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {/* Back Button */}
        <button
          type="button"
          className="back-btn-home"
          onClick={() => router.push(userType === 'teacher' ? '/teacher-login' : '/student-login')}
        >
          <span className="back-arrow-circle">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="13" fill="#fff" strokeWidth="2"/>
              <path d="M17.5 8L12 14L17.5 20" stroke="#ff6a32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="back-btn-text">Back to Login</span>
        </button>

        <h1 className="forgot-password-title">Forgot Password</h1>
        <p className="forgot-password-subtitle">Choose how you want to recover your password</p>

        {/* Step 1: Select Option */}
        {step === 1 && (
          <div className="options-container">
            <div className="user-type-selector">
              <label>I am a:</label>
              <div className="user-type-buttons">
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'student' ? 'active' : ''}`}
                  onClick={() => setUserType('student')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`user-type-btn ${userType === 'teacher' ? 'active' : ''}`}
                  onClick={() => setUserType('teacher')}
                >
                  Teacher
                </button>
              </div>
            </div>

            <div className="option-cards">
              <div className="option-card" onClick={() => handleOptionSelect('receive-password')}>
                <div className="option-icon">📧</div>
                <h3>Receive Password on Email</h3>
                <p>Get your current password sent to your registered email address</p>
              </div>

              <div className="option-card" onClick={() => handleOptionSelect('email-otp')}>
                <div className="option-icon">✉️</div>
                <h3>Reset via Email OTP</h3>
                <p>Receive OTP on your email and set a new password</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Enter Details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <button type="button" onClick={handleBack} className="back-step-btn">
              ← Back
            </button>

            {selectedOption === 'receive-password' && (
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter your registered email"
                />
                <p className="form-help">Your current password will be sent to this email</p>
              </div>
            )}



            {selectedOption === 'email-otp' && (
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter your registered email"
                />
                <p className="form-help">OTP will be sent to this email address</p>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 3: OTP Verification */}
        {step === 3 && (
          <form onSubmit={handleOtpSubmit} className="forgot-password-form">
            <button type="button" onClick={handleBack} className="back-step-btn">
              ← Back
            </button>

            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                required
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                minLength="6"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url("/assets/bg3.svg");
          background-size: cover;
          background-position: center;
          padding: 20px;
        }

        .forgot-password-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          position: relative;
        }

        .back-btn-home {
          position: absolute;
          top: 20px;
          left: 20px;
          background: none;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .back-arrow-circle {
          width: 28px;
          height: 28px;
        }

        .forgot-password-title {
          text-align: center;
          color: white;
          font-size: 32px;
          margin-bottom: 10px;
          margin-top: 20px;
        }

        .forgot-password-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 30px;
        }

        .user-type-selector {
          margin-bottom: 30px;
        }

        .user-type-selector label {
          display: block;
          color: white;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .user-type-buttons {
          display: flex;
          gap: 10px;
        }

        .user-type-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-type-btn.active {
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          border-color: transparent;
        }

        .option-cards {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .option-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .option-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .option-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .option-card h3 {
          color: white;
          margin-bottom: 8px;
          font-size: 18px;
        }

        .option-card p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          line-height: 1.4;
        }

        .forgot-password-form {
          width: 100%;
        }

        .back-step-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: white;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          font-size: 16px;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-help {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          margin-top: 5px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          border: none;
          color: white;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 106, 50, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .forgot-password-card {
            padding: 30px 20px;
          }

          .forgot-password-title {
            font-size: 24px;
          }

          .user-type-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
} 