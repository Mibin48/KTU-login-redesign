import React from 'react';

export type UserRole = 'Student' | 'Faculty' | 'Admin';

export interface LoginState {
  role: UserRole;
  username: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
  failedAttempts: number;
  captchaValue: string;
  loading: boolean;
  error: string | null;
  networkError: boolean;
  formDisabled: boolean;
  fieldErrors: {
    username?: string;
    password?: string;
  };
}

export interface QuickLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface LoginFormProps {
  darkMode: boolean;
}
