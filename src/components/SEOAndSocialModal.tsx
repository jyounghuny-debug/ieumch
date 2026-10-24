import React, { useState, useEffect } from 'react';
import { SEOSettings, ChurchTheme } from '../types';
import { X, Search, Share2, Globe, Copy, Check, ExternalLink, Youtube, Instagram, MessageCircle, Bookmark } from 'lucide-react';

interface SEOAndSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  seoSettings: SEOSettings;
  onUpdateSEO: (settings: SEOSettings) => void;
  theme: ChurchTheme;
}

export const SEOAndSocialModal: React.FC<SEOAndSocialModalProps> = ({
  isOpen,
  onClose,
  seoSettings,
  onUpdateSEO,
  theme
}) => {
  const [localSEO, setLocalSEO] = useState<SEOSettings>(seoSettings);
  const [activeTab, setActiveTab] = useState<'preview' | 'meta' | 'social'>('preview');
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalSEO(seoSettings);
    }
  }, [isOpen, seoSettings]);

  if (!isOpen) return null;

  const handleCopyMetaHTML = () => {
    const htmlSnippet = `<!-- 이음교회 SEO & OpenGraph 메타태그 -->
<title>${localSEO.metaTitle}</title>
<meta name="description" content="${localSEO.metaDescription}" />
<meta name="keywords" content="${localSEO.keywords}" />
<link rel="canonical" href="${localSEO.siteUrl}" />

<!-- OpenGraph (카카오톡, 페이스북, 인스타그램) -->
<meta property="og:title" content="${localSEO.metaTitle}" />
<meta property="og:description" content="${localSEO.metaDescription}" />
<meta property="og:image" content="${localSEO.ogImage}" />
<meta property="og:url" content="${localSEO.siteUrl}" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${localSEO.metaTitle}" />
<meta name="twitter:description" content="${localSEO.metaDescription}" />
<meta name="twitter:image" content="${localSEO.ogImage}" />`;

    navigator.clipboard.writeText(htmlSnippet);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSave = () => {
    onUpdateSEO(localSEO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                SEO 검색 엔진 최적화 & 소셜 미디어 도구
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                구글 검색 결과 미리보기, 카카오톡 공유 카드, 메타태그 및 SNS 연동 관리
              </p>
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

        {/* Tab Controls */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2">
          {[
            { id: 'preview', label: '실시간 검색/SNS 미리보기' },
            { id: 'meta', label: '메타태그 설정' },
            { id: 'social', label: '소셜 채널 연동' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: Real-time Previews */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Google SERP Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Google 검색 결과 실시간 미리보기 (SERP)
                  </span>
                  <span className="text-[11px] text-slate-400">데스크탑 & 모바일 기준</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
                    <div className="w-4 h-4 rounded-full bg-sky-600 text-[10px] text-white flex items-center justify-center font-bold">
                      이
                    </div>
                    <span className="font-medium text-slate-800">{theme.churchName}</span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-500 font-mono text-[11px] truncate">https://ieumchurch.kr</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-snug">
                    {localSEO.metaTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {localSEO.metaDescription}
                  </p>
                </div>
              </div>

              {/* KakaoTalk Share Card Preview */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    카카오톡 공유 카드 미리보기
                  </span>
                  <span className="text-[11px] text-slate-400">카카오 링크 템플릿</span>
                </div>

                <div className="max-w-xs bg-[#FEE500]/20 p-4 rounded-2xl border border-amber-200/80">
                  <div className="bg-white rounded-xl overflow-hidden shadow-xs border border-slate-200">
                    <div className="h-36 bg-slate-100 relative">
                      <img
                        src={localSEO.ogImage || theme.heroImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                        {localSEO.metaTitle}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-normal mb-2">
                        {localSEO.metaDescription}
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ieumchurch.kr
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Social Share Action Bar */}
              <div className="pt-4 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  홈페이지 즉시 공유하기 (SNS Share Actions)
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUrl ? 'URL 복사 완료!' : '홈페이지 링크 복사'}</span>
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(localSEO.metaTitle)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>트위터/X 공유</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>페이스북 공유</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Meta Tags Settings */}
          {activeTab === 'meta' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  검색엔진 타이틀 (Meta Title)
                </label>
                <input
                  type="text"
                  value={localSEO.metaTitle}
                  onChange={(e) => setLocalSEO({ ...localSEO, metaTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  사이트 설명문 (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={localSEO.metaDescription}
                  onChange={(e) => setLocalSEO({ ...localSEO, metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  검색 키워드 (쉼표 구분)
                </label>
                <input
                  type="text"
                  value={localSEO.keywords}
                  onChange={(e) => setLocalSEO({ ...localSEO, keywords: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  대표 공유 썸네일 이미지 URL (og:image)
                </label>
                <input
                  type="text"
                  value={localSEO.ogImage}
                  onChange={(e) => setLocalSEO({ ...localSEO, ogImage: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCopyMetaHTML}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTags ? 'HTML 태그 복사됨!' : 'HTML 메타태그 복사'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Social Links */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 mb-3">
                교회 공식 소셜 미디어 및 커뮤니티 채널 주소를 등록하세요. 홈페이지 푸터 및 바로가기에 연동됩니다.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-rose-500" />
                  <span>유튜브 공식 채널 (라이브 예배 및 설교)</span>
                </label>
                <input
                  type="text"
                  value={localSEO.socialLinks.youtube}
                  onChange={(e) =>
                    setLocalSEO({
                      ...localSEO,
                      socialLinks: { ...localSEO.socialLinks, youtube: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>인스타그램 (교회 소식 및 청년부 활동)</span>
                </label>
                <input
                  type="text"
                  value={localSEO.socialLinks.instagram}
                  onChange={(e) =>
                    setLocalSEO({
                      ...localSEO,
                      socialLinks: { ...localSEO.socialLinks, instagram: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-amber-500" />
                  <span>카카오톡 채널 (1:1 상담 및 심방 예약)</span>
                </label>
                <input
                  type="text"
                  value={localSEO.socialLinks.kakaotalk}
                  onChange={(e) =>
                    setLocalSEO({
                      ...localSEO,
                      socialLinks: { ...localSEO.socialLinks, kakaotalk: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-emerald-500" />
                  <span>네이버 밴드 (전교인 공지 및 순모임 나눔)</span>
                </label>
                <input
                  type="text"
                  value={localSEO.socialLinks.band}
                  onChange={(e) =>
                    setLocalSEO({
                      ...localSEO,
                      socialLinks: { ...localSEO.socialLinks, band: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-xs transition-all hover:opacity-95 active:scale-98"
            style={{ backgroundColor: theme.primaryColor }}
          >
            저장 및 적용
          </button>
        </div>

      </div>
    </div>
  );
};
