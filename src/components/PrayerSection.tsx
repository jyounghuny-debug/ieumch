import React, { useState, useMemo } from 'react';
import { ChurchTheme, PrayerRequest, PrayerCategory, PrayerEncouragement } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle2, 
  MessageCircle, 
  Send, 
  Lock, 
  User, 
  Trash2, 
  Check, 
  X,
  Share2,
  Calendar,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

interface PrayerSectionProps {
  theme: ChurchTheme;
  prayers: PrayerRequest[];
  onAddPrayer: (newPrayer: Omit<PrayerRequest, 'id' | 'prayerCount' | 'createdAt' | 'encouragements'>) => Promise<void> | void;
  onPray: (prayerId: string) => Promise<void> | void;
  onAddEncouragement: (prayerId: string, message: string, author: string, isAnonymous: boolean) => Promise<void> | void;
  onMarkAnswered: (prayerId: string, testimony?: string) => Promise<void> | void;
  onDeletePrayer: (prayerId: string) => Promise<void> | void;
}

export const PrayerSection: React.FC<PrayerSectionProps> = ({
  theme,
  prayers,
  onAddPrayer,
  onPray,
  onAddEncouragement,
  onMarkAnswered,
  onDeletePrayer
}) => {
  const { isEditor, currentManager } = useAuth();

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'prayed' | 'answered'>('latest');

  // Modals
  const [isNewPrayerModalOpen, setIsNewPrayerModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [targetPrayerForAnswer, setTargetPrayerForAnswer] = useState<PrayerRequest | null>(null);

  // New Prayer Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newCategory, setNewCategory] = useState<PrayerCategory>('general');
  const [newPassword, setNewPassword] = useState('');

  // Answered Testimony Form
  const [answerTestimony, setAnswerTestimony] = useState('');

  // Active encouragement expansion toggles
  const [expandedEncouragements, setExpandedEncouragements] = useState<Record<string, boolean>>({});
  const [encouragementInput, setEncouragementInput] = useState<Record<string, string>>({});
  const [encouragementAuthor, setEncouragementAuthor] = useState<Record<string, string>>({});
  const [encouragementAnonymous, setEncouragementAnonymous] = useState<Record<string, boolean>>({});

  // Local record of prayers prayed in this browser session
  const [myPrayedMap, setMyPrayedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ieum_my_prayed_prayers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Animated feedback state for button click
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  // Live Statistics Calculation
  const totalRequests = prayers.length;
  const totalPrayersCount = useMemo(() => {
    return prayers.reduce((acc, p) => acc + (p.prayerCount || 0), 0);
  }, [prayers]);
  const answeredCount = useMemo(() => {
    return prayers.filter((p) => p.isAnswered || p.category === 'answered').length;
  }, [prayers]);

  // Categories List
  const categoryFilters: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: '전체 기도', icon: '🙏' },
    { id: 'healing', label: '환우 & 치유', icon: '🌿' },
    { id: 'family', label: '가정 & 자녀', icon: '🏡' },
    { id: 'career', label: '진로 & 일터', icon: '💼' },
    { id: 'mission', label: '선교 & 전도', icon: '🌏' },
    { id: 'church', label: '교회 & 사역', icon: '⛪' },
    { id: 'answered', label: '응답 감사 ✨', icon: '🎉' }
  ];

  // Filtered & Sorted Prayers
  const filteredPrayers = useMemo(() => {
    return prayers.filter((prayer) => {
      // Category match
      if (selectedCategory === 'answered') {
        if (!prayer.isAnswered && prayer.category !== 'answered') return false;
      } else if (selectedCategory !== 'all') {
        if (prayer.category !== selectedCategory) return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const titleMatch = prayer.title.toLowerCase().includes(query);
        const contentMatch = prayer.content.toLowerCase().includes(query);
        const authorMatch = prayer.author.toLowerCase().includes(query);
        if (!titleMatch && !contentMatch && !authorMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'prayed') {
        return (b.prayerCount || 0) - (a.prayerCount || 0);
      }
      if (sortBy === 'answered') {
        return (b.isAnswered ? 1 : 0) - (a.isAnswered ? 1 : 0);
      }
      // default: latest
      return new Date(b.createdAt.replace(/\./g, '-')).getTime() - new Date(a.createdAt.replace(/\./g, '-')).getTime();
    });
  }, [prayers, selectedCategory, searchQuery, sortBy]);

  // Handle click on "함께 기도합니다"
  const handlePrayClick = (prayer: PrayerRequest) => {
    onPray(prayer.id);

    // Save to local prayed tracking
    const updated = { ...myPrayedMap, [prayer.id]: true };
    setMyPrayedMap(updated);
    try {
      localStorage.setItem('ieum_my_prayed_prayers', JSON.stringify(updated));
    } catch {}

    // Trigger visual animation & toast
    setAnimatingId(prayer.id);
    setToastFeedback(`'${prayer.author}' 성도님의 기도제목을 위해 함께 기도하셨습니다.`);
    setTimeout(() => setAnimatingId(null), 1200);
    setTimeout(() => setToastFeedback(null), 3000);
  };

  // Submit new prayer request
  const handleSubmitNewPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('기도제목을 입력해 주세요.');
      return;
    }
    if (!newContent.trim()) {
      alert('세부 기도 내용을 입력해 주세요.');
      return;
    }

    const authorDisplayName = isAnonymous 
      ? '익명의 성도' 
      : (newAuthor.trim() || currentManager?.name || '성도');

    await onAddPrayer({
      title: newTitle.trim(),
      content: newContent.trim(),
      author: authorDisplayName,
      isAnonymous,
      category: newCategory,
      password: newPassword.trim() || undefined
    });

    // Reset and close
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
    setIsAnonymous(false);
    setNewCategory('general');
    setNewPassword('');
    setIsNewPrayerModalOpen(false);

    setToastFeedback('중보기도 제목이 등록되었습니다. 온 성도가 함께 기도합니다.');
    setTimeout(() => setToastFeedback(null), 3500);
  };

  // Submit answered testimony
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrayerForAnswer) return;

    await onMarkAnswered(targetPrayerForAnswer.id, answerTestimony.trim());
    setIsAnswerModalOpen(false);
    setTargetPrayerForAnswer(null);
    setAnswerTestimony('');

    setToastFeedback('할렐루야! 기도 응답 감사 간증이 함께 나누어졌습니다.');
    setTimeout(() => setToastFeedback(null), 3500);
  };

  // Submit encouragement comment
  const handleSendEncouragement = async (prayerId: string) => {
    const message = (encouragementInput[prayerId] || '').trim();
    if (!message) return;

    const isAnon = encouragementAnonymous[prayerId] || false;
    const author = isAnon 
      ? '익명의 동역자' 
      : (encouragementAuthor[prayerId] || currentManager?.name || '성도');

    await onAddEncouragement(prayerId, message, author, isAnon);

    // Reset input for this card
    setEncouragementInput((prev) => ({ ...prev, [prayerId]: '' }));
  };

  const getCategoryBadge = (cat: PrayerCategory, isAnswered?: boolean) => {
    if (isAnswered || cat === 'answered') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>기도 응답 감사 ✨</span>
        </span>
      );
    }
    switch (cat) {
      case 'healing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            🌿 환우 & 치유
          </span>
        );
      case 'family':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            🏡 가정 & 자녀
          </span>
        );
      case 'career':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            💼 진로 & 일터
          </span>
        );
      case 'mission':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            🌏 선교 & 전도
          </span>
        );
      case 'church':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            ⛪ 교회 & 사역
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            🙏 성도의 기도
          </span>
        );
    }
  };

  return (
    <section id="prayer" className="py-20 md:py-28 bg-gradient-to-b from-sky-50/50 via-white to-slate-50 border-b border-slate-200/80 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-sky-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/80 border border-sky-200 mb-4 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-sky-600 text-sky-600 animate-pulse" />
            <span>Intercessory Prayer Community</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            이음 중보기도 나눔터
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-serif-kr">
            "너희 죄를 서로 고백하며 병이 낫기를 위하여 서로 기도하라 <br className="hidden sm:inline" />
            의인의 간구는 역사하는 힘이 큼이니라" <span className="text-xs text-sky-700 font-sans font-bold">(야고보서 5:16)</span>
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            혼자 감당하기 벅찬 삶의 짐, 은밀한 마음의 기도제목을 익명 또는 실명으로 나누어 주세요. <br className="hidden sm:inline" />
            이음공동체가 마음을 하나로 모아 예수 그리스도의 이름으로 끝까지 함께 기도합니다.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsNewPrayerModalOpen(true)}
              type="button"
              className="px-6 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-sky-600/20 hover:shadow-xl hover:shadow-sky-600/30 active:scale-95 transition-all"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Plus className="w-5 h-5" />
              <span>중보기도 요청하기</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('answered');
                const el = document.getElementById('prayer-list');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              type="button"
              className="px-5 py-3.5 rounded-2xl text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-xs active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>기도 응답 간증 보기 ({answeredCount})</span>
            </button>
          </div>
        </div>

        {/* Real-time Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-12">
          {/* Card 1: Total Requests */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">나눈 기도제목</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalRequests}</span>
                <span className="text-xs text-slate-500 font-bold">건</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Prayer Count (Live Atomic Counter) */}
          <div className="bg-gradient-to-br from-white to-sky-50/60 rounded-3xl p-5 sm:p-6 border border-sky-200/80 shadow-md shadow-sky-100 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 animate-pulse">
                실시간
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-300">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-800 uppercase tracking-wider">함께 모은 기도의 손</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-sky-700">{totalPrayersCount.toLocaleString()}</span>
                <span className="text-xs text-sky-600 font-bold">회 동참</span>
              </div>
            </div>
          </div>

          {/* Card 3: Answered Prayers */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">응답받은 기도 감사</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-800">{answeredCount}</span>
                <span className="text-xs text-amber-700 font-bold">건 응답</span>
              </div>
            </div>
          </div>

          {/* Card 4: Fellowship Promise */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">보안 & 비밀 보장</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">완전 익명 안심 나눔</p>
              <p className="text-[11px] text-slate-500">목회자 & 성도 중보 네트워크</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar & Search Bar */}
        <div id="prayer-list" className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categoryFilters.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    type="button"
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="기도제목, 성도명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-sky-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-hidden focus:border-sky-500"
              >
                <option value="latest">최신 등록순</option>
                <option value="prayed">기도 많은 순</option>
                <option value="answered">응답 감사순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prayer Cards Grid */}
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 fill-sky-100 text-sky-500" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">해당하는 기도제목이 없습니다</h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              가장 먼저 따뜻한 마음을 담아 성도들과 나눌 중보기도 제목을 올려주세요.
            </p>
            <button
              onClick={() => setIsNewPrayerModalOpen(true)}
              type="button"
              className="mt-5 px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-95"
              style={{ backgroundColor: theme.primaryColor }}
            >
              + 첫 번째 기도제목 나누기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredPrayers.map((prayer) => {
              const hasPrayed = !!myPrayedMap[prayer.id];
              const isAnimating = animatingId === prayer.id;
              const isEncouragementsOpen = !!expandedEncouragements[prayer.id];
              const encouragementsList = prayer.encouragements || [];

              return (
                <div
                  key={prayer.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                    prayer.isAnswered
                      ? 'border-amber-300 shadow-md shadow-amber-100/60 ring-2 ring-amber-300/40'
                      : 'border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  {/* Card Content Top */}
                  <div className="p-6 sm:p-7">
                    {/* Header Row: Badge & Meta */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {getCategoryBadge(prayer.category, prayer.isAnswered)}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{prayer.createdAt}</span>
                        </span>
                      </div>

                      {/* Options (Author or Editor actions) */}
                      {isEditor && (
                        <div className="flex items-center gap-1 text-slate-400">
                          {!prayer.isAnswered && (
                            <button
                              onClick={() => {
                                setTargetPrayerForAnswer(prayer);
                                setIsAnswerModalOpen(true);
                              }}
                              type="button"
                              className="px-2 py-1 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                              title="기도 응답 감사 표시"
                            >
                              응답 처리
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('이 기도제목을 삭제하시겠습니까?')) {
                                onDeletePrayer(prayer.id);
                              }
                            }}
                            type="button"
                            className="p-1 hover:text-rose-600 rounded-md transition-colors"
                            title="기도제목 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Prayer Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">
                      {prayer.title}
                    </h3>

                    {/* Author Badge */}
                    <div className="mt-2.5 flex items-center gap-2 text-xs">
                      {prayer.isAnonymous ? (
                        <div className="inline-flex items-center gap-1.5 text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prayer.author}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-sky-800 font-semibold bg-sky-50 px-2.5 py-1 rounded-lg">
                          <User className="w-3.5 h-3.5 text-sky-600" />
                          <span>{prayer.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Prayer Content Text */}
                    <div className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                      {prayer.content}
                    </div>

                    {/* Answered Testimony Banner (if answered) */}
                    {prayer.isAnswered && prayer.answeredTestimony && (
                      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200">
                        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>기도 응답 감사 간증</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 font-serif-kr italic leading-relaxed">
                          "{prayer.answeredTestimony}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Pray Action & Stats & Encouragements Toggle */}
                  <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      
                      {/* Left: Real-time Live Pray Count & Toggle Comment */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-700">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          <span>{prayer.prayerCount || 0}</span>
                          <span className="font-normal text-xs text-slate-500">명이 기도함</span>
                        </div>

                        <button
                          onClick={() => {
                            setExpandedEncouragements((prev) => ({
                              ...prev,
                              [prayer.id]: !prev[prayer.id]
                            }));
                          }}
                          type="button"
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>아멘/화답 {encouragementsList.length > 0 ? `(${encouragementsList.length})` : ''}</span>
                        </button>
                      </div>

                      {/* Right: The Interactive "함께 기도하기" Button */}
                      <button
                        onClick={() => handlePrayClick(prayer)}
                        type="button"
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm ${
                          hasPrayed
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                        } ${isAnimating ? 'ring-4 ring-rose-400 scale-105' : ''}`}
                      >
                        <Heart className={`w-4 h-4 transition-transform ${hasPrayed ? 'fill-rose-500 text-rose-500' : 'text-slate-600'} ${isAnimating ? 'animate-bounce' : ''}`} />
                        <span>{hasPrayed ? '오늘 함께 기도함 ✓' : '함께 기도하기'}</span>
                      </button>
                    </div>

                    {/* Encouragements Drawer */}
                    {isEncouragementsOpen && (
                      <div className="mt-2 pt-3 border-t border-slate-200/80 animate-in fade-in duration-200">
                        {encouragementsList.length > 0 && (
                          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                            {encouragementsList.map((enc) => (
                              <div key={enc.id} className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                    {enc.isAnonymous ? <Lock className="w-3 h-3 text-slate-400" /> : <User className="w-3 h-3 text-sky-600" />}
                                    {enc.author}
                                  </span>
                                  <span>{enc.createdAt}</span>
                                </div>
                                <p className="text-slate-700 font-sans">{enc.message}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Leave a quick encouragement form */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="아멘으로 화답하거나 짧은 응원의 기도문을 남겨주세요..."
                              value={encouragementInput[prayer.id] || ''}
                              onChange={(e) =>
                                setEncouragementInput((prev) => ({
                                  ...prev,
                                  [prayer.id]: e.target.value
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSendEncouragement(prayer.id);
                                }
                              }}
                              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
                            />
                            <button
                              onClick={() => handleSendEncouragement(prayer.id)}
                              type="button"
                              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>전송</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={encouragementAnonymous[prayer.id] || false}
                                onChange={(e) =>
                                  setEncouragementAnonymous((prev) => ({
                                    ...prev,
                                    [prayer.id]: e.target.checked
                                  }))
                                }
                                className="rounded text-sky-600 focus:ring-0 w-3.5 h-3.5"
                              />
                              <span>익명으로 남기기</span>
                            </label>

                            {!encouragementAnonymous[prayer.id] && (
                              <input
                                type="text"
                                placeholder="작성자명 (예: 김은혜 권사)"
                                value={encouragementAuthor[prayer.id] || ''}
                                onChange={(e) =>
                                  setEncouragementAuthor((prev) => ({
                                    ...prev,
                                    [prayer.id]: e.target.value
                                  }))
                                }
                                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 w-32"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Toast Notification */}
      {toastFeedback && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-rose-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">중보기도 참여 완료</p>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toastFeedback}</p>
          </div>
        </div>
      )}

      {/* New Prayer Request Modal */}
      {isNewPrayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">새 중보기도 제목 나누기</h3>
                  <p className="text-xs text-slate-500 mt-0.5">이음교회 믿음의 공동체와 함께 기도할 제목을 적어주세요</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewPrayerModalOpen(false)}
                type="button"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitNewPrayer} className="p-6 overflow-y-auto space-y-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  기도 분야 (카테고리)
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PrayerCategory)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="general">일반 성도의 기도</option>
                  <option value="healing">🌿 환우 & 질병 치유</option>
                  <option value="family">🏡 가정의 평안 & 자녀</option>
                  <option value="career">💼 진로 & 취업 & 일터</option>
                  <option value="mission">🌏 선교 & 전도 & 열방</option>
                  <option value="church">⛪ 이음교회 & 사역 & 부흥</option>
                  <option value="answered">🎉 기도 응답 감사 찬양</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  기도 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 어머님의 수술과 평안한 회복을 위해 중보를 부탁드립니다"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-sky-500"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  상세 기도 내용 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="공동체가 함께 마음을 모아 기도할 수 있도록 구체적인 상황과 기도제목을 적어주세요."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-sky-500 font-sans"
                  required
                />
              </div>

              {/* Author and Anonymous Option */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">작성자 공개 방식</span>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-0 w-4 h-4"
                    />
                    <span>익명으로 게시하기 (이름 숨김)</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      작성자 성함 및 직분
                    </label>
                    <input
                      type="text"
                      placeholder="예: 김은혜 권사, 온유 목장 성도"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-sky-500"
                    />
                  </div>
                )}
                {isAnonymous && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>게시물에 '익명의 성도'로 표시되어 신원이 안전하게 보호됩니다.</span>
                  </p>
                )}
              </div>

              {/* Optional 4-digit PIN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  관리용 비밀번호 (선택 - 4자리 숫자)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="추후 본인이 직접 삭제할 때 사용할 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-sky-500"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewPrayerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-xs transition-transform active:scale-95"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  기도제목 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Answered Testimony Modal */}
      {isAnswerModalOpen && targetPrayerForAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">기도 응답 감사 나눔</h4>
                  <p className="text-xs text-slate-500">하나님께서 베푸신 은혜의 간증을 나누어 주세요</p>
                </div>
              </div>
              <button
                onClick={() => setIsAnswerModalOpen(false)}
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
              <p className="font-bold text-slate-900 mb-0.5">{targetPrayerForAnswer.title}</p>
              <p className="line-clamp-2 text-slate-500">{targetPrayerForAnswer.content}</p>
            </div>

            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  응답 간증 및 감사 고백 (선택)
                </label>
                <textarea
                  rows={3}
                  placeholder="예: 기도해 주신 모든 성도님들의 중보 덕분에 건강히 회복되었습니다. 하나님께 영광을 돌립니다!"
                  value={answerTestimony}
                  onChange={(e) => setAnswerTestimony(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAnswerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs"
                >
                  응답 완료 처리하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
