import React from 'react';
import { ChurchTheme, WorshipSchedule } from '../types';
import { Clock, MapPin, Youtube, Radio, CheckCircle2, Volume2 } from 'lucide-react';

interface WorshipScheduleSectionProps {
  theme: ChurchTheme;
  schedules: WorshipSchedule[];
  onOpenSEO: () => void;
  youtubeUrl?: string;
}

export const WorshipScheduleSection: React.FC<WorshipScheduleSectionProps> = ({
  theme,
  schedules,
  onOpenSEO,
  youtubeUrl = 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg'
}) => {
  return (
    <section id="worship" className="py-20 md:py-28 bg-[#FAFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
              Worship & Gathering
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              예배 및 모임 안내
            </h2>
            <p className="mt-2 text-base text-slate-600">
              하나님을 향한 감사와 찬양이 넘치는 거룩한 예배의 자리에 여러분을 정중히 초대합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500">
              모든 주일 2부 대예배는 유튜브 생중계와 함께합니다
            </span>
          </div>
        </div>

        {/* 2-Column Split: Timetable on Left, Live / Location Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Tabular Numerals Schedule Table (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">예배 시간표</h3>
                <p className="text-xs text-slate-500 mt-1">
                  정규 예배 및 주중 기도회 일정입니다
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {schedules.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 transition-colors hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.isMain ? 'bg-sky-50/40' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {item.name}
                      </span>
                      {item.isMain && (
                        <span className="text-xs font-semibold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded">
                          대표 대예배
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      대상: {item.target}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-semibold font-mono text-slate-800 tracking-tight">
                      {item.time}
                    </div>
                    <div className="flex items-center sm:justify-end gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.place}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>* 주일 예배 및 모임은 미르빌딩 4층 예배실과 소그룹실에서 진행됩니다.</span>
              <span className="text-sky-700 font-medium">따뜻한 친교와 교제</span>
            </div>
          </div>

          {/* Right Column: Live Broadcast Card (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-rose-400">
                    Online Live Stream
                  </span>
                </div>
                <Radio className="w-4 h-4 text-slate-400" />
              </div>

              <h4 className="text-2xl font-bold text-white mb-2 leading-snug">
                이음 온에어 (On-Air)
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                질병, 출장, 거동의 어려움 등으로 예배당에 참석하기 어려운 분들을 위해 
                매주일 오전 11시 유튜브 공식 채널에서 예배 실황을 고화질로 송출합니다.
              </p>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 mb-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>주일 오전 10:45부터 찬양과 함께 사전 스트리밍 시작</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>예배 후 설교 다시보기 및 오디오 묵상 파일 제공</span>
                </div>
              </div>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-98 shadow-sm hover:shadow-md"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Youtube className="w-4 h-4 text-red-500 bg-white rounded-full p-0.5" />
                <span>이음교회 유튜브 채널 바로가기</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
