'use client';
import { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const [userType, setUserType] = useState('student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* User Type Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome to Shoora Tech
          </h2>
          
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'student'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👨‍🎓 Student
            </button>
            <button
              onClick={() => setUserType('teacher')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'teacher'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👨‍🏫 Teacher
            </button>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm">
              {userType === 'student' 
                ? 'Login to access your student dashboard'
                : 'Login to access your teacher dashboard'
              }
            </p>
          </div>
        </div>

        {/* Login Form */}
        <LoginForm initialRole={userType} />
        
        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <a 
            href="/register" 
            className="text-blue-600 hover:text-blue-800 text-sm block"
          >
            Don't have an account? Register here
          </a>
          <a 
            href="/forgot-password" 
            className="text-gray-600 hover:text-gray-800 text-sm block"
          >
            Forgot your password?
          </a>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
} 