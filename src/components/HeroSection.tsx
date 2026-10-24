import React from 'react';
import { ChurchTheme } from '../types';
import { ArrowRight, Clock, HeartHandshake, Tv, MapPin } from 'lucide-react';

interface HeroSectionProps {
  theme: ChurchTheme;
  onOpenNewFamily: () => void;
  onWorshipClick: () => void;
  onCalendarClick: () => void;
  onSermonClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onOpenNewFamily,
  onWorshipClick,
  onCalendarClick,
  onSermonClick
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Container with High-Fidelity Sanctuary Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 min-h-[520px] md:min-h-[600px] flex flex-col justify-end">
          
          {/* Background Image with Gentle Sky-Blue Scrim */}
          <img
            src={theme.heroImage}
            alt={`${theme.churchName} 본당 전경`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85 transition-transform duration-700 hover:scale-102"
          />

          {/* Atmospheric Gradient Scrim (Measured contrast: 4.5:1 text legibility) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent pointer-events-none" />

          {/* Hero Content Overlay */}
          <div className="relative z-10 p-6 sm:p-10 md:p-16 max-w-3xl">
            {/* Church Vision Kicker */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-sky-200 mb-3 tracking-wide">
              <span>{theme.churchName}</span>
              <span aria-hidden="true">·</span>
              <span>{theme.churchEngName}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.2] mb-6 text-balance">
              {theme.slogan}
            </h1>

            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs sm:text-sm text-sky-100 mb-8 max-w-xl">
              "{theme.scriptureVerse}"
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onOpenNewFamily}
                type="button"
                className="px-6 py-3.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all flex items-center gap-2 hover:opacity-95 active:scale-98"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <span>새가족 등록 안내</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onWorshipClick}
                type="button"
                className="px-6 py-3.5 text-sm font-medium text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl border border-white/30 transition-all active:scale-98"
              >
                예배 시간표 확인
              </button>

              <button
                onClick={onCalendarClick}
                type="button"
                className="px-5 py-3.5 text-sm font-medium text-sky-100 bg-sky-950/40 hover:bg-sky-900/60 backdrop-blur-md rounded-xl border border-sky-400/30 transition-all active:scale-98"
              >
                교회 행사 캘린더
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Info Band Immediately Below Hero (Claim-to-Proof Adjacency) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 -mt-6 sm:-mt-8 relative z-20 px-3 sm:px-6">
          
          {/* Card 1: Worship Time */}
          <div
            onClick={onWorshipClick}
            className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                이번 주 주일
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              주일 공동체예배
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              매주 주일 오전 11:00 · 예배실 (4층)
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-sky-700 group-hover:gap-1.5 transition-all">
              <span>예배 순서 보기</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: New Family */}
          <div
            onClick={onOpenNewFamily}
            className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500">
                따뜻한 환영
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              처음 오셨나요?
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              부담 없는 4주 새가족 정착 안내 및 상담
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-sky-700 group-hover:gap-1.5 transition-all">
              <span>새가족 가이드</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Online Live & Sermons */}
          <div
            onClick={onSermonClick}
            className="group cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Tv className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                LIVE 예배
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              온라인 실시간 예배
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              유튜브 채널을 통해 언제 어디서나 예배
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-sky-700 group-hover:gap-1.5 transition-all">
              <span>최신 설교 듣기</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
