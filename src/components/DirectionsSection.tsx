import React, { useState } from 'react';
import { ChurchTheme } from '../types';
import { MapPin, Navigation, Car, Train, Phone, Mail, Copy, Check, ExternalLink, ZoomIn, X, Compass } from 'lucide-react';

interface DirectionsSectionProps {
  theme: ChurchTheme;
}

export const DirectionsSection: React.FC<DirectionsSectionProps> = ({ theme }) => {
  const [copied, setCopied] = useState(false);
  const [isMapZoomOpen, setIsMapZoomOpen] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${theme.address} ${theme.addressDetail}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapScreenshotUrl = '/assets/aistudio/_____2026-10-22_144507_3b61875c.png';

  return (
    <section id="directions" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
              Location & Contact
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              오시는 길 & 안내
            </h2>
            <p className="mt-2 text-base text-slate-600">
              대중교통과 자가용 모두 편리하게 방문하실 수 있도록 자세히 안내해 드립니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAddress}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '주소 복사 완료!' : '도로명 주소 복사'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Real Map Card on Left, Transport Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Real Map Card & Direct Navigation (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#FAFBFD] rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{theme.churchName}</h3>
                    <p className="text-xs text-slate-500 font-mono">{theme.address} {theme.addressDetail}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md border border-sky-100 shrink-0">
                  미르빌딩 4층
                </span>
              </div>

              {/* Real Map Image Container with Interactive Zoom Trigger */}
              <div 
                onClick={() => setIsMapZoomOpen(true)}
                className="group cursor-pointer relative h-72 sm:h-88 w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 mb-4 shadow-inner"
                title="클릭하여 고화질 지도 원본 크게 보기"
              >
                <img
                  src={mapScreenshotUrl}
                  alt={`${theme.churchName} 오시는 길 지도 (지족로 148번길 5-10)`}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />

                {/* Map Floating Pin Overlay */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-900">이음교회 (미르빌딩 4층)</span>
                </div>

                {/* Click to Zoom Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-xs font-bold text-slate-900 flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-sky-600" />
                    <span>지도 원본 크게 보기 (클릭)</span>
                  </div>
                </div>

                {/* Bottom Address Ribbon */}
                <div className="absolute bottom-2 inset-x-2 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[11px] flex items-center justify-between">
                  <span className="truncate">대전 유성구 지족로 148번길 5-10 (세븐일레븐 맞은편)</span>
                  <span className="text-sky-300 font-semibold shrink-0 ml-2">미르빌딩 4층</span>
                </div>
              </div>

              {/* Key Landmark Navigation Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  🏪 세븐일레븐 맞은편
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  🏫 새미래초등학교 도보 5분
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  🛒 홈마트 인접
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  🍗 처갓집양념치킨 골목
                </span>
              </div>
            </div>

            {/* Direct Map App Navigation Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent('대전광역시 유성구 지족로 148번길 5-10')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 bg-[#03C75A] hover:bg-[#02b350] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>네이버지도에서 위치 보기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent('대전광역시 유성구 지족로 148번길 5-10')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>카카오맵 길찾기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Transit & Parking Details (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Subway */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">도시철도(지하철) 이용 시</h4>
                  <p className="text-xs text-slate-500">대전 1호선 노은역 또는 지족역 도보 8~9분</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                대전 도시철도 1호선 <strong>노은역 2번 출구</strong> (약 600m) 또는 <strong>지족역 1번 출구</strong> (약 700m)에서 지족로 방면으로 이동하시면 <strong>미르빌딩 4층</strong>으로 오실 수 있습니다.
              </p>
            </div>

            {/* Bus */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">시내버스 노선 안내</h4>
                  <p className="text-xs text-slate-500">지족중고등학교 · 송림마을 · 반석고 하차</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-600 px-2 py-0.5 bg-blue-50 rounded">일반·간선</span>
                  <span className="font-mono font-medium">116번, 117번, 121번</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">광역버스</span>
                  <span className="font-mono font-medium">1002번 (세종 ↔ 대전 노은·유성)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-700 px-2 py-0.5 bg-amber-50 rounded">마을버스</span>
                  <span className="font-mono font-medium">유성 마을버스 1번</span>
                </div>
              </div>
            </div>

            {/* Parking */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">주차 안내</h4>
                  <p className="text-xs text-slate-500">미르빌딩 지상/지하 주차 및 인근 공영주차장</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                주일 및 주중 예배 시 미르빌딩 주차장 및 주변 안심 주차 공간을 이용하실 수 있습니다. 주차 안내가 필요하신 경우 편하게 문의해 주세요.
              </p>
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>교회 대표 문의: {theme.phone}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* High-Resolution Map Zoom Lightbox Modal */}
      {isMapZoomOpen && (
        <div
          onClick={() => setIsMapZoomOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {theme.churchName} 위치 지도 (미르빌딩 4층)
                </h3>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {theme.address} {theme.addressDetail}
                </span>
              </div>
              <button
                onClick={() => setIsMapZoomOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image viewport */}
            <div className="flex-1 overflow-auto bg-slate-900/90 flex items-center justify-center p-2 sm:p-4">
              <img
                src={mapScreenshotUrl}
                alt="이음교회 위치 지도 상세"
                className="max-h-[72vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Footer with App launch buttons */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                주변 길잡이: <strong className="text-slate-900">세븐일레븐 맞은편 미르빌딩 4층</strong> (새미래초등학교 인근 / 노은역·지족역 도보)
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent('대전광역시 유성구 지족로 148번길 5-10')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial py-2 px-4 bg-[#03C75A] hover:bg-[#02b350] text-white rounded-xl font-bold flex items-center justify-center gap-1.5"
                >
                  <span>네이버지도 열기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://map.kakao.com/link/search/${encodeURIComponent('대전광역시 유성구 지족로 148번길 5-10')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial py-2 px-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] rounded-xl font-bold flex items-center justify-center gap-1.5"
                >
                  <span>카카오맵 열기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
