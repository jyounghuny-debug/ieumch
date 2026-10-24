import React, { useState } from 'react';
import { PostItem, ChurchTheme } from '../types';
import { X, Heart, Eye, Share2, Printer, MessageCircle, Send, Edit, Trash2, Pin, BookOpen, Youtube, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PostDetailModalProps {
  post: PostItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, author: string, content: string) => void;
  onEdit: (post: PostItem) => void;
  onDelete: (postId: string) => void;
  theme: ChurchTheme;
  onOpenMissionModal?: (fieldId?: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onAddComment,
  onEdit,
  onDelete,
  theme,
  onOpenMissionModal
}) => {
  const { isEditor } = useAuth();
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    onAddComment(
      post.id,
      commentAuthor.trim() || '성도',
      commentContent.trim()
    );
    setCommentContent('');
  };

  const handleLikeClick = () => {
    if (!hasLiked) {
      onLike(post.id);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'notice': return '공지사항';
      case 'bulletin': return '이음주보';
      case 'sermon': return '설교말씀';
      case 'grace': return '은혜나눔';
      case 'prayer': return '중보기도';
      default: return '게시글';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Controls */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-sky-700">{getCategoryLabel(post.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{post.date}</span>
            {post.isPinned && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-medium flex items-center gap-0.5">
                  <Pin className="w-3 h-3" />
                  상단 고정
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isEditor && (
              <>
                <button
                  onClick={() => onEdit(post)}
                  type="button"
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="게시글 수정"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">수정</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                      onDelete(post.id);
                      onClose();
                    }
                  }}
                  type="button"
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="게시글 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">삭제</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Post Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              {post.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <span>작성자: <strong className="text-slate-700 font-medium">{post.author}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{post.views}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-mono">{post.likes}</span>
              </span>
            </div>
          </div>

          {/* Scripture Bar if sermon */}
          {post.scripture && (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-sky-800">본문 말씀</span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5 font-serif-kr">
                  {post.scripture}
                </p>
                {post.preacher && (
                  <p className="text-xs text-sky-700 mt-1">
                    설교자: {post.preacher}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sermon YouTube Video Direct Link */}
          {post.category === 'sermon' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border border-red-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    이음교회 주일 설교동영상 실황 시청
                  </p>
                  <p className="text-[11px] text-slate-500">
                    유튜브 공식 채널에서 생생한 설교 실황 영상을 시청하실 수 있습니다.
                  </p>
                </div>
              </div>
              <a
                href="https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF0000] hover:bg-[#E60000] rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <span>유튜브에서 영상 보기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Attached Image if present */}
          {post.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[380px] bg-slate-100">
              <img
                src={post.imageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Mission Field Quick Trigger Box */}
          {post.category === 'mission' && onOpenMissionModal && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  선교사님별 최신 사역 리포트 & 긴급 중보기도 전용 팝업
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMissionModal();
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                사역지 소식 팝업 열기 →
              </button>
            </div>
          )}

          {/* Post Content */}
          <div className="text-slate-800 text-base leading-relaxed whitespace-pre-line py-2">
            {post.content}
          </div>

          {/* Like, Share & Print Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLikeClick}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
                  hasLiked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>은혜 받았습니다 ({post.likes})</span>
              </button>

              <button
                onClick={handleShare}
                type="button"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? '주소 복사됨!' : '공유하기'}</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              type="button"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs flex items-center gap-1.5"
              title="이 페이지 인쇄하기"
            >
              <Printer className="w-4 h-4" />
              <span>인쇄</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-sky-700" />
              <h4 className="text-sm font-bold text-slate-900">
                댓글 및 나눔 ({post.comments?.length || 0})
              </h4>
            </div>

            {/* Existing Comments List */}
            <div className="space-y-2.5">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{comment.author}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{comment.date}</span>
                    </div>
                    <p className="text-slate-700 leading-normal">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">
                  등록된 댓글이 없습니다. 첫 번째 은혜와 기도의 마음을 남겨주세요.
                </p>
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="작성자 이름"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder="따뜻한 격려나 기도 한마디를 남겨주세요..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                  className="sm:col-span-3 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Send className="w-3 h-3" />
                  <span>댓글 등록</span>
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
