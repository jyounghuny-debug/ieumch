import React, { useState } from 'react';
import { MissionField, missionFields } from '../data/missionData';
import { ChurchTheme } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Heart, Globe, Calendar, MapPin, Send, CheckCircle2, ChevronRight, ShieldCheck, Share2, Upload, RotateCcw } from 'lucide-react';

interface MissionPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ChurchTheme;
  initialFieldId?: string;
}

export const MissionPrayerModal: React.FC<MissionPrayerModalProps> = ({
  isOpen,
  onClose,
  theme,
  initialFieldId = 'cambodia'
}) => {
  const { isEditor } = useAuth();
  const [selectedId, setSelectedId] = useState<string>(initialFieldId);
  const [prayerCounts, setPrayerCounts] = useState<{ [id: string]: number }>({
    cambodia: 142,
    philippines: 128,
    domestic: 165
  });
  const [prayedFields, setPrayedFields] = useState<{ [id: string]: boolean }>({});
  const [commentText, setCommentText] = useState('');
  const [fieldImages, setFieldImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('ieum_mission_field_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleMissionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFieldImages((prev) => {
          const updated = { ...prev, [selectedId]: dataUrl };
          try {
            localStorage.setItem('ieum_mission_field_images', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetMissionImage = () => {
    setFieldImages((prev) => {
      const next = { ...prev };
      delete next[selectedId];
      try {
        localStorage.setItem('ieum_mission_field_images', JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const [comments, setComments] = useState<{ [id: string]: Array<{ author: string; text: string; time: string }> }>({
    cambodia: [
      { author: '정영훈 목사', text: '김동선, 이금주 선교사님 가정을 위해 이음교회가 날마다 무릎으로 동역합니다.', time: '방금 전' },
      { author: '박은혜 장로', text: '어린이들이 주님의 사랑 안에서 무럭무럭 자라나길 축복합니다.', time: '1시간 전' }
    ],
    philippines: [
      { author: '정태양 순장', text: '톤도 빈민가 청소년들이 마닐라를 변화시킬 영적 거인이 될 줄 믿습니다!', time: '2시간 전' }
    ],
    domestic: [
      { author: '최믿음 권사', text: '태훈이가 속히 주님의 권능으로 튼튼히 일어서기를 간절히 기도합니다.', time: '어제' }
    ]
  });
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentField = missionFields.find((f) => f.id === selectedId) || missionFields[0];

  const handlePrayerPledge = (fieldId: string) => {
    if (prayedFields[fieldId]) return;
    setPrayerCounts((prev) => ({
      ...prev,
      [fieldId]: (prev[fieldId] || 0) + 1
    }));
    setPrayedFields((prev) => ({
      ...prev,
      [fieldId]: true
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      author: '이음 성도',
      text: commentText.trim(),
      time: '방금 전'
    };
    setComments((prev) => ({
      ...prev,
      [currentField.id]: [newComment, ...(prev[currentField.id] || [])]
    }));
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#mission`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Mission News & Prayer</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                선교지 긴급기도 & 사역지 소식
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              type="button"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
              title="선교지 소식 링크 복사"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Mission Field Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 gap-2 overflow-x-auto scrollbar-none py-2.5">
          {missionFields.map((field) => {
            const isActive = field.id === currentField.id;
            return (
              <button
                key={field.id}
                onClick={() => setSelectedId(field.id)}
                type="button"
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{field.flag}</span>
                <span>{field.missionaries}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {field.country}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Urgent Alert Banner inside Modal */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <span className="text-base font-bold">!</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase">
                <span>긴급 중보기도 요청</span>
                <span className="text-[10px] font-normal text-rose-600 bg-white/80 px-2 py-0.5 rounded-md border border-rose-200">
                  {currentField.latestNewsDate}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                "{currentField.currentUrgentTopic}"
              </p>
            </div>
          </div>

          {/* Mission Field Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-sky-700">{currentField.country}</span>
                <span>·</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentField.location}</span>
                <span>·</span>
                <span>{currentField.startedYear}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentField.fieldTitle}
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-0.5">
                동역 선교사: <span className="text-slate-900 font-bold">{currentField.missionaries}</span>
              </p>
            </div>

            {/* Prayer Pledge Button */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => handlePrayerPledge(currentField.id)}
                type="button"
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs ${
                  prayedFields[currentField.id]
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
                }`}
              >
                <Heart className={`w-4 h-4 ${prayedFields[currentField.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{prayedFields[currentField.id] ? '기도로 동참 완료' : '기도로 동참하기'}</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/10 text-xs font-mono">
                  {prayerCounts[currentField.id]}명
                </span>
              </button>
            </div>
          </div>

          {/* Mission Field Photograph with upload from local computer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">사역지 현장 사진</span>
              {isEditor ? (
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-sky-700 text-xs font-semibold rounded-lg border border-sky-200 shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-600" />
                    <span>내 컴퓨터에서 사진 올리기</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMissionImageUpload}
                      className="hidden"
                    />
                  </label>
                  {fieldImages[currentField.id] && (
                    <button
                      type="button"
                      onClick={handleResetMissionImage}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      title="기본 사진으로 복원"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>기본 복원</span>
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-[11px] text-slate-500">생생한 선교 현장의 은혜</span>
              )}
            </div>

            {(fieldImages[currentField.id] || currentField.image) && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs max-h-72 bg-slate-100">
                <img
                  src={fieldImages[currentField.id] || currentField.image}
                  alt={`${currentField.country} - ${currentField.missionaries} 사역 현장`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-3 sm:p-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-white/25 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/30">
                      {currentField.flag} {currentField.country} 사역지 현장
                    </span>
                    <span className="text-xs text-white/90">
                      {currentField.missionaries}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white/95 mt-1 line-clamp-1">
                    {currentField.fieldTitle}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Latest News & Field Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600" />
              <span>최신 사역 소식 및 현장 리포트</span>
            </h4>
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-sm text-slate-700 space-y-3 leading-relaxed">
              <div className="font-semibold text-slate-900 text-base">
                {currentField.latestNewsTitle}
              </div>
              <p className="text-slate-600 italic">
                "{currentField.summary}"
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                {currentField.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Urgent Prayer Requests List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>사역지를 위한 3대 중보기도 제목</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {currentField.prayerRequests.map((prayer, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3 hover:border-sky-300 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-snug">
                    {prayer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement / Prayer comments */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              성도 중보기도 한 줄 응원
            </h4>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="선교사님과 사역지를 향한 응원과 축복의 기도를 남겨주세요."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white rounded-xl flex items-center gap-1 shrink-0"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>등록</span>
              </button>
            </form>

            <div className="space-y-2 pt-1 max-h-40 overflow-y-auto">
              {(comments[currentField.id] || []).map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 text-xs flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 mr-2">{c.author}</span>
                    <span className="text-slate-600">{c.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{c.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span>이음교회는 매주 수요일/주일 공동체예배 때 선교지를 위해 합심 기도합니다.</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 shadow-xs"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
