import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GetStartedModal({ open, onClose, onlyLogin = false, forceRole = null }) {
  const [step, setStep] = useState(forceRole ? 1 : 0); // If forceRole, skip to step 1
  const [role, setRole] = useState(forceRole); // If forceRole, set role immediately
  const router = useRouter();

  if (!open) return null;

  const handleRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(1);
  };

  const handleAction = (action) => {
    // Route to the correct page for login/register
    if (role === 'student') {
      if (action === 'login') {
        router.push('/student-login');
      } else {
        router.push('/student/register');
      }
    } else if (role === 'teacher') {
      if (action === 'login') {
        router.push('/teacher-login');
      } else {
        router.push('/teacher/register');
      }
    }
    if (onClose) onClose();
  };

  const handleBack = () => {
    setStep(0);
    setRole(null);
  };

  return (
    <>
    <div className="blur-overlay" onClick={onClose}></div>
    <div className="getstarted-modal-overlay" onClick={onClose}>
      <div className="getstarted-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {/* Step 0: Choose role */}
        {!forceRole && step === 0 && (
          <>
            <h2>Get Started</h2>
            <div className="modal-options">
              <button className="modal-btn" onClick={() => handleRole('student')}>I'm a Student</button>
              <button className="modal-btn" onClick={() => handleRole('teacher')}>I'm a Teacher</button>
            </div>
          </>
        )}

        {/* Step 1: Choose action (login/register) */}
        {step === 1 && (
          <>
            <h2>{role === 'student' ? 'Student' : 'Teacher'} Account</h2>
            <div className="modal-options">
              <button className="modal-btn" onClick={() => handleAction('login')}>Login</button>
              <button className="modal-btn" onClick={() => handleAction('register')}>Register</button>
            </div>
            <button className="back-btn" onClick={handleBack}>← Back</button>
          </>
        )}
      </div>
      <style jsx>{`
        .getstarted-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .getstarted-modal {
          background-image: url("/assets/bg2.svg");
          color: #fff;
          border-radius: 16px;
          padding: 2.5rem 2rem 2rem 2rem;
          min-width: 320px;
          max-width: 90vw;
          box-shadow: 0 8px 32px 0 rgba(10,12,20,0.22);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .getstarted-modal h2{
        font-family: "NeueMachina";
        }
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
        }
        .modal-options {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-top: 1.5rem;
        }
        .modal-btn {
          background: #9747ff;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.9rem 2.2rem;
          font-size: 1.1rem;
          font-family: "NeueMachina" ;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .modal-btn:hover {
          background: #7a2be0;
        }
        .back-btn {
          margin-top: 1.5rem;
          background: none;
          color: #bdbdbd;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .back-btn:hover {
          color: #fff;
        }

        .blur-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 9998;
                    backdrop-filter: blur(6px);
                    background: rgba(0,0,0,0.2);
                    pointer-events: none;
                }
      `}</style>
    </div>
    </>
  );
} 