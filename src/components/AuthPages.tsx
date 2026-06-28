import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { firebaseAuth, UserProfile } from '../lib/mockFirebase';
import { CornerOrnament, AlpanaCircular } from './Ornaments';

interface AuthPageProps {
  onSuccess: (user: UserProfile) => void;
  onClose: () => void;
  onAltAction: () => void;
}

// ==========================================
// 1. PREMIUM SIGNUP / REGISTER PAGE
// ==========================================
export const RegisterPage: React.FC<AuthPageProps> = ({ onSuccess, onClose, onAltAction }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!fullName.trim()) {
      setError('Kindly write your full name coordinates.');
      return;
    }
    
    // Simple Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid, active email coordinate.');
      return;
    }

    if (password.length < 6) {
      setError('Security requirement: Password must comprise at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Coordinates do not match: Passwords are not identical.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the design and curation terms to register.');
      return;
    }

    setLoading(true);
    try {
      const user = await firebaseAuth.register(fullName.trim(), email, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'A transmission error occurred during client registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-brand-bg/95 border border-brand-clay/20 p-6 sm:p-10 rounded-3xl relative shadow-2xl font-sans" id="register-page-container">
      <CornerOrnament position="top-left" />
      <CornerOrnament position="bottom-right" />

      {/* Decorative top circular loop */}
      <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
        <AlpanaCircular size={160} />
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-brand-terracotta/30 bg-brand-beige/50 text-brand-terracotta text-sm mb-3">
          র
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-charcoal">Create Keeper Profile</h2>
        <p className="text-[10px] tracking-widest text-brand-clay uppercase mt-1">Acquire coordinates for custom launches</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-brand-terracotta/10 border border-brand-terracotta/40 text-brand-charcoal py-3 px-4 rounded-xl text-xs flex items-start gap-2 mb-6"
        >
          <AlertCircle className="w-4.5 h-4.5 text-brand-terracotta flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
            Full Name Coordinates *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-clay" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
              placeholder="Nilufer Begum"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
            Email Coordinates *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-clay" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
              placeholder="keeper@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
            Choose Key Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-clay" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-clay hover:text-brand-charcoal"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
            Verify Key Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-clay" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Checkbox agreement */}
        <div className="flex items-start gap-2.5 pt-2">
          <input
            id="agree-terms-checkbox"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-brand-clay/40 text-brand-terracotta focus:ring-brand-terracotta"
          />
          <label htmlFor="agree-terms-checkbox" className="text-[11px] text-[#666666] leading-snug cursor-pointer font-sans">
            I agree to traditional curation terms of service and allow Rongo to safely archive my coordinates.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
        >
          {loading ? 'Creating Profile...' : 'Confirm Registration'}
        </button>


      </form>

      <div className="border-t border-brand-clay/15 mt-8 pt-6 flex flex-col items-center gap-3">
        <button
          onClick={onAltAction}
          className="text-xs text-brand-charcoal hover:text-brand-terracotta transition-colors flex items-center gap-1 cursor-pointer font-semibold"
        >
          Already registered? Log in here
        </button>

        <button
          onClick={onClose}
          className="text-[10px] tracking-widest uppercase font-bold text-brand-clay hover:text-brand-charcoal transition-colors cursor-pointer"
        >
          ← Back to Exhibitions
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 2. PREMIUM LOGIN PAGE
// ==========================================
interface LoginProps extends AuthPageProps {
  onAltAction: () => void;
  onForgotPassword: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({ onSuccess, onClose, onAltAction, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please provide your login email.');
      return;
    }
    if (!password) {
      setError('Please state your password coordinates.');
      return;
    }

    setLoading(true);
    try {
      const user = await firebaseAuth.login(email, password, rememberMe);
      onSuccess(user);
    } catch (err: any) {
      console.error('Login coordinate failure:', err);
      const errMsg = (err?.message || '').toLowerCase();
      if (
        errMsg.includes('invalid-credential') ||
        errMsg.includes('user-not-found') ||
        errMsg.includes('wrong-password') ||
        errMsg.includes('invalid-email') ||
        errMsg.includes('auth/') ||
        errMsg.includes('invalid id') ||
        errMsg.includes('invalid credential') ||
        errMsg.includes('incorrect')
      ) {
        setShowErrorPopup(true);
      } else {
        setError(err?.message || 'Access coordinates denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-brand-bg/95 border border-brand-clay/20 p-6 sm:p-10 rounded-3xl relative shadow-2xl font-sans" id="login-page-container">
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />

      {/* Access Error Modal Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-brand-bg border border-brand-clay/30 max-w-sm w-full p-6 sm:p-8 rounded-2xl shadow-2xl relative font-sans text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-terracotta/10 text-brand-terracotta mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-charcoal mb-2">Sign-In Failed</h3>
            <p className="text-xs text-[#666666] leading-relaxed mb-6">
              The email address or password you entered is incorrect. Please check your credentials and try again.
            </p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300 cursor-pointer"
            >
              Acknowledge & Retry
            </button>
          </motion.div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 opacity-5 pointer-events-none">
        <AlpanaCircular size={150} />
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-brand-terracotta/30 bg-brand-beige/50 text-brand-terracotta text-sm mb-3">
          র
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-charcoal">Sign In to Rongo</h2>
        <p className="text-[10px] tracking-widest text-brand-clay uppercase mt-1">Unlock designer panels & curators vault</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-brand-terracotta/10 border border-brand-terracotta/40 text-brand-charcoal py-3 px-4 rounded-xl text-xs flex items-start gap-2 mb-6"
        >
          <AlertCircle className="w-4.5 h-4.5 text-brand-terracotta flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
            Email Coordinates
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-clay" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
              placeholder="curator@rongoheritage.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase">
              Secure Key Code
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[10px] font-bold text-brand-terracotta hover:underline cursor-pointer uppercase tracking-wider"
            >
              Forgot Code?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-clay" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-clay hover:text-brand-charcoal"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-brand-clay/40 text-brand-terracotta focus:ring-brand-terracotta"
            />
            <label htmlFor="remember-me" className="text-xs text-[#555555] cursor-pointer font-sans select-none">
              Keep signed in
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-charcoal text-brand-bg hover:bg-brand-terracotta py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
        >
          {loading ? 'Authenticating...' : 'Establish Secure Connection'}
        </button>
      </form>

      <div className="border-t border-brand-clay/15 mt-8 pt-6 flex flex-col items-center gap-3">
        <button
          onClick={onAltAction}
          className="text-xs text-brand-charcoal hover:text-brand-terracotta transition-colors flex items-center gap-1 cursor-pointer font-semibold"
        >
          No account? Register as Keeper
        </button>

        <button
          onClick={onClose}
          className="text-[10px] tracking-widest uppercase font-bold text-brand-clay hover:text-brand-charcoal transition-colors cursor-pointer"
        >
          ← Back to Exhibitions
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. PREMIUM FORGOT PASSWORD PAGE
// ==========================================
export const ForgotPasswordPage: React.FC<AuthPageProps & { onBackToLogin: () => void }> = ({ onClose, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid, active email coordinate.');
      return;
    }

    setLoading(true);
    try {
      const message = await firebaseAuth.forgotPassword(email);
      setSuccess(message);
    } catch (err: any) {
      setError(err?.message || 'Email coordinate was not located in our heritage logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-brand-bg/95 border border-brand-clay/20 p-6 sm:p-10 rounded-3xl relative shadow-2xl font-sans" id="forgot-password-container">
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-brand-terracotta/30 bg-brand-beige/50 text-brand-terracotta text-sm mb-3">
          র
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-charcoal">Reset Key Code</h2>
        <p className="text-[10px] tracking-widest text-brand-clay uppercase mt-1">Dispatches safe key to registered coordinates</p>
      </div>

      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-olive/10 text-brand-olive">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-lg font-medium text-brand-charcoal">Dispatch Complete</h4>
          <p className="text-xs text-brand-charcoal/80 leading-relaxed max-w-xs mx-auto">
            {success}
          </p>
          <button
            onClick={onBackToLogin}
            className="bg-brand-charcoal text-brand-bg hover:bg-brand-olive text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
          {error && (
            <div className="bg-brand-terracotta/10 border border-brand-terracotta/40 text-brand-charcoal py-3 px-4 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-brand-terracotta flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase mb-1">
              Your Email Coordinates
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-clay" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
                placeholder="curator@gmail.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
          >
            {loading ? 'Dispatching Key...' : 'Request Code Reset'}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-center text-xs text-brand-charcoal/70 hover:text-brand-charcoal hover:underline mt-2 font-medium cursor-pointer"
          >
            ← Back to Login
          </button>
        </form>
      )}

      <div className="border-t border-brand-clay/15 mt-8 pt-6 text-center">
        <button
          onClick={onClose}
          className="text-[10px] tracking-widest uppercase font-bold text-brand-clay hover:text-brand-charcoal transition-colors cursor-pointer"
        >
          ← Return to Shop Curation
        </button>
      </div>
    </div>
  );
};
