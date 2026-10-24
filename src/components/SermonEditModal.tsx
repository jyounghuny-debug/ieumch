import React, { useState, useEffect } from 'react';
import { PostItem, ChurchTheme } from '../types';
import { X, Video, BookOpen, User, Calendar, Clock, Youtube, Upload, Image as ImageIcon, Check, Sparkles, FileText, HelpCircle } from 'lucide-react';

interface SermonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sermon?: PostItem | null;
  onSaveSermon: (sermon: PostItem) => void;
  theme: ChurchTheme;
  defaultYoutubeUrl?: string;
}

export const SermonEditModal: React.FC<SermonEditModalProps> = ({
  isOpen,
  onClose,
  sermon,
  onSaveSermon,
  theme,
  defaultYoutubeUrl = 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg'
}) => {
  const [title, setTitle] = useState('');
  const [preacher, setPreacher] = useState('');
  const [date, setDate] = useState('');
  const [videoDuration, setVideoDuration] = useState('38:15');
  const [scripture, setScripture] = useState('');
  const [scripturePassage, setScripturePassage] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Preset images
  const presetImages = [
    { label: '찬양 및 예배 실황', url: theme.worshipImage },
    { label: '교회 본당 전경', url: theme.heroImage },
    { label: '성도 친교 & 다과', url: theme.fellowshipImage },
    { label: '선교지 사역 현장', url: '/assets/aistudio/KakaoTalk_20260525_183850966_03_18abfd03.jpg' }
  ];

  useEffect(() => {
    if (sermon) {
      setTitle(sermon.title || '');
      setPreacher(sermon.preacher || theme.seniorPastor);
      setDate(sermon.date || new Date().toISOString().slice(0, 10).replace(/-/g, '.'));
      setVideoDuration(sermon.videoDuration || '38:15');
      setScripture(sermon.scripture || '요한복음 14:27');
      setScripturePassage(
        sermon.scripturePassage ||
          '"평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라. 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라. 너희는 마음에 근심하지도 말고 두려워하지도 말라."'
      );
      setContent(sermon.content || '');
      setVideoUrl(sermon.videoUrl || defaultYoutubeUrl);
      setImageUrl(sermon.imageUrl || theme.worshipImage);
    } else {
      setTitle('');
      setPreacher(theme.seniorPastor);
      setDate(new Date().toISOString().slice(0, 10).replace(/-/g, '.'));
      setVideoDuration('38:15');
      setScripture('누가복음 14:27');
      setScripturePassage('"누구든지 자기 십자가를 지고 나를 따르지 않는 자도 능히 내 제자가 되지 못하리라"');
      setContent(
        '말씀 포인트:\n1. 십자가의 참된 의미와 제자의 삶\n2. 세상의 안락함을 넘어 부르심에 순종하는 믿음\n3. 날마다 기쁨으로 감당하는 헌신'
      );
      setVideoUrl(defaultYoutubeUrl);
      setImageUrl(theme.worshipImage);
    }
  }, [sermon, isOpen, theme, defaultYoutubeUrl]);

  if (!isOpen) return null;

  // Local image file upload handler via FileReader
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('설교 제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      alert('영상 설명 및 설교 요약 내용을 입력해 주세요.');
      return;
    }

    const sermonId = sermon?.id || 'sermon-' + Date.now();
    const updatedSermon: PostItem = {
      id: sermonId,
      category: 'sermon',
      title: title.trim(),
      preacher: preacher.trim() || theme.seniorPastor,
      author: preacher.trim() || theme.seniorPastor,
      date: date.trim() || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      videoDuration: videoDuration.trim() || '38:15',
      scripture: scripture.trim() || '주일말씀',
      scripturePassage: scripturePassage.trim(),
      content: content.trim(),
      videoUrl: videoUrl.trim() || defaultYoutubeUrl,
      imageUrl: imageUrl.trim() || theme.worshipImage,
      views: sermon?.views || 120,
      likes: sermon?.likes || 15,
      isPinned: true,
      comments: sermon?.comments || []
    };

    onSaveSermon(updatedSermon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Sermon Video & Text Editor</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-800 rounded-md">
                  설교 말씀 설명 수정 도구
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {sermon ? '설교말씀 및 영상 설명 수정' : '새 설교영상 및 설명 등록'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          
          {/* Section 1: Basic Sermon Video Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                설교 제목 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 세상이 줄 수 없는 참된 평안"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>설교자</span>
                </label>
                <input
                  type="text"
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                  placeholder="예: 정영훈 담임목사"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>설교 날짜</span>
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="예: 2026.04.19"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>영상 재생 시간</span>
                </label>
                <input
                  type="text"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  placeholder="예: 38:15"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Scripture Text & Passage */}
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>성경 본문 구절 & 말씀 전문</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                성경 본문 장/절 (표시용)
              </label>
              <input
                type="text"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                placeholder="예: 요한복음 14장 27절 또는 누가복음 14:27"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                성경 구절 본문 말씀 내용
              </label>
              <textarea
                rows={3}
                value={scripturePassage}
                onChange={(e) => setScripturePassage(e.target.value)}
                placeholder="예: 평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-sky-200 bg-white font-serif-kr focus:outline-none focus:border-sky-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: Video Explanation & Sermon Summary (핵심 수정 영역) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>직접 작성하는 영상 설명 및 설교 요약/묵상 <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[11px] text-slate-400">설교 카드의 우측에 즉시 노출됩니다</span>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="설교 영상에 대한 핵심 메시지, 구성, 은혜의 나눔 포인트 및 묵상 질문을 자유롭게 작성해 주세요. (줄바꿈이 그대로 반영됩니다)"
              className="w-full px-3.5 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-sans"
              required
            />
          </div>

          {/* Section 4: YouTube URL for this Video */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Youtube className="w-4 h-4 text-[#FF0000]" />
              <span>유튜브 영상 링크 (설교 영상 시청 연결 주소)</span>
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="예: https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg 또는 유튜브 개별 영상 링크"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono text-slate-700 focus:outline-none focus:border-sky-500"
            />
            <p className="text-[11px] text-slate-500">
              클릭 시 유튜브의 해당 설교 영상이나 공식 설교 채널로 이동하여 고화질 실황을 시청하게 됩니다.
            </p>
          </div>

          {/* Section 5: Thumbnail & Computer File Upload */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>영상 대표 썸네일 / 배경 사진 등록</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs text-rose-600 hover:underline"
                >
                  사진 삭제
                </button>
              )}
            </div>

            {/* Thumbnail Preview */}
            {imageUrl && (
              <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <img
                  src={imageUrl}
                  alt="설교 대표 썸네일 미리보기"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
                  설교 화면 배경 미리보기
                </div>
              </div>
            )}

            {/* Direct Upload Button from Computer */}
            <label className="w-full py-2.5 px-4 bg-white hover:bg-sky-50 text-sky-700 text-xs font-semibold rounded-xl border border-sky-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors">
              <Upload className="w-4 h-4 text-sky-600" />
              <span>내 컴퓨터에서 사진 파일 직접 올리기</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />
            </label>

            {/* Presets and URL input */}
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                추천 사진 빠른 선택:
              </span>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {presetImages.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      imageUrl === img.url
                        ? 'border-sky-500 bg-sky-50 text-sky-800 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="또는 이미지 주소(URL) 직접 입력"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all active:scale-98"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Check className="w-4 h-4" />
              <span>설교 및 영상 설명 저장하기</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
