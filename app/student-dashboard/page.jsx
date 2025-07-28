'use client';
import { unstable_noStore as noStore } from 'next/cache';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdvertisementBanner from '../../components/AdvertisementBanner';

export default function DashboardPage() {
  // Force dynamic rendering to prevent static generation issues
  noStore();
  
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Random motivational quotes for students
  const studentQuotes = [
    "Education is the most powerful weapon which you can use to change the world. - Shooraverse",
    "The future belongs to those who believe in the beauty of their dreams. - Shooraverse",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Shooraverse",
    "The only way to do great work is to love what you do. - Shooraverse",
    "Your time is limited, don't waste it living someone else's life. - Shooraverse",
    "The mind is not a vessel to be filled, but a fire to be kindled. - Shooraverse",
    "Learning is a treasure that will follow its owner everywhere. - Shooraverse",
    "Education is not preparation for life; education is life itself. - Shooraverse",
    "The beautiful thing about learning is that nobody can take it away from you. - Shooraverse",
    "Knowledge is power. Information is liberating. Education is the premise of progress. - Shooraverse"
  ];

  useEffect(() => {
    // Check if user is logged in
    const studentId = localStorage.getItem('studentId');
    console.log('Student ID from localStorage:', studentId);

    if (!studentId) {
      router.push('/login');
      return;
    }

    // Check for auto logout (60 days)
    checkAutoLogout();

    // Fetch student data including profile photo
    fetchStudentData(studentId);
  }, [router]);

  const checkAutoLogout = () => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const now = new Date().getTime();
      const loginDate = new Date(parseInt(loginTime)).getTime();
      const daysDiff = (now - loginDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff >= 60) {
        // Auto logout after 60 days
        handleLogout();
        return;
      }
    }
  };

  const fetchStudentData = async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching data for student ID:', studentId);

      const response = await fetch(`/api/student/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.success && data.student) {
        setStudentData(data.student);
        console.log('Student data set:', data.student);
        console.log('Profile photo URL:', data.student.profilePhoto);
        
        // Show welcome screen after data loads
        setTimeout(() => {
          setShowWelcome(true);
        }, 500);
      } else {
        console.error('Failed to fetch student data:', data.message || 'Unknown error');
        setError(data.message || 'Failed to load student data');

        // Fallback: Try to get data from localStorage if API fails
        const fallbackData = {
          fullName: localStorage.getItem('studentName') || 'Student',
          email: localStorage.getItem('studentEmail') || '',
          status: 'Student',
          profilePhoto: localStorage.getItem('profilePhoto') || null
        };
        setStudentData(fallbackData);
        
        setTimeout(() => {
          setShowWelcome(true);
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError(error.message);

      // Fallback: Try to get data from localStorage if API fails
      const fallbackData = {
        fullName: localStorage.getItem('studentName') || 'Student',
        email: localStorage.getItem('studentEmail') || '',
        status: 'Student',
        profilePhoto: localStorage.getItem('profilePhoto') || null
      };
      setStudentData(fallbackData);
      
      setTimeout(() => {
        setShowWelcome(true);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('profilePhoto');
    localStorage.removeItem('loginTime');
    
    // Clear cookies for middleware
    document.cookie = 'studentId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    router.push('/');
  };

  const closeWelcome = () => {
    setShowWelcome(false);
    // Show dashboard after welcome fades out
    setTimeout(() => {
      setShowDashboard(true);
    }, 500);
  };

  const getRandomQuote = () => {
    return studentQuotes[Math.floor(Math.random() * studentQuotes.length)];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <AdvertisementBanner />
      
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className={`welcome-overlay ${!showWelcome ? 'fade-out' : ''}`}>
          <div className="welcome-content">
            <div className="welcome-profile">
              {studentData?.profilePhoto ? (
                <img
                  src={studentData.profilePhoto}
                  alt="Profile"
                  className="welcome-profile-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="welcome-profile-placeholder"
                style={{
                  display: studentData?.profilePhoto ? 'none' : 'flex'
                }}
              >
                {studentData?.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
            </div>
            <h1 className="welcome-title">Welcome Back!</h1>
            <h2 className="welcome-name">{studentData?.fullName || 'Student'}</h2>
            <p className="welcome-quote">"{getRandomQuote()}"</p>
            <button onClick={closeWelcome} className="welcome-continue-btn">
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {showDashboard && (
        <div className={`dashboard-container ${showDashboard ? 'fade-in' : ''}`}>
          <header className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <img src="/assets/Shoora-logo.svg" alt="Shoora Logo" className="shoora-logo" />
                <h1>Student Dashboard</h1>
              </div>
              <div className="header-right">
                <div className="profile-section desktop-only">
                  <div className="profile-photo">
                    {studentData?.profilePhoto ? (
                      <img
                        src={studentData.profilePhoto}
                        alt="Profile"
                        className="profile-img"
                        onError={(e) => {
                          console.log('Image failed to load:', studentData.profilePhoto);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="profile-placeholder"
                      style={{
                        display: studentData?.profilePhoto ? 'none' : 'flex'
                      }}
                    >
                      {studentData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">
                      {studentData?.fullName || 'User'}
                    </span>
                    <span className="profile-status">
                      {studentData?.status || 'Student'}
                    </span>
                  </div>
                </div>
                <button onClick={handleLogout} className="logout-btn desktop-only">
                  Logout
                </button>
                <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <div className={`menu-toggle${mobileMenuOpen ? ' menu-show' : ''}`}> 
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                    <div className="line line2"></div>
                  </div>
                </div>
              </div>
            </div>
            {mobileMenuOpen && (
              <div className="mobile-menu-panel">
                <button 
                  className="menu-close-btn" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &#10005;
                </button>
                <div className="mobile-profile">
                  <div className="profile-photo large">
                    {studentData?.profilePhoto ? (
                      <img
                        src={studentData.profilePhoto}
                        alt="Profile"
                        className="profile-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="profile-placeholder"
                      style={{
                        display: studentData?.profilePhoto ? 'none' : 'flex'
                      }}
                    >
                      {studentData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">
                      {studentData?.fullName || 'User'}
                    </span>
                    <span className="profile-status">
                      {studentData?.status || 'Student'}
                    </span>
                  </div>
                  <button className="edit-profile-btn">Edit Profile</button>
                  <button onClick={handleLogout} className="logout-btn mobile-only">Logout</button>
                </div>
              </div>
            )}
          </header>

          <main className="dashboard-main">
            {error && (
              <div className="error-section">
                <p>⚠️ {error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                  Retry Loading
                </button>
              </div>
            )}

            <div className="welcome-section">
              <div className="center-profile-photo">
                {studentData?.profilePhoto ? (
                  <img
                    src={studentData.profilePhoto}
                    alt="Profile"
                    className="center-profile-img"
                    onError={(e) => {
                      console.log('Center image failed to load:', studentData.profilePhoto);
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="center-profile-placeholder"
                  style={{
                    display: studentData?.profilePhoto ? 'none' : 'flex'
                  }}
                >
                  {studentData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <h2>Welcome , {studentData?.fullName || 'Student'}!</h2>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Profile</h3>
                <p>View and edit your profile information</p>
                <button className="card-btn">View Profile</button>
              </div>

              <div className="dashboard-card">
                <h3>Courses</h3>
                <p>Browse and enroll in available courses</p>
                <button className="card-btn">View Courses</button>
              </div>

              <div className="dashboard-card">
                <h3>Assignments</h3>
                <p>Check your assignments and submissions</p>
                <button className="card-btn">View Assignments</button>
              </div>

              <div className="dashboard-card">
                <h3>Progress</h3>
                <p>Track your learning progress</p>
                <button className="card-btn">View Progress</button>
              </div>
            </div>
          </main>
        </div>
      )}

      <style jsx global>{`
        body {
          background: url("/assets/bg3.svg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
        }

        .welcome-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: url("/assets/bg4.svg")
          background-size: cover;
         
          backdrop-filter: blur(10px);
          z-index: 9999999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.5s ease-out;
        }

        .welcome-overlay.fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }

        .welcome-content {
          text-align: center;
          color: white;
          max-width: 500px;
          padding: 40px;
          animation: slideUp 0.8s ease-out 0.3s both;
        }

        .welcome-profile {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.3);
          margin: 0 auto 30px auto;
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          animation: scaleIn 0.8s ease-out 0.5s both;
        }

        .welcome-profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .welcome-profile-placeholder {
          width: 100%;
          height: 100%;
          background:  #9747FF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 48px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .welcome-title {
          font-size: 36px;
          margin-bottom: 10px;
          background: linear-gradient(40deg, #ff6a32, #ff6a32, #9747FF, #9747FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fadeInUp 0.8s ease-out 0.7s both;
        }

        .welcome-name {
          font-size: 28px;
          margin-bottom: 20px;
          color: white;
          animation: fadeInUp 0.8s ease-out 0.9s both;
        }

        .welcome-quote {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
          animation: fadeInUp 0.8s ease-out 1.1s both;
        }

        .welcome-continue-btn {
          background:  #9747FF;
          border: none;
          color: white;
          padding: 15px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          animation: fadeInUp 0.8s ease-out 1.3s both;
        }

        .welcome-continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 106, 50, 0.4);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(50px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.5);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dashboard-container {
          height: 100vh;
          color: white;
          position: relative;
          z-index: 1;
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
          padding-top: 0.5%; /* Add space for advertisement banner */
        }

        .dashboard-container.fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: white;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0;
          position: relative;
          z-index: 10;
        }

        .header-content {
          width: 100%;
          max-width: none;
          margin: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          min-height: 72px;
          box-sizing: border-box;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          height: 100%;
        }

        .shoora-logo {
          height: 40px;
          width: auto;
          display: block;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: bold;
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          display: flex;
          align-items: center;
          height: 40px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 18px;
          height: 100%;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-photo {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
        }

        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .profile-name {
          font-weight: 600;
          font-size: 14px;
          color: white;
        }

        .profile-status {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: capitalize;
        }

        .logout-btn, .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .logout-btn:hover, .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          position: relative;
          z-index: 1;
        }

        .error-section {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          text-align: center;
        }

        .error-section p {
          margin-bottom: 10px;
          color: #ffcccb;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .center-profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.3);
          margin: 0 auto 20px auto;
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .center-profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .center-profile-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 48px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .welcome-section h2 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .welcome-section p {
          font-size: 18px;
          opacity: 0.9;
          margin: 0;
        }

        .email-info {
          font-size: 14px !important;
          opacity: 0.7 !important;
          margin-top: 10px !important;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .dashboard-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .dashboard-card h3 {
          font-size: 20px;
          margin-bottom: 12px;
          color: #ff6a32;
          font-weight: 600;
        }

        .dashboard-card p {
          margin-bottom: 20px;
          opacity: 0.9;
          line-height: 1.5;
        }

        .card-btn {
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          width: 100%;
        }

        .card-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 106, 50, 0.4);
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        .mobile-toggle {
          display: none;
          cursor: pointer;
          margin-left: 12px;
        }

        .menu-toggle {
          font-size: 1.5rem;
          width: 1em;
          height: 1em;
          padding: 0 !important;
          z-index: 3;
          position: relative !important;
        }

        .line {
          height: 0.1em;
          width: 1em;
          background-color: var(--text-color);
          position: absolute;
          --gap: 0.25em;
          --animation-duration: 0.2s;
          --animation-interval-time: 0.05s;
        }

        .line1 {
          top: calc(50% - var(--gap));
          left: 0;
        }

        .line2 {
          bottom: calc(50% - var(--gap));
          right: 0;
        }

        .menu-toggle.menu-show .line {
          transform: translate(-50%, -50%);
        }

        .menu-toggle.menu-show .line1 {
          animation: vanished-from-right var(--animation-duration) linear both, from-top-left-to-bottom-right var(--animation-duration) linear calc(var(--animation-duration) + var(--animation-interval-time)) both;
        }

        .menu-toggle.menu-show .line2 {
          animation: vanished-from-left var(--animation-duration) linear both, from-top-right-to-bottom-left var(--animation-duration) linear calc(var(--animation-duration) + var(--animation-interval-time)) both;
        }

        @keyframes vanished-from-right {
          from {
            transform-origin: right;
            transform: translate(0, 0%);
            left: 0;
            width: 1em;
          }
          to {
            width: 0;
            transform: translate(0, 0%);
            left: 0;
          }
        }

        @keyframes vanished-from-left {
          from {
            right: 0%;
            left: initial;
            transform: translate(0, 0%);
            width: 1em;
          }
          to {
            right: 0%;
            left: initial;
            width: 0;
            transform: translate(0, 0%);
          }
        }

        @keyframes from-top-left-to-bottom-right {
          1% {
            top: 0%;
            left: 0%;
            width: 0;
            transform: translate(0%, 0%) rotate(45deg);
            transform-origin: left;
          }
          100% {
            top: 0%;
            left: 0%;
            transform-origin: left;
            width: 141.421356237%;
            transform: translate(0%, 0%) rotate(45deg);
          }
        }

        @keyframes from-top-right-to-bottom-left {
          1% {
            width: 0%;
            top: 0%;
            right: 0%;
            transform: translate(0, 0) rotate(-45deg);
            transform-origin: right;
          }
          100% {
            top: 0%;
            right: 0%;
            width: 141.421356237%;
            transform: translate(0, 0) rotate(-45deg);
            transform-origin: right;
          }
        }

        .mobile-menu-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 100vw;
          height: 100vh;
          background-image: url("/assets/bg2.svg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px 20px 20px;
          animation: slideInRight 0.3s ease-out;
          transform: translateX(0);
          backdrop-filter: blur(20px);
        }

        .menu-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000000;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.3s;
        }

        .menu-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @keyframes slideInRight {
          from { 
            transform: translateX(100%);
          }
          to { 
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from { 
            transform: translateX(0);
          }
          to { 
            transform: translateX(100%);
          }
        }

        .mobile-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .profile-photo.large {
          width: 80px;
          height: 80px;
          margin-bottom: 16px;
        }

        .edit-profile-btn {
          background: linear-gradient(45deg, #ff6a32, #9747FF);
          border: none;
          color: white;
          padding: 10px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 18px;
          margin-bottom: 10px;
          width: 100%;
          font-size: 16px;
        }

        .edit-profile-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
          .mobile-toggle {
            display: block !important;
          }
          .header-content {
            padding: 0 8px;
            min-height: 56px;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            position: relative;
          }
          .header-left {
            gap: 10px;
            height: 100%;
            display: flex;
            align-items: center;
            flex: 1;
          }
          .shoora-logo {
            height: 28px;
          }
          .dashboard-header h1 {
            font-size: 16px;
            height: 28px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            margin: 0;
          }
          .menu-toggle {
            font-size: 1.2rem;
          }
          .header-right {
            display: flex;
            align-items: center;
            gap: 18px;
            height: 100%;
            flex-shrink: 0;
          }
          .dashboard-main {
            padding: 20px 15px;
            position: relative;
            z-index: 1;
          }
          .welcome-overlay {
            padding: 20px;
          }
          .welcome-content {
            padding: 30px 20px;
          }
          .welcome-title {
            font-size: 28px;
          }
          .welcome-name {
            font-size: 24px;
          }
          .welcome-quote {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}