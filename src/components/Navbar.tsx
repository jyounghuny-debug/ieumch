import React, { useState } from 'react';
import { ChurchTheme } from '../types';
import { Menu, X, Sliders, Share2, PenLine, Sparkles, Save, Globe, ShieldCheck, Users, KeyRound, LogOut, Lock } from 'lucide-react';
import { MissionUrgentBanner } from './MissionUrgentBanner';
import { useAuth, OWNER_EMAIL } from '../context/AuthContext';

interface NavbarProps {
  theme: ChurchTheme;
  onOpenCustomizer: () => void;
  onOpenSEO: () => void;
  onOpenNewPost: () => void;
  onOpenNewFamilyModal: () => void;
  onSaveWebsite?: () => void;
  onOpenMissionModal: (fieldId?: string) => void;
  onOpenPermissionsModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onOpenCustomizer,
  onOpenSEO,
  onOpenNewPost,
  onOpenNewFamilyModal,
  onSaveWebsite,
  onOpenMissionModal,
  onOpenPermissionsModal,
  onOpenAuthModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isEditor, isOwner, currentManager, logout } = useAuth();

  const navLinks = [
    { label: '교회소개', href: '#about' },
    { label: '예배안내', href: '#worship' },
    { label: '교회일정', href: '#calendar' },
    { label: '설교말씀', href: '#sermon' },
    { label: '중보기도', href: '#prayer' },
    { label: '소식·주보', href: '#board' },
    { label: '교제·갤러리', href: '#gallery' },
    { label: '오시는 길', href: '#directions' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      {/* Top Utility Bar with Urgent Mission Prayer Sliding Banner at Top-Right */}
      <div className="bg-slate-950 text-white text-xs border-b border-slate-800/90 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-3 text-slate-300 text-xs">
            <span className="font-semibold text-sky-400">{theme.churchName}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">{theme.address} {theme.addressDetail}</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-300">{theme.phone}</span>
          </div>

          {/* 우측 상단 '선교지 긴급기도' 슬라이딩 배너 & 관리자 로그인 상태 */}
          <div className="w-full md:w-auto flex items-center justify-end gap-3 ml-auto">
            {isEditor && currentManager && (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>관리자 모드: {currentManager.name}</span>
                {isOwner && <span className="text-amber-300 font-bold">[최고관리자]</span>}
              </div>
            )}

            <MissionUrgentBanner
              theme={theme}
              onOpenModal={onOpenMissionModal}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              className="text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap hover:opacity-85 transition-opacity flex items-center gap-2.5"
            >
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
                aria-hidden="true"
              />
              <span>{theme.churchName}</span>
              <span className="text-xs font-medium tracking-widest text-slate-600 hidden sm:inline">
                {theme.churchEngName}
              </span>
            </a>
          </div>

          {/* Zone 2: 4-6 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap shrink-0 hover:text-slate-950 transition-colors py-1 relative group"
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action + administrative tool buttons (Only visible to Authorized Editors) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* If Logged In as Authorized Manager */}
            {isEditor && currentManager ? (
              <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-sky-50/90 rounded-xl border border-sky-200/90 shadow-xs">
                {/* Manager Name / Badge */}
                <button
                  onClick={onOpenAuthModal}
                  type="button"
                  className="p-1 sm:px-2.5 sm:py-1.5 text-xs font-bold text-sky-900 bg-white hover:bg-sky-50 rounded-lg border border-sky-200/80 transition-colors flex items-center gap-1 shadow-2xs"
                  title="관리자 인증 정보 확인"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden xl:inline">{currentManager.name}</span>
                  <span className="text-[10px] text-sky-600 font-semibold hidden md:inline">
                    {isOwner ? '최고권한' : '사역관리'}
                  </span>
                </button>

                {/* Permissions Management Button (Owner & Admins Only) */}
                {isOwner && (
                  <button
                    onClick={onOpenPermissionsModal}
                    type="button"
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="홈페이지 수정 권한 부여 및 관리자 명단 설정"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden md:inline">권한 부여</span>
                  </button>
                )}

                {/* Save Website */}
                <button
                  onClick={onSaveWebsite}
                  type="button"
                  className="p-1.5 sm:px-2 sm:py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="이음교회 홈페이지 현재 상태 저장하기"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden lg:inline">저장</span>
                </button>

                {/* Customizer */}
                <button
                  onClick={onOpenCustomizer}
                  type="button"
                  className="p-1.5 sm:px-2 sm:py-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="디자인, 색상, 폰트 및 문구 커스터마이징"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden lg:inline">디자인</span>
                </button>

                {/* New Post */}
                <button
                  onClick={onOpenNewPost}
                  type="button"
                  className="p-1.5 sm:px-2 sm:py-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="새로운 소식, 주보, 설교글 작성하기"
                >
                  <PenLine className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden lg:inline">글쓰기</span>
                </button>

                {/* SEO */}
                <button
                  onClick={onOpenSEO}
                  type="button"
                  className="p-1.5 sm:px-2 sm:py-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="SEO 검색 엔진 및 SNS 공유 설정"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden lg:inline">SEO</span>
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  type="button"
                  className="p-1.5 sm:px-2 sm:py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                  title="관리자 로그아웃 (일반 열람 모드로 전환)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">로그아웃</span>
                </button>
              </div>
            ) : (
              /* Public Visitor: Discreet Admin Sign-In Key Button */
              <button
                onClick={onOpenAuthModal}
                type="button"
                className="px-3 py-1.5 text-xs font-semibold text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100/80 rounded-lg border border-sky-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                title="이음교회 홈페이지 관리자 로그인 (정영훈 담임목사 구글 계정)"
              >
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>관리자 로그인</span>
              </button>
            )}

            {/* Quick Mission Urgent Prayer Button */}
            <button
              onClick={() => onOpenMissionModal()}
              type="button"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/90 rounded-lg border border-rose-200 transition-colors shadow-2xs"
              title="선교지 긴급기도 및 사역지 소식 팝업 열기"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span>선교지 소식</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewFamilyModal}
              type="button"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 hover:opacity-95 active:scale-98"
              style={{ backgroundColor: theme.primaryColor }}
            >
              새가족 등록
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in duration-200">
          <nav className="flex flex-col gap-1 pb-3 mb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="flex flex-col gap-2 pt-1">
            {/* Mobile Admin Status & Actions */}
            {isEditor && currentManager ? (
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-2 mb-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-sky-950">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>{currentManager.name} ({isOwner ? '최고관리자' : '사역관리자'})</span>
                  </div>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    로그아웃
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {isOwner && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenPermissionsModal();
                      }}
                      className="py-2 text-xs font-bold text-amber-900 bg-amber-100/80 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-700" />
                      권한 부여 관리
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCustomizer();
                    }}
                    className="py-2 text-xs font-semibold text-slate-700 bg-white rounded-lg border border-slate-200 flex items-center justify-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    디자인 설정
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenNewPost();
                    }}
                    className="py-2 text-xs font-semibold text-slate-700 bg-white rounded-lg border border-slate-200 flex items-center justify-center gap-1"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    새 글 작성
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSaveWebsite?.();
                    }}
                    className="py-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 rounded-lg flex items-center justify-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-600" />
                    전체 저장
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center justify-center gap-2 mb-2"
              >
                <KeyRound className="w-4 h-4 text-sky-600" />
                <span>관리자 로그인 (정영훈 담임목사 구글 계정)</span>
              </button>
            )}

            {/* Mobile Urgent Mission Notice */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMissionModal();
              }}
              className="w-full py-2.5 px-3 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>선교지 긴급기도 & 사역소식 팝업</span>
              </div>
              <span className="text-[11px] font-semibold text-rose-600">소식보기 →</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenNewFamilyModal();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white rounded-lg shadow-sm"
              style={{ backgroundColor: theme.primaryColor }}
            >
              새가족 온라인 등록 신청
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
