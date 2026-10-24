import React, { useState } from 'react';
import { PostItem, PostCategory, ChurchTheme } from '../types';
import { Search, Plus, Pin, Calendar, Eye, Heart, MessageCircle, FileText, ChevronRight, LayoutGrid, ListFilter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BoardSectionProps {
  theme: ChurchTheme;
  posts: PostItem[];
  onOpenNewPost: () => void;
  onSelectPost: (post: PostItem) => void;
  onEditPost: (post: PostItem) => void;
  onDeletePost: (postId: string) => void;
  onOpenMissionModal?: (fieldId?: string) => void;
}

export const BoardSection: React.FC<BoardSectionProps> = ({
  theme,
  posts,
  onOpenNewPost,
  onSelectPost,
  onEditPost,
  onDeletePost,
  onOpenMissionModal
}) => {
  const { isEditor } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const categories = [
    { key: 'all', label: '전체보기' },
    { key: 'notice', label: '교회소식' },
    { key: 'bulletin', label: '이음주보' },
    { key: 'sermon', label: '설교말씀' },
    { key: 'grace', label: '은혜나눔' },
    { key: 'prayer', label: '중보기도' },
    { key: 'mission', label: '선교지 소식' }
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.scripture && post.scripture.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const getCategoryBadge = (cat: PostCategory) => {
    switch (cat) {
      case 'notice':
        return { label: '교회소식', className: 'text-sky-800 bg-sky-50' };
      case 'bulletin':
        return { label: '이음주보', className: 'text-indigo-800 bg-indigo-50' };
      case 'sermon':
        return { label: '설교말씀', className: 'text-cyan-800 bg-cyan-50' };
      case 'grace':
        return { label: '은혜나눔', className: 'text-amber-800 bg-amber-50' };
      case 'prayer':
        return { label: '중보기도', className: 'text-emerald-800 bg-emerald-50' };
      case 'mission':
        return { label: '선교지 소식', className: 'text-teal-800 bg-teal-50 border border-teal-200/60' };
      default:
        return { label: '게시글', className: 'text-slate-800 bg-slate-50' };
    }
  };

  return (
    <section id="board" className="py-20 md:py-28 bg-[#FAFBFD] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & New Post Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
              Community & Bulletin
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              교회 소식 및 나눔 게시판
            </h2>
            <p className="mt-2 text-base text-slate-600">
              주보, 목회 일정, 설교 기록 및 성도님들의 진솔한 은혜의 이야기를 자유롭게 열람하고 작성하세요.
            </p>
          </div>

          {isEditor && (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenNewPost}
                type="button"
                className="px-5 py-3 text-sm font-semibold text-white rounded-xl shadow-xs transition-all flex items-center gap-2 hover:opacity-95 active:scale-98"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>새 글 작성하기</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs (Interactive Filter Controls - zero pills compliant) */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === c.key
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Bar & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="제목, 내용, 작성자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg text-xs ${viewMode === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                title="카드 보기"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                title="목록 보기"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Mission Field Urgent Notice Banner when mission category selected */}
        {selectedCategory === 'mission' && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0 mt-1 sm:mt-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  선교지 긴급기도 & 사역지 소식 팝업
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  김동선·이금주 선교사(캄보디아), 김명식·정지은 선교사(필리핀), 기아대책의 최신 사역 리포트와 3대 중보기도 제목을 확인하실 수 있습니다.
                </p>
              </div>
            </div>
            {onOpenMissionModal && (
              <button
                type="button"
                onClick={() => onOpenMissionModal()}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                사역지 리포트 팝업 열기 →
              </button>
            )}
          </div>
        )}

        {/* Posts List / Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">해당 조건의 게시글이 없습니다</h3>
            <p className="text-xs text-slate-500 mt-1">검색어를 바꾸거나 새로운 글을 작성해 보세요.</p>
            <button
              onClick={onOpenNewPost}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              새 글 작성하기
            </button>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const badge = getCategoryBadge(post.category);
              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className={`group cursor-pointer bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                    post.isPinned
                      ? 'border-sky-200/90 ring-1 ring-sky-300 shadow-xs'
                      : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Optional Image thumbnail */}
                  {post.imageUrl && (
                    <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      {post.isPinned && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-sky-800 text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <Pin className="w-3 h-3 text-sky-600" />
                          공지
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Quiet unboxed metadata line */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
                        <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${badge.className}`}>
                          {badge.label}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{post.date}</span>
                        {post.isPinned && !post.imageUrl && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-sky-700 font-semibold flex items-center gap-0.5">
                              <Pin className="w-3 h-3" />
                              고정
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug mb-2">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium text-slate-600">{post.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span className="font-mono">{post.views}</span>
                        </span>
                        <span className="flex items-center gap-1 text-rose-500">
                          <Heart className="w-3 h-3 fill-rose-500/20" />
                          <span className="font-mono">{post.likes}</span>
                        </span>
                        {post.comments?.length > 0 && (
                          <span className="flex items-center gap-1 text-sky-600">
                            <MessageCircle className="w-3 h-3" />
                            <span className="font-mono">{post.comments.length}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {filteredPosts.map((post) => {
              const badge = getCategoryBadge(post.category);
              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                    post.isPinned ? 'bg-sky-50/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${badge.className}`}>
                      {badge.label}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {post.title}
                        </h4>
                        {post.isPinned && (
                          <Pin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{post.author}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{post.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                    <span className="hidden sm:inline">조회 {post.views}</span>
                    <span className="text-rose-500 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
