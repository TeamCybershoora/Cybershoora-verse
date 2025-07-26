'use client';

import LoginForm from '../../components/LoginForm';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

export default function TeacherLoginPage() {
  // Use custom auth hook
  useAuthRedirect();

  return <LoginForm initialRole="teacher" />;
} 