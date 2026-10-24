import React, { useState, useEffect } from 'react';
import { missionFields } from '../data/missionData';
import { ChurchTheme } from '../types';
import { ChevronLeft, ChevronRight, Globe, Flame, ExternalLink, ArrowRight } from 'lucide-react';

interface MissionUrgentBannerProps {
  theme: ChurchTheme;
  onOpenModal: (fieldId?: string) => void;
}

export const MissionUrgentBanner: React.FC<MissionUrgentBannerProps> = ({
  theme,
  onOpenModal
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % missionFields.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentField = missionFields[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + missionFields.length) % missionFields.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % missionFields.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onOpenModal(currentField.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpenModal(currentField.id);
        }
      }}
      className="group cursor-pointer relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-xl border border-slate-700/80 shadow-xs hover:border-sky-400/60 transition-all duration-300 py-1.5 px-2.5 sm:px-3 flex items-center gap-2.5 max-w-full sm:max-w-xl md:max-w-lg lg:max-w-md xl:max-w-lg text-left"
      title="클릭하여 김동선/이금주/김명식 선교사님의 최신 사역지 소식과 긴급 기도제목 보기"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-rose-500/15 rounded-full blur-xl pointer-events-none" />

      {/* Urgent Badge with Pulsing Live Dot */}
      <div className="shrink-0 flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[11px] font-bold px-2 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        <span className="hidden xs:inline">선교지</span>
        <span>긴급기도</span>
      </div>

      {/* Sliding Content Area */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div
          key={currentField.id}
          className="animate-in fade-in slide-in-from-right-3 duration-300 flex items-center gap-1.5"
        >
          <span className="text-xs font-semibold text-sky-300 shrink-0">
            {currentField.flag} {currentField.missionaries}
          </span>
          <span className="text-slate-500 hidden sm:inline text-xs">|</span>
          <p className="text-xs text-slate-200 truncate font-normal group-hover:text-white transition-colors">
            {currentField.currentUrgentTopic}
          </p>
        </div>
      </div>

      {/* Controls & Prompt */}
      <div className="shrink-0 flex items-center gap-1 text-slate-400 pl-1 border-l border-slate-700/60">
        <span className="text-[10px] font-mono text-slate-400 hidden xl:inline px-1">
          {currentIndex + 1}/{missionFields.length}
        </span>
        <button
          onClick={handlePrev}
          type="button"
          aria-label="이전 선교지 기도"
          className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          type="button"
          aria-label="다음 선교지 기도"
          className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <span className="hidden sm:flex items-center text-[11px] font-semibold text-sky-400 group-hover:translate-x-0.5 transition-transform ml-1">
          소식보기
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
