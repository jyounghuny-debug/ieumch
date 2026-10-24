import React, { useState } from 'react';
import { ChurchTheme } from '../types';
import { HeartHandshake, CheckCircle2, Send, Sparkles, X, Gift, Coffee, Users, BookOpen } from 'lucide-react';

interface NewFamilySectionProps {
  theme: ChurchTheme;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export const NewFamilySection: React.FC<NewFamilySectionProps> = ({
  theme,
  isModalOpen,
  onCloseModal,
  onOpenModal
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ageGroup, setAgeGroup] = useState('30s');
  const [interestedGroup, setInterestedGroup] = useState('청장년 목장모임');
  const [prayerTopic, setPrayerTopic] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    {
      num: '01',
      title: '환영 및 등록',
      desc: '주일 4층 예배실 안내데스크를 찾아주시면 정성껏 준비한 웰컴 선물과 주보를 전해드립니다.',
      icon: Gift
    },
    {
      num: '02',
      title: '목회자와의 만남',
      desc: '예배 후 소그룹실에서 담임목사님과 따뜻한 차 한 잔을 나누며 축복 기도를 받습니다.',
      icon: Coffee
    },
    {
      num: '03',
      title: '새가족 4주 양육',
      desc: '기독교 기본 진리와 이음교회의 비전을 배우며 신앙의 기초를 든든히 다집니다.',
      icon: BookOpen
    },
    {
      num: '04',
      title: '목장모임(소그룹) 연결',
      desc: '또래 및 연령별 목장 소그룹에 배속되어 평생을 함께할 신앙의 동역자들을 만납니다.',
      icon: Users
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setPrayerTopic('');
      setSubmitted(false);
      onCloseModal();
      alert('새가족 등록 신청이 정상 접수되었습니다! 담당 사역자가 정성껏 연락드리겠습니다.');
    }, 1200);
  };

  return (
    <section id="new-family" className="py-20 md:py-28 bg-[#FAFBFD] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
            Welcome to Our Family
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            처음 오신 분을 위한 <br className="hidden sm:inline" />
            <span style={{ color: theme.primaryColor }}>이음교회 4단계 정착 안내</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            처음 교회를 방문하신 분들도 낯설지 않고 편안하게 스며들 수 있도록 
            단계별로 세심하게 돕는 따뜻한 안내 시스템을 운영하고 있습니다.
          </p>
        </div>

        {/* 4 Steps Grid (Editorial numbered, anti-slop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-sky-600">
                      STEP {s.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sky-700 bg-sky-50">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {s.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              방문 전 미리 새가족 온라인 등록을 원하시나요?
            </h3>
            <p className="text-sm text-slate-600">
              간단한 정보를 남겨주시면 주일 방문 시 미리 안내와 예배 좌석을 편안하게 준비해 드립니다.
            </p>
          </div>
          <button
            onClick={onOpenModal}
            type="button"
            className="px-6 py-3.5 text-sm font-semibold text-white rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 hover:opacity-95 active:scale-98"
            style={{ backgroundColor: theme.primaryColor }}
          >
            온라인 새가족 등록 신청하기
          </button>
        </div>

      </div>

      {/* New Family Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-lg font-bold text-slate-900">새가족 온라인 등록 신청</h3>
                <p className="text-xs text-slate-500 mt-0.5">이음교회의 따뜻한 가족이 되신 것을 환영합니다</p>
              </div>
              <button
                onClick={onCloseModal}
                type="button"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  성함 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  연락처 (휴대전화) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">연령대</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="20s">청년부 (20대)</option>
                    <option value="30s">청장년 (30대)</option>
                    <option value="40s">장년 (40대~50대)</option>
                    <option value="60s">시니어 (60대 이상)</option>
                    <option value="youth">교회학교 학생</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">관심 소그룹</label>
                  <select
                    value={interestedGroup}
                    onChange={(e) => setInterestedGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="청장년 목장모임">청장년 목장모임</option>
                    <option value="청년 이음 워십">청년부 공동체</option>
                    <option value="영유아 자모모임">영유아 자모 모임</option>
                    <option value="성가대/찬양팀">찬양 사역팀</option>
                    <option value="일반 예배 참석">일반 예배 참석</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  함께 나누고 싶은 기도 제목 (선택)
                </label>
                <textarea
                  rows={3}
                  placeholder="삶의 고민, 가족 구원, 건강, 진로 등 목회자가 함께 기도할 내용을 자유롭게 적어주세요."
                  value={prayerTopic}
                  onChange={(e) => setPrayerTopic(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className="px-6 py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitted ? '접수 중...' : '등록 신청서 제출'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
};
