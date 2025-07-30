'use client';
import { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [userType, setUserType] = useState('student');

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        {/* User Type Selector */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
            Welcome to Shoora Tech
          </h2>
          
          <div className="flex p-1 mb-6 bg-gray-100 rounded-lg">
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
          
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
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
        <div className="mt-6 space-y-2 text-center">
          <a 
            href="/register" 
            className="block text-sm text-blue-600 hover:text-blue-800"
          >
            Don't have an account? Register here
          </a>
          <a 
            href="/forgot-password" 
            className="block text-sm text-gray-600 hover:text-gray-800"
          >
            Forgot your password?
          </a>
        </div>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
} 