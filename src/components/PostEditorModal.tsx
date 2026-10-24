import React, { useState, useEffect } from 'react';
import { PostItem, PostCategory, EventCategory, ChurchTheme } from '../types';
import { X, Image as ImageIcon, Pin, BookOpen, Sparkles, Check, AlignLeft, Bold, List, Calendar, Upload } from 'lucide-react';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (
    post: Omit<PostItem, 'id' | 'views' | 'likes' | 'comments'>,
    editingId?: string,
    syncToCalendar?: boolean,
    calendarData?: {
      date: string;
      time: string;
      place: string;
      category: EventCategory;
      target: string;
    }
  ) => void;
  editingPost?: PostItem | null;
  theme: ChurchTheme;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  isOpen,
  onClose,
  onSavePost,
  editingPost,
  theme
}) => {
  const [category, setCategory] = useState<PostCategory>('notice');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('이음교회 사무국');
  const [isPinned, setIsPinned] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [scripture, setScripture] = useState('');
  const [preacher, setPreacher] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Calendar auto-sync fields
  const [syncToCalendar, setSyncToCalendar] = useState(true);
  const [eventDate, setEventDate] = useState('2026-10-25');
  const [eventTime, setEventTime] = useState('오전 11:00');
  const [eventPlace, setEventPlace] = useState('본당 (3층 대예배실)');
  const [eventCategory, setEventCategory] = useState<EventCategory>('worship');
  const [eventTarget, setEventTarget] = useState('전 교인');

  // Handle local image file upload (FileReader converts to base64 DataURL)
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

  // Preset images for church posts
  const presetImages = [
    { label: '교회 본당 전경', url: theme.heroImage },
    { label: '찬양 및 예배 실황', url: theme.worshipImage },
    { label: '성도 친교 및 다과', url: theme.fellowshipImage },
    { label: '담임목사 서재', url: theme.pastorImage },
    { label: '선교지 사역 현장', url: '/assets/aistudio/KakaoTalk_20260525_183850966_03_18abfd03.jpg' }
  ];

  useEffect(() => {
    if (editingPost) {
      setCategory(editingPost.category);
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setAuthor(editingPost.author);
      setIsPinned(!!editingPost.isPinned);
      setImageUrl(editingPost.imageUrl || '');
      setScripture(editingPost.scripture || '');
      setPreacher(editingPost.preacher || '');
      if (editingPost.eventDate) {
        setSyncToCalendar(true);
        setEventDate(editingPost.eventDate);
        setEventTime(editingPost.eventTime || '오전 11:00');
        setEventPlace(editingPost.eventPlace || '본당 (3층 대예배실)');
        setEventCategory(editingPost.eventCategory || 'worship');
      } else {
        setSyncToCalendar(false);
      }
    } else {
      setCategory('notice');
      setTitle('');
      setContent('');
      setAuthor('이음교회 사역팀');
      setIsPinned(false);
      setImageUrl('');
      setScripture('');
      setPreacher('');
      setSyncToCalendar(true);
      setEventDate('2026-10-25');
      setEventTime('오전 11:00');
      setEventPlace('본당 (3층 대예배실)');
      setEventCategory('worship');
      setEventTarget('전 교인');
    }
  }, [editingPost, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    onSavePost(
      {
        category,
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || '이음교회',
        date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
        isPinned,
        imageUrl: imageUrl.trim() || undefined,
        scripture: category === 'sermon' ? scripture.trim() : undefined,
        preacher: category === 'sermon' ? preacher.trim() || theme.seniorPastor : undefined,
        eventDate: syncToCalendar ? eventDate : undefined,
        eventTime: syncToCalendar ? eventTime : undefined,
        eventPlace: syncToCalendar ? eventPlace : undefined,
        eventCategory: syncToCalendar ? eventCategory : undefined
      },
      editingPost ? editingPost.id : undefined,
      syncToCalendar,
      syncToCalendar
        ? {
            date: eventDate,
            time: eventTime,
            place: eventPlace,
            category: eventCategory,
            target: eventTarget
          }
        : undefined
    );

    onClose();
  };

  const insertFormatting = (syntax: string) => {
    setContent((prev) => prev + syntax);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingPost ? '게시글 수정하기' : '새로운 게시글 작성'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              교회소식, 이음주보, 설교말씀, 은혜나눔 및 기도제목을 등록합니다
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              게시판 분류
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { key: 'notice', label: '교회소식' },
                { key: 'bulletin', label: '이음주보' },
                { key: 'sermon', label: '설교말씀' },
                { key: 'grace', label: '은혜나눔' },
                { key: 'prayer', label: '중보기도' },
                { key: 'mission', label: '선교지소식' }
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key as PostCategory)}
                  className={`py-2 text-xs font-medium rounded-lg transition-all ${
                    category === c.key
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              게시글 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2026년 봄 성경통독학교 개강 안내 또는 말씀 제목"
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Sermon-specific fields */}
          {category === 'sermon' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
              <div>
                <label className="block text-xs font-semibold text-sky-900 mb-1">
                  성경 본문 구절
                </label>
                <input
                  type="text"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                  placeholder="예: 요한복음 14:27"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-sky-200 bg-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-sky-900 mb-1">
                  설교자
                </label>
                <input
                  type="text"
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                  placeholder="예: 정영훈 담임목사"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-sky-200 bg-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* Author & Pin option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                작성자 / 부서명
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="예: 이음교회 사무국 / 정영훈 목사"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
                <Pin className="w-3.5 h-3.5 text-sky-600" />
                <span>게시판 상단 고정 공지로 등록</span>
              </label>
            </div>
          </div>

          {/* Representative Image (Local file upload, preset selector, or URL) */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                게시글 대표 사진 등록 (선교지·소식·주보 공통)
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs px-2 py-0.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  사진 초기화
                </button>
              )}
            </div>

            {/* Preview Thumbnail if selected */}
            {imageUrl && (
              <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <img
                  src={imageUrl}
                  alt="등록된 대표 사진 미리보기"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
                  현재 등록된 대표 사진
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

            {/* Presets & URL input */}
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                또는 추천 사진 / 주소 입력:
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
                placeholder="또는 직접 이미지 URL 주소 입력 (비워둘 시 텍스트 카드)"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Calendar Auto-Sync Integration Card */}
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-sky-950 select-none">
                <input
                  type="checkbox"
                  checked={syncToCalendar}
                  onChange={(e) => setSyncToCalendar(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>교회 캘린더에 일정으로 함께 등록하기</span>
              </label>
              <span className="text-[11px] text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded font-medium">
                캘린더 자동 연동
              </span>
            </div>

            {syncToCalendar && (
              <div className="pt-2 border-t border-sky-100/80 space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      행사 / 모임 날짜
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      시간 안내
                    </label>
                    <input
                      type="text"
                      placeholder="예: 오전 11:00 / 저녁 07:30"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      일정 카테고리
                    </label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                    >
                      <option value="worship">예배·기도회</option>
                      <option value="education">교육·양육</option>
                      <option value="fellowship">친교·봉사</option>
                      <option value="ministry">사역·선교</option>
                      <option value="special">특별행사</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      모임 장소
                    </label>
                    <input
                      type="text"
                      placeholder="예: 본당 3층 대예배실 / 2층 비전홀"
                      value={eventPlace}
                      onChange={(e) => setEventPlace(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content & Quick Format Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                본문 내용 <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => insertFormatting('\n[안내 사항]\n· ')}
                  className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md"
                >
                  + 항목 추가
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n"성경 구절 또는 인용구"') }
                  className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md"
                >
                  + 인용구
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-2 py-1 text-xs text-sky-700 hover:bg-sky-50 rounded-md font-medium"
                >
                  {previewMode ? '편집 모드' : '미리보기'}
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 min-h-[180px] text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                {content || '본문 내용이 없습니다.'}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="게시글 본문, 예배 순서, 말씀 요약 또는 소식을 자유롭게 작성하세요."
                required
                className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 leading-relaxed font-sans"
              />
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-sm transition-all hover:opacity-95 active:scale-98"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {editingPost ? '수정 내용 저장' : '새 글 발행하기'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
