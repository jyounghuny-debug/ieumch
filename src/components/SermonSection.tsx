import React, { useState, useEffect } from 'react';
import { ChurchTheme, PostItem } from '../types';
import { Play, Pause, BookOpen, Volume2, Share2, Download, Video, Calendar, User, Youtube, ExternalLink, Edit3, Plus, Check } from 'lucide-react';
import { SermonEditModal } from './SermonEditModal';
import { useAuth } from '../context/AuthContext';

interface SermonSectionProps {
  theme: ChurchTheme;
  sermons: PostItem[];
  onOpenSermonPost: (post: PostItem) => void;
  onOpenSEO: () => void;
  onUpdateSermon?: (sermon: PostItem) => void;
  youtubeUrl?: string;
}

export const SermonSection: React.FC<SermonSectionProps> = ({
  theme,
  sermons,
  onOpenSermonPost,
  onOpenSEO,
  onUpdateSermon,
  youtubeUrl = 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg'
}) => {
  const { isEditor } = useAuth();
  const [selectedSermon, setSelectedSermon] = useState<PostItem>(sermons[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(35);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSermonTarget, setEditingSermonTarget] = useState<PostItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync selected sermon if sermons list updates
  useEffect(() => {
    if (selectedSermon) {
      const found = sermons.find((s) => s.id === selectedSermon.id);
      if (found) {
        setSelectedSermon(found);
      }
    } else if (sermons.length > 0) {
      setSelectedSermon(sermons[0]);
    }
  }, [sermons]);

  if (!selectedSermon) return null;

  const currentVideoUrl = selectedSermon.videoUrl || youtubeUrl;

  const handleSaveSermon = (savedSermon: PostItem) => {
    if (onUpdateSermon) {
      onUpdateSermon(savedSermon);
    }
    setSelectedSermon(savedSermon);
    setToastMessage('설교 말씀 및 영상 설명이 성공적으로 저장되었습니다.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <section id="sermon" className="py-20 md:py-28 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
              Sermon Archive
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              은혜의 설교말씀
            </h2>
            <p className="mt-2 text-base text-slate-600">
              생명의 말씀으로 메마른 심령을 채우고, 삶의 현장 속에서 말씀대로 살아가는 힘을 얻습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Direct Explanation & Sermon Edit Tool Buttons (Only visible to authorized editors) */}
            {isEditor && (
              <>
                <button
                  onClick={() => {
                    setEditingSermonTarget(selectedSermon);
                    setIsEditModalOpen(true);
                  }}
                  type="button"
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl flex items-center gap-2 transition-all shadow-xs active:scale-95 hover:opacity-95"
                  style={{ backgroundColor: theme.primaryColor }}
                  title="현재 설교 영상의 제목, 본문, 영상 해설을 직접 수정합니다"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>설교 & 영상 설명 수정</span>
                </button>

                <button
                  onClick={() => {
                    setEditingSermonTarget(null);
                    setIsEditModalOpen(true);
                  }}
                  type="button"
                  className="px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>새 설교 등록</span>
                </button>
              </>
            )}

            <a
              href={currentVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#FF0000] hover:bg-[#E60000] rounded-xl flex items-center gap-2 transition-all shadow-xs active:scale-95"
              title="이음교회 공식 설교동영상 유튜브 채널 바로가기"
            >
              <Youtube className="w-4 h-4" />
              <span>유튜브 설교채널</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                const boardEl = document.getElementById('board');
                if (boardEl) boardEl.scrollIntoView({ behavior: 'smooth' });
              }}
              type="button"
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              설교 목록 전체보기
            </button>
          </div>
        </div>

        {/* Featured Sermon Hero Card */}
        <div className="bg-[#FAFBFD] rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Visual Screen / Video Player Mockup (lg:col-span-7) */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] bg-slate-950 flex flex-col justify-end">
              <img
                src={selectedSermon.imageUrl || theme.worshipImage}
                alt={selectedSermon.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Play Simulation Overlay */}
              <div className="relative z-10 p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-sky-300 mb-2">
                  <Video className="w-3.5 h-3.5" />
                  <span>주일 대예배 설교 실황 영상</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedSermon.videoDuration || '38:15'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                  {selectedSermon.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 mb-6">
                  <span>{selectedSermon.preacher || theme.seniorPastor}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedSermon.scripture || '요한복음 14:27'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedSermon.date}</span>
                </p>

                {/* Simulated Audio/Video Control Bar */}
                <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      type="button"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform active:scale-95 shrink-0"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                        <span>{isPlaying ? '13:20' : '00:00'}</span>
                        <span>{selectedSermon.videoDuration || '38:15'}</span>
                      </div>
                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pos = (e.clientX - rect.left) / rect.width;
                          setPlaybackProgress(Math.floor(pos * 100));
                        }}
                        className="w-full bg-slate-700 h-2 rounded-full cursor-pointer relative overflow-hidden"
                      >
                        <div
                          className="h-full bg-sky-400 rounded-full transition-all"
                          style={{ width: `${isPlaying ? playbackProgress : 35}%` }}
                        />
                      </div>
                    </div>

                    <a
                      href={currentVideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#FF0000] hover:bg-[#E60000] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
                      title="유튜브에서 이음교회 설교 실황 보기"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>YouTube 시청</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={onOpenSEO}
                      type="button"
                      className="text-slate-300 hover:text-white p-2"
                      title="말씀 공유하기"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Scripture Text & Outline (lg:col-span-5) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                    <BookOpen className="w-4 h-4" />
                    <span>오늘의 성경 본문 말씀</span>
                  </div>

                  {/* Direct Edit Button (Only visible to authorized editors) */}
                  {isEditor && (
                    <button
                      onClick={() => {
                        setEditingSermonTarget(selectedSermon);
                        setIsEditModalOpen(true);
                      }}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-lg border border-sky-200 shadow-xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                      <span>영상 및 설교 설명 수정</span>
                    </button>
                  )}
                </div>

                <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-100 text-sm text-slate-700 leading-relaxed mb-6 font-serif-kr">
                  <p className="font-bold text-slate-900 mb-2">
                    {selectedSermon.scripture || '요한복음 14장 27절'}
                  </p>
                  {selectedSermon.scripturePassage ||
                    '"평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라. 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라. 너희는 마음에 근심하지도 말고 두려워하지도 말라."'}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    설교 요약 및 영상 해설
                  </h4>
                  {isEditor && (
                    <span className="text-[11px] text-slate-400">
                      직접 설명 입력됨
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-6 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  {selectedSermon.content}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={currentVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Youtube className="w-4 h-4 text-[#FF0000]" />
                    <span>유튜브 채널에서 주일 전체 설교영상 시청하기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  onClick={() => onOpenSermonPost(selectedSermon)}
                  type="button"
                  className="text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1.5"
                >
                  <span>설교 전문 및 성도 은혜 나눔 보기</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => {
                    alert('설교 요약본 및 성경공부 묵상자료가 다운로드되었습니다.');
                  }}
                  type="button"
                  className="p-2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                  title="설교 노트 PDF 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">교안 다운로드</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Previous Sermons Selector Row */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900">
              최근 설교 시리즈 (클릭하여 선택)
            </h4>
            {isEditor && (
              <button
                onClick={() => {
                  setEditingSermonTarget(null);
                  setIsEditModalOpen(true);
                }}
                type="button"
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>새 설교 등록</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sermons.map((sermon) => {
              const isCurrent = selectedSermon.id === sermon.id;
              return (
                <div
                  key={sermon.id}
                  onClick={() => {
                    setSelectedSermon(sermon);
                    setIsPlaying(false);
                  }}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all text-left relative group ${
                    isCurrent
                      ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-500'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-mono">{sermon.date}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sky-700 font-medium">{sermon.scripture || '주일말씀'}</span>
                      {isEditor && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSermonTarget(sermon);
                            setIsEditModalOpen(true);
                          }}
                          type="button"
                          className="p-1 text-slate-400 hover:text-sky-700 hover:bg-sky-100 rounded transition-colors"
                          title="이 설교의 영상 설명 직접 수정하기"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-sky-700 transition-colors">
                    {sermon.title}
                  </h5>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {sermon.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sermon Edit & Video Explanation Modal */}
      {isEditor && (
        <SermonEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingSermonTarget(null);
          }}
          sermon={editingSermonTarget}
          onSaveSermon={handleSaveSermon}
          theme={theme}
          defaultYoutubeUrl={youtubeUrl}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};
