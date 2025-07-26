'use client';

import LoginForm from '../../components/LoginForm';
// import { useAuthRedirect } from '../../hooks/useAuthRedirect';

export default function StudentLoginPage() {
  // useAuthRedirect(); // Remove this line
  return <LoginForm initialRole="student" />;
} 