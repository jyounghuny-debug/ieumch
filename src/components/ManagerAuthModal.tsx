import React, { useState } from 'react';
import { useAuth, OWNER_EMAIL } from '../context/AuthContext';
import { X, Shield, KeyRound, CheckCircle2, AlertCircle, Sparkles, LogIn, Lock, Mail, UserCheck, ChevronRight } from 'lucide-react';
import { ChurchTheme } from '../types';

interface ManagerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ChurchTheme;
}

export const ManagerAuthModal: React.FC<ManagerAuthModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  const { 
    loginWithGoogle, 
    loginAsOwner, 
    loginWithGoogleEmail, 
    loginWithPasscode, 
    authError, 
    clearAuthError, 
    isEditor, 
    currentManager, 
    logout,
    masterPasscode 
  } = useAuth();

  const [passcode, setPasscode] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'google' | 'passcode'>('google');
  const [showOtherEmail, setShowOtherEmail] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1-Click Pastor Google Authentication
  const handleDirectOwnerLogin = () => {
    setIsLoading(true);
    setFeedback(null);
    clearAuthError();
    const res = loginAsOwner();
    setIsLoading(false);
    if (res.success) {
      setFeedback(res.message);
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1200);
    }
  };

  // Google Popup Authentication (with auto-fallback in restricted environments)
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setFeedback(null);
    clearAuthError();
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.success) {
      setFeedback(res.message);
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1200);
    }
  };

  // Other Authorized Google Email Login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    clearAuthError();
    const res = loginWithGoogleEmail(googleEmail.trim());
    if (res.success) {
      setFeedback(res.message);
      setGoogleEmail('');
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1200);
    }
  };

  // Master Passcode Login
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    clearAuthError();
    const success = loginWithPasscode(passcode);
    if (success) {
      setFeedback('정영훈 담임목사님(마스터 인증)으로 로그인되었습니다.');
      setPasscode('');
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1200);
    }
  };

  // Auto-fill master passcode
  const handleQuickFillMasterPasscode = () => {
    setPasscode(masterPasscode || 'ieum2026!');
    clearAuthError();
    const success = loginWithPasscode(masterPasscode || 'ieum2026!');
    if (success) {
      setFeedback('마스터 인증키로 확인되었습니다. 환영합니다!');
      setPasscode('');
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Authorized Access Only
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditor ? '관리자 권한 상태' : '이음교회 관리자 로그인'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              clearAuthError();
              setFeedback(null);
              onClose();
            }}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {isEditor && currentManager ? (
            /* Logged in state */
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-100 text-sky-800 mb-1">
                  {currentManager.role === 'owner' ? '홈페이지 최고관리자' : '인가된 사역 관리자'}
                </span>
                <h4 className="text-lg font-bold text-slate-900">{currentManager.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{currentManager.email}</p>
                <p className="text-xs text-slate-600 mt-2">
                  홈페이지 디자인, 설교말씀, 소식 및 주보, 갤러리 수정 권한이 활성화되어 있습니다.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={async () => {
                    await logout();
                    setFeedback('로그아웃되었습니다. 일반 교인 열람 모드로 전환됩니다.');
                    setTimeout(() => setFeedback(null), 2000);
                  }}
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
                >
                  관리자 로그아웃
                </button>
                <button
                  onClick={onClose}
                  type="button"
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  확인 (홈페이지 수정 계속)
                </button>
              </div>
            </div>
          ) : (
            /* Not logged in: Choice of Google or Passcode */
            <div className="space-y-4">
              <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-sky-900 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>수정 권한 보호 안내</span>
                </p>
                이음교회 홈페이지는 <strong>정영훈 담임목사님({OWNER_EMAIL})</strong> 및 권한이 부여된 사역자만 내용을 수정할 수 있습니다.
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('google');
                    clearAuthError();
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    loginMethod === 'google'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  구글 계정 인증
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('passcode');
                    clearAuthError();
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    loginMethod === 'passcode'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  관리자 인증키 입력
                </button>
              </div>

              {loginMethod === 'google' ? (
                <div className="space-y-3.5 pt-1">
                  
                  {/* Option 1: Direct 1-Click Pastor Google Authentication Card */}
                  <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-2xl border border-sky-200/90 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          정
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>정영훈 담임목사</span>
                            <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-semibold">최고관리자</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{OWNER_EMAIL}</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        승인됨
                      </span>
                    </div>

                    <button
                      onClick={handleDirectOwnerLogin}
                      disabled={isLoading}
                      type="button"
                      className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>정영훈 담임목사님 구글 계정으로 즉시 로그인</span>
                    </button>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-2 text-[11px] text-slate-400 font-medium">또는 브라우저 팝업 인증</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* Option 2: Standard Google Popup Auth (with automatic environment handling) */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    type="button"
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-xs border border-slate-300 shadow-xs flex items-center justify-center gap-2.5 transition-all active:scale-98 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>{isLoading ? '구글 계정 확인 중...' : 'Google 계정으로 관리자 로그인'}</span>
                  </button>

                  {/* Option 3: Other Staff Google Email login */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowOtherEmail(!showOtherEmail)}
                      className="text-[11px] text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1 mx-auto"
                    >
                      <span>권한이 부여된 다른 사역자 구글 이메일로 로그인</span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${showOtherEmail ? 'rotate-90' : ''}`} />
                    </button>

                    {showOtherEmail && (
                      <form onSubmit={handleEmailLogin} className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>등록된 사역자 구글 이메일</span>
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="email"
                            value={googleEmail}
                            onChange={(e) => setGoogleEmail(e.target.value)}
                            placeholder="예: assistant@ieum.org"
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 shrink-0"
                          >
                            확인
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                </div>
              ) : (
                <form onSubmit={handlePasscodeLogin} className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                        <span>교회 마스터 관리자 인증키</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleQuickFillMasterPasscode}
                        className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold underline"
                      >
                        기본키({masterPasscode}) 바로 로그인
                      </button>
                    </div>

                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="관리자 인증키 입력"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-mono"
                      autoFocus
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      어떤 컴퓨터나 스마트폰에서도 관리자 인증키로 즉시 로그인할 수 있습니다.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-bold text-white rounded-xl shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>인증키로 로그인</span>
                  </button>
                </form>
              )}

              {/* Error Alert */}
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{authError}</div>
                </div>
              )}

              {/* Success Feedback */}
              {feedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
