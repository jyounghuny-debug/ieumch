import React, { useState } from 'react';
import { ChurchTheme } from '../types';
import { BookOpen, Heart, Users2, Globe2, Quote, Sparkles, UserCheck } from 'lucide-react';
import { pastorStudyImg } from '../data/initialData';

interface AboutSectionProps {
  theme: ChurchTheme;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  const [imgError, setImgError] = useState(false);

  const visions = [
    {
      num: '01',
      title: '말씀의 이음',
      desc: '타협하지 않는 순수한 성경적 복음의 진리를 통해 삶의 참된 기준과 목적을 발견합니다.',
      icon: BookOpen
    },
    {
      num: '02',
      title: '사랑의 이음',
      desc: '상처 입은 마음을 보듬고, 그리스도의 온유한 사랑으로 서로를 섬기는 가족 공동체입니다.',
      icon: Heart
    },
    {
      num: '03',
      title: '세대의 이음',
      desc: '어린이부터 어르신까지 모든 세대가 한 지붕 아래 믿음의 유산을 기쁨으로 이어갑니다.',
      icon: Users2
    },
    {
      num: '04',
      title: '세상과의 이음',
      desc: '교회 담장을 넘어 지역 사회의 아픔을 함께 나누며 예수 그리스도의 빛과 소금이 됩니다.',
      icon: Globe2
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
            About Ieum Church
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            사람을 잇고, 세상을 살리는 <br className="hidden sm:inline" />
            <span style={{ color: theme.primaryColor }}>{theme.churchName}</span>의 걸음
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            이음교회는 분열되고 차가운 세상 속에서, 십자가의 화목하게 하시는 은혜로 
            하나님과 사람, 사람과 이웃의 손을 맞잡는 따뜻한 믿음의 플랫폼입니다.
          </p>
        </div>

        {/* Pastor Welcome Card & Portrait (Split layout with optical balance) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* Pastor Photo Column */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900 min-h-[420px] lg:min-h-full relative flex flex-col justify-end group">
            {/* Main Pastor Image */}
            <img
              src={imgError ? pastorStudyImg : (theme.pastorImage || pastorStudyImg)}
              alt={`${theme.seniorPastor} ${theme.pastorTitle}`}
              referrerPolicy="no-referrer"
              onError={() => {
                setImgError(true);
              }}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-102"
            />

            {/* Gradient Scrim & Bottom Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6 sm:p-7 text-white">
              <div className="text-xl sm:text-2xl font-bold tracking-tight">{theme.seniorPastor}</div>
              <div className="text-xs text-sky-200 mt-0.5">{theme.churchName} {theme.pastorTitle}</div>
            </div>
          </div>

          {/* Welcome Letter Column */}
          <div className="lg:col-span-7 bg-[#FBFBFE] rounded-3xl p-8 sm:p-12 border border-slate-200/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-sky-700 mb-6">
                <Quote className="w-8 h-8 opacity-80" />
                <span className="text-sm font-semibold tracking-wide">목회자 인사말</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-6">
                "{theme.pastorGreeting}"
              </h3>

              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                {theme.pastorGreetingDetails.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">이음교회 담임목사</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{theme.seniorPastor}</p>
              </div>
              <div
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-sky-800 bg-sky-50 border border-sky-200/60"
              >
                Connecting with Grace
              </div>
            </div>
          </div>

        </div>

        {/* 4 Core Pillars of Vision (Clean Editorial Numbering, no slop comments) */}
        <div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900">
              이음교회의 4대 핵심 사명 (Core Vision)
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              그리스도의 몸 된 공동체로서 날마다 추구하는 믿음의 방향입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visions.map((v) => {
              const IconComp = v.icon;
              return (
                <div
                  key={v.num}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-sky-600">
                      {v.num}
                    </span>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sky-700 bg-sky-50"
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {v.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
