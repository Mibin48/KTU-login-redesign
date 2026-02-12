import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Mail,
  Phone,
  KeyRound,
  UserPlus,
  LogIn,
  HelpCircle,
  CheckCircle2,
  X,
  WifiOff,
} from 'lucide-react';
import { UserRole } from '../types';

/* ── helpers ── */
const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = '';
  for (let i = 0; i < 5; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
  return r;
};

const getPasswordStrength = (pw: string): { level: number; label: string; color: string } => {
  if (!pw) return { level: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 4) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 20, label: 'Weak', color: '#C53030' };
  if (score === 2) return { level: 40, label: 'Fair', color: '#DD6B20' };
  if (score === 3) return { level: 60, label: 'Good', color: '#D69E2E' };
  if (score === 4) return { level: 80, label: 'Strong', color: '#38A169' };
  return { level: 100, label: 'Very Strong', color: '#2F855A' };
};

interface LoginFormProps {
  darkMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ darkMode }) => {
  /* ── state ── */
  const [role, setRole] = useState<UserRole>('Student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(true);

  /* refs */
  const usernameRef = useRef<HTMLInputElement>(null);
  const roleBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const roles: UserRole[] = useMemo(() => ['Student', 'Faculty', 'Admin'], []);

  /* ── auto-focus ── */
  useEffect(() => {
    const t = setTimeout(() => usernameRef.current?.focus(), 700);
    return () => clearTimeout(t);
  }, []);

  /* ── clear shake ── */
  useEffect(() => {
    if (shakeField) {
      const t = setTimeout(() => setShakeField(null), 500);
      return () => clearTimeout(t);
    }
  }, [shakeField]);

  /* ── sliding role indicator ── */
  const updateIndicator = useCallback(() => {
    const idx = roles.indexOf(role);
    const btn = roleBtnRefs.current[idx];
    const indicator = indicatorRef.current;
    if (btn && indicator) {
      indicator.style.left = `${btn.offsetLeft}px`;
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.top = `${btn.offsetTop}px`;
      indicator.style.height = `${btn.offsetHeight}px`;
    }
  }, [role, roles]);

  useEffect(() => {
    updateIndicator();
    // Re-check after a short delay to ensure layout is settled
    const t = setTimeout(updateIndicator, 100);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptcha());
    setCaptchaValue('');
  }, []);

  /* ── validation ── */
  const isUsernameValid = username.trim().length >= 2;
  const isPasswordValid = password.length >= 4;
  const pwStrength = getPasswordStrength(password);

  const validateFields = (): boolean => {
    const errs: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errs.username = 'University ID is required';
      setShakeField('username');
    } else if (username.trim().length < 2) {
      errs.username = 'ID must be at least 2 characters';
      setShakeField('username');
    }
    if (!password) {
      errs.password = 'Password is required';
      if (!errs.username) setShakeField('password');
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
      if (!errs.username) setShakeField('password');
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── role config ── */
  const roleConfig = useMemo(() => ({
    Student: {
      headerSub: 'Secure access for Enrolled Students',
      label: 'University ID / Register Number',
      placeholder: 'e.g. TVA20CS045',
    },
    Faculty: {
      headerSub: 'Portal access for Faculty & Staff',
      label: 'Faculty ID / KTU ID',
      placeholder: 'e.g. KTU-F-12345',
    },
    Admin: {
      headerSub: 'Restricted Administrative Access',
      label: 'Admin Username',
      placeholder: 'e.g. admin.exam_cell',
    },
  }), []);

  const currentConfig = roleConfig[role];

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNetworkError(false);

    if (!validateFields()) return;

    if (showCaptcha && captchaValue.toUpperCase() !== captchaCode) {
      setError('Invalid captcha. Please try again.');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    setFormDisabled(true);

    await new Promise((r) => setTimeout(r, 1800));

    if (username === 'test' && password === 'password') {
      alert(`Login Successful as ${role}!`);
    } else {
      setError(
        "Invalid credentials. Please check your username and password, or reset your password if you've forgotten it."
      );
      setFailedAttempts((p) => p + 1);
      setShowCaptcha(true);
      setPassword(''); // clear for security
      refreshCaptcha();
    }
    setLoading(false);
    setFormDisabled(false);
  };

  const handleRoleChange = (r: UserRole) => {
    setRole(r);
    setError(null);
    setFieldErrors({});
    setUsername(''); // Clear username on role switch for better UX
    if (usernameRef.current) usernameRef.current.focus();
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (fieldErrors.username) setFieldErrors((p) => ({ ...p, username: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
  };

  const inputBorder = (field: 'username' | 'password', valid: boolean) => {
    if (fieldErrors[field]) return 'var(--ktu-error)';
    if (valid) return 'var(--ktu-success)';
    return 'var(--border-input)';
  };

  const inputFocusBorder = (field: 'username' | 'password') => {
    if (fieldErrors[field]) return 'var(--ktu-error)';
    return 'var(--ktu-primary)';
  };

  return (
    <div
      className="w-full h-full px-6 sm:px-10 lg:px-16 xl:px-20 py-8 lg:py-12 flex flex-col overflow-y-auto"
      style={{
        background: 'var(--bg-card)',
        transition: 'background 0.3s ease',
      }}
    >
      {/* ── Error Banner ── */}
      {error && (
        <div
          className="animate-slide-down mb-6 flex items-start gap-3 p-4 rounded-xl relative"
          style={{
            background: 'var(--bg-error-banner)',
            borderLeft: '4px solid var(--ktu-error)',
          }}
          role="alert"
        >
          <AlertCircle size={20} strokeWidth={2.2} style={{ color: 'var(--ktu-error)', flexShrink: 0, marginTop: '2px' }} />
          <p className="text-sm font-medium leading-relaxed pr-6" style={{ color: 'var(--ktu-error)' }}>{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-3 right-3 cursor-pointer p-1 rounded-lg hover:bg-black/5"
            style={{ transition: 'background 0.2s ease', minWidth: '28px', minHeight: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Dismiss error"
          >
            <X size={14} style={{ color: 'var(--ktu-error)' }} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ── Network Error Banner ── */}
      {networkError && (
        <div
          className="animate-slide-down mb-6 flex items-center gap-3 p-4 rounded-xl"
          style={{
            background: 'var(--bg-warning-banner)',
            borderLeft: '4px solid var(--ktu-warning)',
          }}
          role="alert"
        >
          <WifiOff size={20} strokeWidth={2.2} style={{ color: 'var(--ktu-warning)', flexShrink: 0 }} />
          <p className="text-sm font-medium leading-relaxed flex-1" style={{ color: '#92400E' }}>
            Network error. Please check your connection.
          </p>
          <button
            onClick={() => { setNetworkError(false); handleSubmit({ preventDefault: () => { } } as React.FormEvent); }}
            className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
            style={{ background: 'rgba(146, 64, 14, 0.1)', color: '#92400E', transition: 'background 0.2s ease' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-7 lg:mb-9 text-center lg:text-left">
        <h2
          className="font-serif font-bold mb-2"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--text-primary)' }}
        >
          Sign in to e-Governance Portal
        </h2>
        <p className="font-medium text-base lg:text-lg animate-fade-in" key={role} style={{ color: 'var(--text-secondary)' }}>
          {currentConfig.headerSub}
        </p>
      </div>

      {/* ── Role Selector with sliding indicator ── */}
      <div
        className="role-selector relative flex flex-col sm:flex-row p-1.5 rounded-[20px] sm:rounded-full mb-7 lg:mb-9 w-full max-w-sm mx-auto lg:mx-0 gap-1 sm:gap-0"
        style={{ background: 'var(--bg-pill)', transition: 'background 0.3s ease' }}
      >
        {/* Sliding background indicator */}
        <div ref={indicatorRef} className="role-indicator" />
        {roles.map((r, idx) => (
          <button
            key={r}
            ref={(el) => { roleBtnRefs.current[idx] = el; }}
            type="button"
            onClick={() => handleRoleChange(r)}
            className="relative z-[1] flex-1 py-2.5 px-4 rounded-full text-sm font-bold cursor-pointer"
            style={{
              background: 'transparent',
              color: role === r ? '#fff' : 'var(--text-secondary)',
              transition: 'color 0.3s ease',
            }}
            aria-pressed={role === r}
            aria-label={`Login as ${r}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <fieldset disabled={formDisabled} className="space-y-5" style={{ border: 'none', padding: 0, margin: 0 }}>
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm font-bold tracking-tight ml-0.5 animate-fade-in" key={`label-${role}`} style={{ color: 'var(--text-primary)' }}>
              {currentConfig.label}
            </label>
            <div
              className={`relative group flex items-center border-2 rounded-xl ${shakeField === 'username' ? 'animate-shake' : ''}`}
              style={{
                background: 'var(--bg-input)',
                borderColor: inputBorder('username', isUsernameValid),
                boxShadow: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
              }}
              onFocus={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = inputFocusBorder('username');
                el.style.boxShadow = 'var(--shadow-input-focus)';
              }}
              onBlur={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = inputBorder('username', isUsernameValid);
                el.style.boxShadow = 'none';
              }}
            >
              <div className="pl-4 flex items-center pointer-events-none">
                <User size={20} strokeWidth={2} style={{ color: 'var(--icon-secondary)', transition: 'color 0.3s ease' }} />
              </div>
              <input
                ref={usernameRef}
                id="username"
                type="text"
                required
                className="w-full h-[52px] pl-3 pr-10 bg-transparent outline-none text-base font-medium"
                style={{ color: 'var(--text-primary)' }}
                placeholder={currentConfig.placeholder}
                value={username}
                onChange={handleUsernameChange}
                aria-label={currentConfig.label}
                aria-invalid={!!fieldErrors.username}
                aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                autoComplete="username"
              />
              {/* Validation checkmark */}
              {isUsernameValid && !fieldErrors.username && (
                <div className="absolute right-3 animate-check-spring">
                  <CheckCircle2 size={18} style={{ color: 'var(--ktu-success)' }} strokeWidth={2.4} />
                </div>
              )}
            </div>
            {fieldErrors.username && (
              <p id="username-error" className="animate-fade-in text-xs font-semibold ml-1 mt-1" style={{ color: 'var(--ktu-error)' }}>
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
              <label htmlFor="password" className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <a
                href="#"
                className="text-sm font-bold underline-offset-4 hover:underline"
                style={{ color: 'var(--text-link)', transition: 'color 0.2s ease' }}
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password?
              </a>
            </div>
            <div
              className={`relative group flex items-center border-2 rounded-xl ${shakeField === 'password' ? 'animate-shake' : ''}`}
              style={{
                background: 'var(--bg-input)',
                borderColor: inputBorder('password', isPasswordValid),
                boxShadow: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
              }}
              onFocus={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = inputFocusBorder('password');
                el.style.boxShadow = 'var(--shadow-input-focus)';
              }}
              onBlur={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = inputBorder('password', isPasswordValid);
                el.style.boxShadow = 'none';
              }}
            >
              <div className="pl-4 flex items-center pointer-events-none">
                <Lock size={20} strokeWidth={2} style={{ color: 'var(--icon-secondary)', transition: 'color 0.3s ease' }} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full h-[52px] pl-3 pr-20 bg-transparent outline-none text-base font-medium"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                aria-label="Password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                autoComplete="current-password"
              />
              {/* Validation checkmark */}
              {isPasswordValid && !fieldErrors.password && (
                <div className="absolute right-12 animate-check-spring">
                  <CheckCircle2 size={18} style={{ color: 'var(--ktu-success)' }} strokeWidth={2.4} />
                </div>
              )}
              {/* Show/hide toggle */}
              <button
                type="button"
                className="absolute right-0 pr-4 flex items-center h-full cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ minWidth: '44px', minHeight: '44px', color: 'var(--icon-secondary)', transition: 'color 0.2s ease' }}
                tabIndex={0}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="animate-fade-in text-xs font-semibold ml-1 mt-1" style={{ color: 'var(--ktu-error)' }}>
                {fieldErrors.password}
              </p>
            )}

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="animate-fade-in mt-2 space-y-1.5">
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: darkMode ? '#333' : '#E5E7EB' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pwStrength.level}%`,
                      background: pwStrength.color,
                      transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease',
                    }}
                  />
                </div>
                <p className="text-[11px] font-semibold" style={{ color: pwStrength.color }}>
                  {pwStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Remember Me */}
          <div
            className="flex items-center gap-3 group cursor-pointer py-1"
            onClick={() => setRememberMe(!rememberMe)}
            role="checkbox"
            aria-checked={rememberMe}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setRememberMe(!rememberMe);
              }
            }}
            style={{ minHeight: '44px' }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{
                background: rememberMe ? 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)' : 'var(--bg-card)',
                border: rememberMe ? '2px solid #1E3A5F' : '2px solid var(--border-input)',
                transition: 'all 0.2s ease',
              }}
            >
              {rememberMe && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" className="animate-check-spring">
                  <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium select-none" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}>
              Keep me signed in for 30 days
            </span>
          </div>

          {/* Captcha - Conditional Render */}
          {showCaptcha && (
            <div
              className="animate-slide-down space-y-3 p-4 rounded-xl"
              style={{ background: 'var(--bg-captcha)', border: '1px solid var(--border-default)' }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-3 px-5 py-2.5 rounded-lg select-none"
                  style={{ background: 'var(--bg-card)', border: '2px dashed var(--border-input)' }}
                >
                  <span
                    className="text-xl font-bold tracking-[0.25em] font-mono"
                    style={{
                      color: 'var(--ktu-primary)',
                      textDecoration: 'line-through',
                      textDecorationColor: 'var(--ktu-accent)',
                      textDecorationThickness: '2px',
                    }}
                  >
                    {captchaCode}
                  </span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="cursor-pointer flex items-center justify-center"
                    aria-label="Refresh captcha"
                    style={{
                      minWidth: '44px', minHeight: '44px',
                      color: 'var(--icon-secondary)',
                      transition: 'color 0.2s ease, transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--ktu-primary)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(180deg)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--icon-secondary)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg)';
                    }}
                  >
                    <RefreshCw size={18} strokeWidth={2.2} />
                  </button>
                </div>
                <p className="text-xs font-bold max-w-[120px] text-right leading-tight" style={{ color: 'var(--text-secondary)' }}>
                  Security verification required
                </p>
              </div>
              <input
                type="text"
                required
                className="block w-full h-[48px] px-4 border-2 rounded-lg outline-none text-sm font-bold tracking-[0.2em]"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-input)',
                  color: 'var(--text-primary)',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--ktu-primary)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-input)'; }}
                placeholder="Enter text shown above"
                value={captchaValue}
                onChange={(e) => setCaptchaValue(e.target.value)}
                aria-label="Captcha verification code"
                autoComplete="off"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn-shimmer w-full h-[56px] rounded-xl font-bold text-white flex items-center justify-center gap-3 cursor-pointer ${loading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)',
              boxShadow: loading ? '0 4px 12px rgba(30,58,95,0.15)' : 'var(--shadow-btn)',
              transform: 'translateY(0)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              minHeight: '56px',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-btn-hover)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? '0 4px 12px rgba(30,58,95,0.15)' : 'var(--shadow-btn)';
            }}
            onMouseDown={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            aria-label="Sign in to portal"
          >
            {loading ? (
              <span className="flex items-center gap-2.5">
                <RefreshCw className="animate-spin" size={20} strokeWidth={2.5} />
                <span className="text-base">Signing in...</span>
              </span>
            ) : (
              <>
                <span className="text-lg">Sign In to Portal</span>
                <ArrowRight size={22} strokeWidth={2.2} />
              </>
            )}
          </button>
        </fieldset>
      </form>

      {/* ── Help Section ── */}
      <div className="mt-10 lg:mt-12">
        <div className="relative flex items-center mb-7">
          <div className="flex-grow" style={{ height: '1px', background: `linear-gradient(90deg, transparent, var(--border-default), transparent)` }} />
          <span className="px-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
            Need Help?
          </span>
          <div className="flex-grow" style={{ height: '1px', background: `linear-gradient(90deg, transparent, var(--border-default), transparent)` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <HelpCard icon={<KeyRound size={20} strokeWidth={2.2} />} label="Forgot Username?" />
          <HelpCard icon={<Lock size={20} strokeWidth={2.2} />} label="Forgot Password?" />
          <HelpCard icon={<LogIn size={20} strokeWidth={2.2} />} label="First Time Login?" />
          <HelpCard icon={<UserPlus size={20} strokeWidth={2.2} />} label="Registration Help" />
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-10 lg:mt-12 pt-6 flex flex-col items-center gap-4" style={{ borderTop: `1px solid var(--border-default)` }}>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="mailto:support@ktu.edu.in"
            className="flex items-center group"
            style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ktu-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
          >
            <Mail size={14} className="mr-2" strokeWidth={2} />
            <span className="text-sm font-semibold underline-offset-2 group-hover:underline">support@ktu.edu.in</span>
          </a>
          <a
            href="tel:+914712598122"
            className="flex items-center group"
            style={{ color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ktu-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
          >
            <Phone size={14} className="mr-2" strokeWidth={2} />
            <span className="text-sm font-semibold underline-offset-2 group-hover:underline">+91 471 2598122</span>
          </a>
        </div>
        <p className="text-[14px] text-center font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          © 2014 APJ Abdul Kalam Technological University.
          <br />
          This system is monitored. Unauthorized access is prohibited.
        </p>
      </footer>
    </div>
  );
};

/* ── Help Card Component ── */
const HelpCard: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <a
    href="#"
    onClick={(e) => e.preventDefault()}
    className="flex items-center gap-3 p-4 rounded-xl group text-left w-full no-underline"
    style={{
      background: 'var(--bg-help-card)',
      border: '1px solid var(--border-help)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textDecoration: 'none',
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLAnchorElement;
      el.style.background = 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)';
      el.style.transform = 'translateY(-3px)';
      el.style.boxShadow = 'var(--shadow-help-hover)';
      (el.lastChild as HTMLElement).style.color = '#fff';
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLAnchorElement;
      el.style.background = 'var(--bg-help-card)';
      el.style.transform = 'translateY(0)';
      el.style.boxShadow = 'none';
      (el.lastChild as HTMLElement).style.color = 'var(--text-primary)';
    }}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div
      className="p-2.5 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:scale-110"
      style={{
        background: 'var(--bg-card)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        color: 'var(--icon-primary)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, color 0.3s ease',
      }}
    >
      {icon}
    </div>
    <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)', transition: 'color 0.3s ease' }}>
      {label}
    </span>
  </a>
);

export default LoginForm;
