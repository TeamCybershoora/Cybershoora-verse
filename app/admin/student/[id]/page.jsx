"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const StudentProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (data.success && data.admin) {
          setAdminData(data.admin);
          setIsAdmin(true);
        } else {
          // Not logged in as admin, redirect to admin login
          window.location.href = '/admin';
          return;
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        window.location.href = '/admin';
        return;
      }
    };

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/student/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setStudent(data.student);
        } else {
          setError(data.message || 'Failed to fetch student data');
        }
      } catch (err) {
        setError('Error loading student data');
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    const initialize = async () => {
      await checkAdminAuth();
      if (params.id) {
        await fetchStudentData();
      }
    };

    initialize();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">🔄</div>
          <div>Loading student profile...</div>
        </div>
      </div>
    );
  }

  const handleBackToDashboard = () => {
    if (isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.back();
    }
  };

  if (error) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">❌</div>
          <div>{error}</div>
          <button 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">🔒</div>
          <div>Access Denied. Admin login required.</div>
          <button 
            onClick={() => router.push('/admin')}
            className="back-button"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">👤</div>
          <div>Student not found</div>
          <button 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Student Profile</h1>
        <button 
          onClick={handleBackToDashboard}
          className="back-button"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Profile Photo Section - Full Width */}
        <div className="profile-photo-section">
          <div className="profile-photo-container">
            <img 
              src={student.profilePhoto || '/assets/Shoora-logo.svg'} 
              alt={student.fullName}
              className="profile-image"
            />
          </div>
          <div className="profile-id-name">
            <div className="id-card-badge">
              Student ID: {student.idCardNumber || 'Not Assigned'}
            </div>
            <h2 className="student-name">
              {student.fullName}
            </h2>
          </div>
          {/* Status and Verification */}
          <div className="status-row">
            <div className={`status-container ${student.status === 'enrolled' ? 'enrolled-status' : 'trial-status'}`}>
              <div className={student.status === 'enrolled' ? 'enrolled-text' : 'trial-text'}>
                Status: {student.status === 'enrolled' ? 'Enrolled' : 'Trial'}
              </div>
            </div>

            <div className={student.faceVerified ? 'verified-status' : 'not-verified-status'}>
              <div className={student.faceVerified ? 'verified-text' : 'not-verified-text'}>
                Face Verification: {student.faceVerified ? '✅ Verified' : '❌ Not Verified'}
              </div>
            </div>
          </div>
        </div>

        {/* Student Information Section */}
        <div className="student-info-section">
          <h3 className="section-title">Student Information</h3>
          
          <div className="info-grid">
            {/* Personal Information */}
            <div className="info-section">
              <h4 className="section-header">Personal Details</h4>
              <div className="field-grid">
                <InfoField label="Student Name" value={student.fullName} />
                <InfoField label="Date of Birth" value={student.dob} />
                <InfoField label="Email Address" value={student.email} />
                <InfoField label="Mobile Number" value={student.phone} />
                <InfoField label="Home Address" value={student.address} />
                <InfoField label="Educational Qualification" value={student.qualification} />
              </div>
            </div>

            {/* Guardian Information */}
            <div className="info-section">
              <h4 className="section-header">Guardian Details</h4>
              <div className="field-grid">
                <InfoField label="Guardian Name" value={student.guardianName} />
                <InfoField label="Guardian Mobile" value={student.guardianPhone} />
                <InfoField label="Guardian Email" value={student.guardianEmail} />
                <InfoField label="Guardian Address" value={student.guardianAddress} />
              </div>
            </div>

            {/* Academic Information */}
            <div className="info-section">
              <h4 className="section-header">Course & Batch Details</h4>
              <div className="field-grid">
                <InfoField label="Course Name" value={student.course} />
                <InfoField label="Batch Name" value={student.batch} />
                <InfoField label="Enrollment Date" value={student.enrollmentDate} />
                <InfoField label="College/School Name" value={student.college} />
              </div>
            </div>

            {/* Account Information */}
            <div className="info-section">
              <h4 className="section-header">Account Details</h4>
              <div className="field-grid">
                <InfoField label="Student ID Number" value={student.idCardNumber} />
                <InfoField label="Registration Date" value={student.createdAt} />
                <InfoField label="Last Profile Update" value={student.updatedAt} />
                <InfoField label="Login Password" value={student.password} isPassword={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        body {
          background: url("/assets/bg3.svg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          margin: 0;
          font-family: "NeueMachina";
          min-height: 100vh;
        }

        .container {
          min-height: 100vh;
          color: white;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-title {
          font-size: 28px;
          font-weight: 600;
          font-family: "NeueMachina";
          margin: 0;
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .back-button {
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 106, 50, 0.4);
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        /* Profile Photo Section - Full Width */
        .profile-photo-section {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .profile-photo-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.3);
          margin: 0 auto 20px auto;
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-name {
          font-size: 32px;
          margin: 20px 0 10px 0;
          font-weight: 800;
          color: white;
          font-family: "NeueMachina";
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 15px 25px;
          display: inline-block;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.5px;
        }

        .id-card-badge {
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-family: "NeueMachina";
          font-weight: 500;
          margin: 0 0 15px 0;
          display: inline-block;
        }

        .status-row {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .status-container {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          font-family: "NeueMachina";
        }

        .enrolled-status {
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.5);
        }

        .trial-status {
          background: rgba(255, 152, 0, 0.2);
          border: 1px solid rgba(255, 152, 0, 0.5);
        }

        .enrolled-text {
          color: #4CAF50;
        }

        .trial-text {
          color: #FF9800;
        }

        .verified-status, .not-verified-status {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          font-family: "NeueMachina";
        }

        .verified-status {
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.5);
        }

        .not-verified-status {
          background: rgba(244, 67, 54, 0.2);
          border: 1px solid rgba(244, 67, 54, 0.5);
        }

        .verified-text {
          color: #4CAF50;
        }

        .not-verified-text {
          color: #F44336;
        }

        .profile-id-name {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        /* Student Information Section */
        .student-info-section {
          background: rgba(20,20,24,0.92);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          border: 1.5px solid #232323;
          padding: 44px 28px;
          margin-bottom: 32px;
          transition: box-shadow 0.2s;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(90deg, #ff6a32 30%, #9747FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 36px;
          letter-spacing: 1.5px;
          text-align: center;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
        }

        .info-section {
          position: relative;
          background: rgba(255,255,255,0.07);
          border-radius: 18px;
          border: 1.5px solid rgba(151, 71, 255, 0.10);
          padding: 32px 24px 24px 24px;
          box-shadow: 0 2px 12px rgba(151, 71, 255, 0.04);
          margin-bottom: 0;
          transition: box-shadow 0.25s, border 0.25s, transform 0.18s;
          overflow: hidden;
        }
        .info-section:hover {
          box-shadow: 0 8px 32px rgba(151, 71, 255, 0.18), 0 2px 12px rgba(151, 71, 255, 0.04);
          border-color: #9747FF;
          transform: scale(1.015);
        }
        .info-section::before {
          content: '';
          display: block;
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          border-radius: 18px 18px 0 0;
          background: linear-gradient(90deg, #ff6a32 0%, #9747FF 100%);
          z-index: 2;
        }

        .section-header {
          font-size: 1.15rem;
          font-weight: 700;
          color: #9747FF;
          border-bottom: 2px solid rgba(151, 71, 255, 0.18);
          padding-bottom: 10px;
          margin-bottom: 18px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .field {
          margin-bottom: 22px;
          border-bottom: 1px solid rgba(200,200,220,0.08);
          padding-bottom: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .field:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .student-field-label {
          color: blue !important;
          font-size: 18px !important;
          font-weight: bold !important;
          margin-bottom: 10px !important;
          background: #fff !important;
          display: block !important;
        }
        .student-field-value {
          background: yellow !important;
          color: #000 !important;
          border: 2px solid red !important;
          font-size: 20px !important;
          padding: 20px !important;
          border-radius: 12px !important;
          display: block !important;
        }
        .student-field-value:focus,
        .student-field-value:hover {
          border: 1.5px solid #9747FF;
          box-shadow: 0 4px 16px rgba(151, 71, 255, 0.13);
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: white;
        }

        .loading-content {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .loading-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }

          .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .header-title {
            font-size: 24px;
          }

          .profile-photo-container {
            width: 120px;
            height: 120px;
          }

          .student-name {
            font-size: 24px;
            padding: 12px 20px;
          }

          .status-row {
            flex-direction: column;
            align-items: center;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 20px;
          }

          .section-header {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

const InfoField = ({ label, value, isPassword = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  // Format date values
  const formatValue = (val) => {
    if (!val) return 'Not provided';
    
    // Check if it's a date string
    if (typeof val === 'string' && val.includes('T')) {
      try {
        const date = new Date(val);
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        return val;
      }
    }
    
    return val;
  };

  if (isPassword) {
    return (
      <div className="field">
        <span
          style={{
            color: '#b0b0b0',
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'NeueMachina, sans-serif',
            display: 'block',
            userSelect: 'text',
          }}
        >
          {label}
        </span>
        <div
          style={{
            background: '#232323',
            color: '#e9e9e9',
            border: '2px solid #9747FF',
            borderRadius: 12,
            padding: '18px 24px',
            fontSize: '1.15rem',
            fontFamily: 'NeueMachina, sans-serif',
            fontWeight: 700,
            width: '100%',
            boxShadow: '0 2px 12px rgba(151, 71, 255, 0.10)',
            userSelect: 'text',
            cursor: 'text',
            marginBottom: 0,
            transition: 'border 0.18s, boxShadow 0.18s',
            display: 'flex',
            alignItems: 'center',
            wordBreak: 'break-word',
            gap: 12,
          }}
        >
          <span style={{ flex: 1 }}>{showPassword ? (value || 'Not set') : (value ? '••••••••' : 'Not set')}</span>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9747FF',
              cursor: 'pointer',
              fontSize: 20,
              marginLeft: 8,
              outline: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="field">
      <span
        style={{
          color: '#b0b0b0',
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontFamily: 'NeueMachina, sans-serif',
          display: 'block',
          userSelect: 'text',
        }}
      >
        {label}
      </span>
      <div
        style={{
          background: '#232323',
          color: '#e9e9e9',
          border: '2px solid #9747FF',
          borderRadius: 12,
          padding: '18px 24px',
          fontSize: '1.15rem',
          fontFamily: 'NeueMachina, sans-serif',
          fontWeight: 700,
          width: '100%',
          boxShadow: '0 2px 12px rgba(151, 71, 255, 0.10)',
          userSelect: 'text',
          cursor: 'text',
          marginBottom: 0,
          transition: 'border 0.18s, boxShadow 0.18s',
          display: 'block',
          wordBreak: 'break-word',
        }}
      >
        {value || 'Not provided'}
      </div>
    </div>
  );
};

export default StudentProfilePage;