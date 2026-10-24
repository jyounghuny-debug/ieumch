import React, { useState } from 'react';
import { ChurchTheme, CommunityStory } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ZoomIn, 
  Heart, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Tag, 
  Sparkles, 
  Check, 
  Share2,
  FileText
} from 'lucide-react';
import { heroImg, pastorStudyImg, fellowshipImg, worshipImg } from '../data/initialData';

interface GallerySectionProps {
  theme: ChurchTheme;
  stories: CommunityStory[];
  onUpdateStories: (stories: CommunityStory[]) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ 
  theme, 
  stories, 
  onUpdateStories 
}) => {
  const { isEditor } = useAuth();
  // Modal states
  const [selectedStory, setSelectedStory] = useState<CommunityStory | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<CommunityStory | null>(null);
  
  // Editor form state
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    date: string;
    author: string;
    imageUrl: string;
  }>({
    title: '',
    category: '성도의 교제',
    description: '',
    date: '매주 주일',
    author: '이음교회',
    imageUrl: '/assets/aistudio/_____e9823737.jpg'
  });

  const [customCategory, setCustomCategory] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categoryPresets = [
    '성도의 교제',
    '찬양 & 예배',
    '목장모임',
    '선교지 소식 & 나눔',
    '다음세대 교회학교',
    '전도 & 지역섬김',
    '직접 입력'
  ];

  const imagePresets = [
    { label: '친교모임 (성도의 교제)', url: '/assets/aistudio/_____e9823737.jpg' },
    { label: '목장모임', url: '/assets/aistudio/_____ce1030c5.jpg' },
    { label: '캄보디아 선교지 현장', url: '/assets/aistudio/KakaoTalk_20260525_183850966_03_18abfd03.jpg' },
    { label: '찬양 & 워십 예배', url: worshipImg },
    { label: '담임목사 서재 & 목양', url: pastorStudyImg },
    { label: '교회 전경 & 본당', url: heroImg }
  ];

  // Open Editor for Creating
  const handleOpenCreate = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      category: '성도의 교제',
      description: '',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      author: '이음공동체',
      imageUrl: '/assets/aistudio/_____e9823737.jpg'
    });
    setCustomCategory('');
    setIsEditorOpen(true);
  };

  // Open Editor for Modifying existing story
  const handleOpenEdit = (story: CommunityStory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingStory(story);
    const isPreset = categoryPresets.includes(story.category);
    setFormData({
      title: story.title,
      category: isPreset ? story.category : '직접 입력',
      description: story.description,
      date: story.date,
      author: story.author || '이음공동체',
      imageUrl: story.imageUrl
    });
    setCustomCategory(isPreset ? '' : story.category);
    setIsEditorOpen(true);
  };

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
        setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save story (add or edit)
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('이야기 제목을 입력해 주세요.');
      return;
    }

    const finalCategory = formData.category === '직접 입력' 
      ? (customCategory.trim() || '공동체 나눔')
      : formData.category;

    if (editingStory) {
      // Update
      const updated = stories.map((s) =>
        s.id === editingStory.id
          ? {
              ...s,
              title: formData.title.trim(),
              category: finalCategory,
              description: formData.description.trim(),
              date: formData.date.trim(),
              author: formData.author.trim(),
              imageUrl: formData.imageUrl
            }
          : s
      );
      onUpdateStories(updated);
      setToastMessage('이야기가 수정되었습니다.');
      if (selectedStory?.id === editingStory.id) {
        setSelectedStory({
          ...selectedStory,
          title: formData.title.trim(),
          category: finalCategory,
          description: formData.description.trim(),
          date: formData.date.trim(),
          author: formData.author.trim(),
          imageUrl: formData.imageUrl
        });
      }
    } else {
      // Create new
      const newStory: CommunityStory = {
        id: 'story-' + Date.now(),
        title: formData.title.trim(),
        category: finalCategory,
        description: formData.description.trim(),
        date: formData.date.trim(),
        author: formData.author.trim(),
        imageUrl: formData.imageUrl,
        likes: 0
      };
      onUpdateStories([newStory, ...stories]);
      setToastMessage('새로운 이야기가 등록되었습니다.');
    }

    setIsEditorOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete story
  const handleDeleteStory = (storyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('이 이야기를 삭제하시겠습니까?')) {
      const updated = stories.filter((s) => s.id !== storyId);
      onUpdateStories(updated);
      if (selectedStory?.id === storyId) setSelectedStory(null);
      if (editingStory?.id === storyId) setIsEditorOpen(false);
      setToastMessage('이야기가 삭제되었습니다.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Like story
  const handleLikeStory = (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = stories.map((s) =>
      s.id === storyId ? { ...s, likes: (s.likes || 0) + 1 } : s
    );
    onUpdateStories(updated);
    if (selectedStory?.id === storyId) {
      setSelectedStory((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));
    }
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Direct Story Management Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Community & Moments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              이음 공동체 이야기
            </h2>
            <p className="mt-2 text-base text-slate-600">
              함께 웃고 울며, 주님의 사랑 안에서 하나 되어 가는 성도들의 생생한 일상과 나눔입니다.
            </p>
          </div>

          {isEditor && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenCreate}
                type="button"
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-2 hover:opacity-95 active:scale-98"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>새 이야기 등록</span>
              </button>
            </div>
          )}
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">등록된 공동체 이야기가 없습니다</h3>
            <p className="text-xs text-slate-500 mt-1">이음교회의 소중한 순간들을 사진과 함께 등록해 보세요.</p>
            {isEditor && (
              <button
                onClick={handleOpenCreate}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white rounded-xl"
                style={{ backgroundColor: theme.primaryColor }}
              >
                새 이야기 등록하기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedStory(item)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/90 bg-white relative shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Photo container */}
                <div className="h-56 sm:h-60 overflow-hidden relative bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-sky-800 shadow-xs border border-white/60">
                    {item.category}
                  </div>

                  {/* Quick Edit & Delete Hover Actions */}
                  {isEditor && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(item, e)}
                        className="p-1.5 rounded-lg bg-white/95 backdrop-blur-md text-slate-700 hover:text-sky-700 hover:bg-white shadow-md transition-colors"
                        title="이야기 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteStory(item.id, e)}
                        className="p-1.5 rounded-lg bg-white/95 backdrop-blur-md text-rose-600 hover:text-rose-700 hover:bg-white shadow-md transition-colors"
                        title="이야기 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Zoom hint on hover */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content Card Body */}
                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span>{item.date}</span>
                      {item.author && <span>{item.author}</span>}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Card footer: Edit button & Likes */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {isEditor ? (
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(item, e)}
                        className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>수정</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">이음교회 이야기</span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleLikeStory(item.id, e)}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${(item.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{item.likes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Story Detail Lightbox Modal */}
      {selectedStory && (
        <div
          onClick={() => setSelectedStory(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]"
          >
            {/* Image viewer */}
            <div className="relative max-h-[60vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedStory.imageUrl}
                alt={selectedStory.title}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] w-auto object-contain"
              />
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Details & Actions */}
            <div className="p-6 overflow-y-auto bg-white flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {selectedStory.category}
                    </span>
                    <span>·</span>
                    <span>{selectedStory.date}</span>
                    {selectedStory.author && (
                      <>
                        <span>·</span>
                        <span>{selectedStory.author}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {selectedStory.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditor && (
                    <button
                      onClick={(e) => {
                        setSelectedStory(null);
                        handleOpenEdit(selectedStory, e);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>이야기 수정</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => handleLikeStory(selectedStory.id, e)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>좋아요 {selectedStory.likes || 0}</span>
                  </button>
                </div>
              </div>

              {selectedStory.description && (
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedStory.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Story Edit / Create Modal */}
      {isEditorOpen && (
        <div
          onClick={() => setIsEditorOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingStory ? '이음 공동체 이야기 수정' : '새 공동체 이야기 등록'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    그때 그때 새로운 사진과 은혜의 이야기를 자유롭게 기록하고 수정하세요
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveStory} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  이야기 제목 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 주일 예배 후 따뜻한 차 한 잔과 교제"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* Category & Date in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    분류 / 카테고리
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 bg-white"
                  >
                    {categoryPresets.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {formData.category === '직접 입력' && (
                    <input
                      type="text"
                      placeholder="카테고리 직접 입력 (예: 청년부 수련회)"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    일시 / 날짜
                  </label>
                  <input
                    type="text"
                    placeholder="예: 2026.04.19 또는 매주 주일"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Author / Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  작성자 / 부서
                </label>
                <input
                  type="text"
                  placeholder="예: 친교사역팀, 선교위원회, 목양팀 등"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  상세 이야기 / 나눔 글
                </label>
                <textarea
                  rows={4}
                  placeholder="함께 나누고 싶은 은혜의 순간이나 설명 글을 적어주세요."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              {/* Image Selection Area */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  사진 등록 및 선택
                </label>

                {/* Preview Thumbnail */}
                {formData.imageUrl && (
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 mb-3 shadow-inner">
                    <img
                      src={formData.imageUrl}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
                      현재 등록된 사진 미리보기
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200">
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>내 컴퓨터에서 사진 파일 직접 올리기</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image URL text input */}
                <div>
                  <input
                    type="text"
                    placeholder="또는 이미지 웹 URL / 로컬 경로 직접 입력"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                {/* One-click Presets */}
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                    원클릭 추천 사진 선택:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          formData.imageUrl === preset.url
                            ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-[11px] font-semibold text-slate-800 truncate">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {editingStory ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteStory(editingStory.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>이야기 삭제</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {editingStory ? '수정 완료' : '이야기 등록하기'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
