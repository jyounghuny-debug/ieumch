import React, { useState, useEffect } from 'react';
import { ChurchTheme, WorshipSchedule } from '../types';
import { X, Palette, Type, FileEdit, Image as ImageIcon, Eye, RotateCcw, Download, Upload, Check, Sparkles, Clock, Trash2, Plus } from 'lucide-react';
import { pastorStudyImg } from '../data/initialData';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ChurchTheme;
  onUpdateTheme: (updated: ChurchTheme) => void;
  onResetTheme: () => void;
  schedules: WorshipSchedule[];
  onUpdateSchedules: (updated: WorshipSchedule[]) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
  onResetTheme,
  schedules,
  onUpdateSchedules
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'content' | 'images' | 'sections' | 'schedule' | 'backup'>('style');
  const [localTheme, setLocalTheme] = useState<ChurchTheme>(theme);
  const [localSchedules, setLocalSchedules] = useState<WorshipSchedule[]>(schedules);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setLocalTheme(theme);
      setLocalSchedules(schedules);
    }
  }, [isOpen, theme, schedules]);

  // Local image file upload handler via FileReader
  const handleLocalImageUpload = (field: 'heroImage' | 'pastorImage' | 'fellowshipImage' | 'worshipImage') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        setLocalTheme((prev) => ({ ...prev, [field]: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  // Sky Blue palette options
  const colorPresets = [
    { name: '스카이 블루 (기본)', hex: '#0284c7', light: '#e0f2fe' },
    { name: '맑은 하늘색 (Soft Azure)', hex: '#38bdf8', light: '#f0f9ff' },
    { name: '세룰리안 블루 (Cerulean)', hex: '#0ea5e9', light: '#e0f2fe' },
    { name: '딥 오션 (Deep Sky)', hex: '#0369a1', light: '#bae6fd' },
    { name: '청명 아쿠아 (Clean Cyan)', hex: '#06b6d4', light: '#cffafe' },
    { name: '클래식 네이비블루', hex: '#1e40af', light: '#dbeafe' }
  ];

  const bgTonePresets = [
    { key: 'warm', name: '소프트 웜화이트 (#FAFBFD)', hex: '#FAFBFD' },
    { key: 'pure', name: '퓨어 클린화이트 (#FFFFFF)', hex: '#FFFFFF' },
    { key: 'cool', name: '미니멀 쿨그레이 (#F8FAFC)', hex: '#F8FAFC' },
    { key: 'cream', name: '앤티크 크림 (#FDFCF7)', hex: '#FDFCF7' }
  ];

  const fontOptions = [
    { key: 'sans', name: '현대적인 산세리프 (Pretendard / Noto Sans KR)', desc: '단정하고 읽기 쉬운 깔끔한 고딕체' },
    { key: 'serif', name: '우아한 명조 (Noto Serif KR)', desc: '경건하고 따뜻하며 감성적인 바탕체' },
    { key: 'rounded', name: '부드러운 라운드 고딕', desc: '친근하고 따뜻한 느낌의 모던 서체' }
  ];

  const handleApply = () => {
    onUpdateTheme(localTheme);
    onUpdateSchedules(localSchedules);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (confirm('모든 디자인 및 설정값을 초기 기본 상태로 복원하시겠습니까?')) {
      onResetTheme();
      onClose();
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ theme: localTheme, schedules: localSchedules }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ieum_church_settings.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.theme) setLocalTheme(parsed.theme);
          if (parsed.schedules) setLocalSchedules(parsed.schedules);
          alert('설정 파일을 성공적으로 불러왔습니다. [변경사항 적용 및 저장] 버튼을 눌러주세요.');
        } catch {
          alert('유효하지 않은 설정 JSON 파일입니다.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: localTheme.primaryColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                디자인 & 콘텐츠 커스터마이징 스튜디오
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                포인트 하늘색, 배경 톤, 서체, 교회 문구, 이미지 및 예배 시간표를 자유롭게 변경하세요
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

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200/80 bg-white flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'style', label: '색상 & 테마', icon: Palette },
            { id: 'content', label: '교회 문구 & 소개', icon: FileEdit },
            { id: 'images', label: '이미지 설정', icon: ImageIcon },
            { id: 'schedule', label: '예배 시간표', icon: Clock },
            { id: 'sections', label: '섹션 노출 제어', icon: Eye },
            { id: 'backup', label: '백업 & 초기화', icon: RotateCcw }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: Style, Color, Font */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              {/* Primary Color Section */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  포인트 컬러 (하늘색 계열 커스터마이징)
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  교회 웹사이트의 버튼, 링크, 강조선 등에 적용되는 메인 포인트 색상입니다.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {colorPresets.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setLocalTheme({ ...localTheme, primaryColor: c.hex, primaryLightColor: c.light })}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        localTheme.primaryColor.toLowerCase() === c.hex.toLowerCase()
                          ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full shadow-xs shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{c.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{c.hex}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Direct Color Picker */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">커스텀 색상 직접 지정:</span>
                  <input
                    type="color"
                    value={localTheme.primaryColor}
                    onChange={(e) => setLocalTheme({ ...localTheme, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={localTheme.primaryColor}
                    onChange={(e) => setLocalTheme({ ...localTheme, primaryColor: e.target.value })}
                    placeholder="#0284c7"
                    className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 w-28 uppercase"
                  />
                </div>
              </div>

              {/* Background Tone */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  배경 톤 (밝고 화사한 밝은 배경)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {bgTonePresets.map((bg) => (
                    <button
                      key={bg.key}
                      type="button"
                      onClick={() => setLocalTheme({ ...localTheme, bgTone: bg.key as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        localTheme.bgTone === bg.key
                          ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/30 font-semibold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-800">{bg.name}</div>
                      <div className="w-full h-4 rounded mt-2 border border-slate-200" style={{ backgroundColor: bg.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Selection */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  폰트 패밀리 (타이포그래피 분위기)
                </label>
                <div className="space-y-2">
                  {fontOptions.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setLocalTheme({ ...localTheme, fontFamily: f.key as any })}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                        localTheme.fontFamily === f.key
                          ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">{f.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                      </div>
                      {localTheme.fontFamily === f.key && (
                        <Check className="w-5 h-5 text-sky-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Content & Copywriting */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">교회 이름</label>
                  <input
                    type="text"
                    value={localTheme.churchName}
                    onChange={(e) => setLocalTheme({ ...localTheme, churchName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">영문 표기</label>
                  <input
                    type="text"
                    value={localTheme.churchEngName}
                    onChange={(e) => setLocalTheme({ ...localTheme, churchEngName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">메인 슬로건</label>
                <input
                  type="text"
                  value={localTheme.slogan}
                  onChange={(e) => setLocalTheme({ ...localTheme, slogan: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">부 슬로건 (교회 사명)</label>
                <input
                  type="text"
                  value={localTheme.subSlogan}
                  onChange={(e) => setLocalTheme({ ...localTheme, subSlogan: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">올해의 성경 구절 (표어)</label>
                <input
                  type="text"
                  value={localTheme.scriptureVerse}
                  onChange={(e) => setLocalTheme({ ...localTheme, scriptureVerse: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">담임목사 성함</label>
                  <input
                    type="text"
                    value={localTheme.seniorPastor}
                    onChange={(e) => setLocalTheme({ ...localTheme, seniorPastor: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">직함</label>
                  <input
                    type="text"
                    value={localTheme.pastorTitle}
                    onChange={(e) => setLocalTheme({ ...localTheme, pastorTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">목회자 대표 환영 인사</label>
                <input
                  type="text"
                  value={localTheme.pastorGreeting}
                  onChange={(e) => setLocalTheme({ ...localTheme, pastorGreeting: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">교회 주소</label>
                  <input
                    type="text"
                    value={localTheme.address}
                    onChange={(e) => setLocalTheme({ ...localTheme, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">전화번호</label>
                  <input
                    type="text"
                    value={localTheme.phone}
                    onChange={(e) => setLocalTheme({ ...localTheme, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Images */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Main Hero Church Image */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold text-slate-800">
                    메인 히어로 성전 사진
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-sky-700 text-xs font-semibold rounded-lg border border-sky-200 cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>내 컴퓨터에서 사진 올리기</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLocalImageUpload('heroImage')}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={localTheme.heroImage}
                  onChange={(e) => setLocalTheme({ ...localTheme, heroImage: e.target.value })}
                  placeholder="이미지 웹 주소(URL) 또는 직접 입력"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 mb-2.5 bg-white font-mono"
                />
                <div className="h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                  <img src={localTheme.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Pastor Portrait */}
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">담임목사 프로필 사진</label>
                    <label className="w-full mb-2 py-1.5 px-2 bg-white hover:bg-slate-100 text-sky-700 text-[11px] font-semibold rounded-lg border border-sky-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3 h-3 text-sky-600" />
                      <span>내 컴퓨터에서 사진 올리기</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload('pastorImage')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={localTheme.pastorImage}
                      onChange={(e) => setLocalTheme({ ...localTheme, pastorImage: e.target.value })}
                      placeholder="이미지 URL"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 mb-2 bg-white font-mono"
                    />
                  </div>
                  <div className="h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                    <img src={localTheme.pastorImage} alt="Pastor Preview" className="w-full h-full object-cover object-center" />
                  </div>
                </div>

                {/* Fellowship Image */}
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">성도 교제 사진</label>
                    <label className="w-full mb-2 py-1.5 px-2 bg-white hover:bg-slate-100 text-sky-700 text-[11px] font-semibold rounded-lg border border-sky-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3 h-3 text-sky-600" />
                      <span>내 컴퓨터에서 사진 올리기</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload('fellowshipImage')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={localTheme.fellowshipImage}
                      onChange={(e) => setLocalTheme({ ...localTheme, fellowshipImage: e.target.value })}
                      placeholder="이미지 URL"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 mb-2 bg-white font-mono"
                    />
                  </div>
                  <div className="h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                    <img src={localTheme.fellowshipImage} alt="Fellowship Preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Worship Image */}
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">예배 찬양 사진</label>
                    <label className="w-full mb-2 py-1.5 px-2 bg-white hover:bg-slate-100 text-sky-700 text-[11px] font-semibold rounded-lg border border-sky-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3 h-3 text-sky-600" />
                      <span>내 컴퓨터에서 사진 올리기</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload('worshipImage')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={localTheme.worshipImage}
                      onChange={(e) => setLocalTheme({ ...localTheme, worshipImage: e.target.value })}
                      placeholder="이미지 URL"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 mb-2 bg-white font-mono"
                    />
                  </div>
                  <div className="h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                    <img src={localTheme.worshipImage} alt="Worship Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Worship Schedule Editor */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">정규 예배 일정 항목 편집</h4>
                  <p className="text-xs text-slate-500">시간, 대상, 장소를 실시간으로 변경하거나 추가할 수 있습니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = 'w_' + Date.now();
                    setLocalSchedules([
                      ...localSchedules,
                      {
                        id: newId,
                        name: '새로운 예배/기도회',
                        time: '매주 주일 오후 03:00',
                        target: '성도 및 청년',
                        place: '본당 대예배실',
                        isMain: false
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg flex items-center gap-1 shadow-xs"
                  style={{ backgroundColor: localTheme.primaryColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>예배 추가</span>
                </button>
              </div>

              <div className="space-y-3">
                {localSchedules.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-800">예배 #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSchedules(localSchedules.filter((s) => s.id !== item.id));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalSchedules(localSchedules.map((s) => s.id === item.id ? { ...s, name: val } : s));
                        }}
                        placeholder="예배 명칭"
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalSchedules(localSchedules.map((s) => s.id === item.id ? { ...s, time: val } : s));
                        }}
                        placeholder="시간 (예: 매주 주일 오전 11:00)"
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.target}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalSchedules(localSchedules.map((s) => s.id === item.id ? { ...s, target: val } : s));
                        }}
                        placeholder="참석 대상"
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        value={item.place}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalSchedules(localSchedules.map((s) => s.id === item.id ? { ...s, place: val } : s));
                        }}
                        placeholder="예배 장소 (예: 3층 대예배실)"
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Section Visibility Toggle */}
          {activeTab === 'sections' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                홈페이지에 노출할 메인 섹션을 켜거나 끌 수 있습니다.
              </p>
              {[
                { key: 'hero', label: '메인 상단 히어로 비주얼' },
                { key: 'about', label: '교회소개 & 목회자 인사말' },
                { key: 'worship', label: '예배 및 모임 안내 시간표' },
                { key: 'calendar', label: '교회 일정 및 행사 캘린더' },
                { key: 'sermon', label: '은혜의 설교말씀 아카이브' },
                { key: 'prayer', label: '성도 중보기도 나눔터 & 실시간 기도' },
                { key: 'posts', label: '교회소식 및 이음주보 게시판' },
                { key: 'gallery', label: '성도 교제 및 사진 갤러리' },
                { key: 'newFamily', label: '새가족 등록 및 정착 안내' },
                { key: 'directions', label: '오시는 길 & 약도 지도' }
              ].map((s) => (
                <label
                  key={s.key}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{s.label}</span>
                  <input
                    type="checkbox"
                    checked={localTheme.visibleSections[s.key as keyof typeof localTheme.visibleSections]}
                    onChange={(e) => {
                      setLocalTheme({
                        ...localTheme,
                        visibleSections: {
                          ...localTheme.visibleSections,
                          [s.key]: e.target.checked
                        }
                      });
                    }}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                  />
                </label>
              ))}
            </div>
          )}

          {/* TAB 6: Backup & Reset */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-1">설정 백업 및 파일 내보내기</h4>
                <p className="text-xs text-slate-500 mb-4">
                  현재 지정한 모든 텍스트, 색상, 이미지, 예배 시간표 설정을 JSON 파일로 다운로드합니다.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>설정 JSON 내보내기</span>
                  </button>

                  <label className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>설정 JSON 불러오기</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
                <h4 className="text-sm font-bold text-rose-950 mb-1">기본 초기값으로 전체 리셋</h4>
                <p className="text-xs text-rose-700 mb-3">
                  커스텀 변경 사항을 모두 취소하고 처음 제공된 순정 디자인과 텍스트로 되돌립니다.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>초기 상태로 리셋하기</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Action Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {saveSuccess ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                설정이 저장되었습니다!
              </span>
            ) : (
              <span>* 브라우저 저장소(LocalStorage)에 안전하게 자동 보존됩니다</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:opacity-95 active:scale-98"
              style={{ backgroundColor: localTheme.primaryColor }}
            >
              <Check className="w-4 h-4" />
              <span>변경사항 적용 및 저장</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
