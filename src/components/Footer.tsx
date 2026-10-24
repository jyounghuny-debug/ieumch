import React from 'react';
import { ChurchTheme, SEOSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import { Youtube, Instagram, MessageCircle, Bookmark, Sliders, Share2, PenLine, Heart } from 'lucide-react';

interface FooterProps {
  theme: ChurchTheme;
  seoSettings: SEOSettings;
  onOpenCustomizer: () => void;
  onOpenSEO: () => void;
  onOpenNewPost: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  seoSettings,
  onOpenCustomizer,
  onOpenSEO,
  onOpenNewPost
}) => {
  const { isEditor } = useAuth();
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-slate-800">
          
          {/* Col 1: Church Brand & Slogan (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span className="text-2xl font-bold tracking-tight">{theme.churchName}</span>
              <span className="text-xs font-medium text-slate-400 font-mono tracking-wider">
                {theme.churchEngName}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {theme.slogan} <br />
              {theme.subSlogan}
            </p>

            <div className="text-xs text-slate-500 font-serif-kr italic">
              "{theme.scriptureVerse}"
            </div>

            {/* Social Media Link Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={seoSettings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="유튜브 공식 채널"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={seoSettings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="인스타그램"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={seoSettings.socialLinks.kakaotalk}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="카카오톡 채널"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={seoSettings.socialLinks.band}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="네이버 밴드"
              >
                <Bookmark className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Contact & Location Info (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3 text-xs leading-relaxed text-slate-400">
            <h4 className="text-sm font-bold text-white mb-3">교회 행정 및 연락처</h4>
            <p><strong>주소:</strong> {theme.address} {theme.addressDetail}</p>
            <p><strong>대표전화:</strong> {theme.phone} / <strong>팩스:</strong> 02-555-2027</p>
            <p><strong>이메일:</strong> {theme.email}</p>
            <p><strong>담임목사:</strong> {theme.seniorPastor}</p>
            <p className="pt-2 text-[11px] text-slate-500">
              * 온라인 헌금 계좌: 국민은행 123-456-789012 (예금주: 기독교대한감리회 이음교회)
            </p>
          </div>

          {/* Col 3: Quick Administrative Controls (lg:col-span-3) */}
          {isEditor ? (
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-white mb-3">웹사이트 관리 도구</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={onOpenCustomizer}
                  type="button"
                  className="w-full text-left px-3.5 py-2 text-xs rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>디자인 & 콘텐츠 설정 스튜디오</span>
                </button>

                <button
                  onClick={onOpenNewPost}
                  type="button"
                  className="w-full text-left px-3.5 py-2 text-xs rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <PenLine className="w-3.5 h-3.5 text-sky-400" />
                  <span>새 소식 및 설교글 작성</span>
                </button>

                <button
                  onClick={onOpenSEO}
                  type="button"
                  className="w-full text-left px-3.5 py-2 text-xs rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>SEO 검색 엔진 & SNS 도구</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-white mb-3">이음 공동체 비전</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                사람과 사람을 잇고, 교회와 세상을 이으며, 다음 세대와 열방을 향해 나아가는 거룩한 십자가 복음의 공동체입니다.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-mono">
                주일예배: 오전 09:30 / 11:00
              </div>
            </div>
          )}

        </div>

        {/* Bottom Bar: Copyright & Quiet notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {theme.churchName} ({theme.churchEngName}). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-slate-300 transition-colors">교회소개</a>
            <span aria-hidden="true">·</span>
            <a href="#worship" className="hover:text-slate-300 transition-colors">예배시간</a>
            <span aria-hidden="true">·</span>
            <a href="#calendar" className="hover:text-slate-300 transition-colors">교회일정</a>
            <span aria-hidden="true">·</span>
            <a href="#board" className="hover:text-slate-300 transition-colors">이음주보</a>
            <span aria-hidden="true">·</span>
            <a href="#directions" className="hover:text-slate-300 transition-colors">오시는길</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
