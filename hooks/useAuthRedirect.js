'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check for login status
    const studentId = typeof window !== 'undefined' && localStorage.getItem('studentId');
    const teacherId = typeof window !== 'undefined' && localStorage.getItem('teacherId');
    
    if (studentId) {
      router.replace('/student-dashboard');
      return;
    }
    
    if (teacherId) {
      router.replace('/teacher-dashboard');
      return;
    }
  }, [router]);
}

export function useDashboardAuth() {
  const router = useRouter();

  useEffect(() => {
    // Check for login status
    const studentId = typeof window !== 'undefined' && localStorage.getItem('studentId');
    const teacherId = typeof window !== 'undefined' && localStorage.getItem('teacherId');
    
    // Get current pathname
    const pathname = window.location.pathname;
    
    if (pathname.includes('student-dashboard') && !studentId) {
      router.replace('/student-login');
      return;
    }
    
    if (pathname.includes('teacher-dashboard') && !teacherId) {
      router.replace('/teacher-login');
      return;
    }
  }, [router]);
} 