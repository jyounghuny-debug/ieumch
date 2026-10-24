import React, { useState, useMemo } from 'react';
import { ChurchTheme, CalendarEvent, EventCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  FileText, 
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  X,
  Share2
} from 'lucide-react';

interface CalendarSectionProps {
  theme: ChurchTheme;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'rsvps'>) => void;
  onRSVP: (eventId: string, name: string, phone?: string) => void;
  onNavigateToPost?: (postId: string) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  theme,
  events,
  onAddEvent,
  onRSVP,
  onNavigateToPost
}) => {
  const { isEditor } = useAuth();
  // Current view year & month - default to October 2026 (or current date)
  const [currentDate, setCurrentDate] = useState(() => {
    // Current simulated year/month: 2026-10
    return new Date(2026, 9, 1); // 0-indexed month: 9 is October
  });

  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-25');
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedEventForModal, setSelectedEventForModal] = useState<CalendarEvent | null>(null);

  // RSVP Form state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Add Event Form Modal
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-25');
  const [newTime, setNewTime] = useState('오전 11:00');
  const [newPlace, setNewPlace] = useState('본당 3층 대예배실');
  const [newCategory, setNewCategory] = useState<EventCategory>('worship');
  const [newTarget, setNewTarget] = useState('전 교인');
  const [newDescription, setNewDescription] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date(2026, 9, 1));
    setSelectedDateStr('2026-10-25');
  };

  const categoryLabels: Record<EventCategory, { label: string; bg: string; text: string; dot: string }> = {
    worship: { label: '예배·기도회', bg: 'bg-sky-50', text: 'text-sky-800', dot: 'bg-sky-500' },
    ministry: { label: '사역·선교', bg: 'bg-indigo-50', text: 'text-indigo-800', dot: 'bg-indigo-500' },
    education: { label: '교육·양육', bg: 'bg-emerald-50', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    fellowship: { label: '친교·봉사', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
    special: { label: '특별행사', bg: 'bg-rose-50', text: 'text-rose-800', dot: 'bg-rose-500' }
  };

  // Calendar Grid calculations
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month pad days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = daysInPrevMonth - i;
      const prevMonthIdx = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(prevDate).padStart(2, '0')}`;
      days.push({
        dayNumber: prevDate,
        dateStr,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: true
      });
    }

    // Next month pad days
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextMonthIdx = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false
      });
    }

    return days;
  }, [year, month]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (categoryFilter === 'all') return true;
      return ev.category === categoryFilter;
    });
  }, [events, categoryFilter]);

  // Map of date string -> events
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((ev) => {
      if (!map[ev.date]) {
        map[ev.date] = [];
      }
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  // Events on selected day
  const selectedDayEvents = eventsByDate[selectedDateStr] || [];

  // Handle RSVP
  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForModal || !rsvpName.trim()) return;
    onRSVP(selectedEventForModal.id, rsvpName.trim(), rsvpPhone.trim());
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setRsvpName('');
      setRsvpPhone('');
    }, 1800);
  };

  // Add event submit
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddEvent({
      title: newTitle.trim(),
      date: newDate,
      time: newTime.trim(),
      place: newPlace.trim(),
      category: newCategory,
      target: newTarget.trim(),
      description: newDescription.trim()
    });
    setIsAddEventOpen(false);
    setNewTitle('');
    setNewDescription('');
    setSelectedDateStr(newDate);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (ev: CalendarEvent) => {
    const formattedDate = ev.date.replace(/-/g, '');
    const title = encodeURIComponent(`[이음교회] ${ev.title}`);
    const details = encodeURIComponent(`${ev.description}\n장소: ${ev.place}\n시간: ${ev.time || '종일'}`);
    const location = encodeURIComponent(ev.place || '이음교회');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedDate}/${formattedDate}&details=${details}&location=${location}`;
  };

  // iCal download
  const handleDownloadICS = (ev: CalendarEvent) => {
    const cleanDate = ev.date.replace(/-/g, '');
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ieum Church//Church Events//KO',
      'BEGIN:VEVENT',
      `UID:${ev.id}@ieumchurch.kr`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `SUMMARY:[이음교회] ${ev.title}`,
      `DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${ev.place}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${ev.title}.ics`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section id="calendar" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
              Church Calendar & Events
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              교회 일정 및 행사 캘린더
            </h2>
            <p className="mt-2 text-base text-slate-600">
              주일예배, 주중 기도회, 성경통독, 이음 바자회 등 교회의 모든 일정을 한눈에 확인하고 참여 신청하세요.
            </p>
          </div>

          {isEditor && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsAddEventOpen(true)}
                type="button"
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 hover:opacity-95 active:scale-98"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>새 일정 등록</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Bar & View Toggle */}
        <div className="bg-[#FAFBFD] p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-white rounded-xl border border-slate-200/70">
            {[
              { key: 'all', label: '전체 일정' },
              { key: 'worship', label: '예배·기도회' },
              { key: 'education', label: '교육·양육' },
              { key: 'fellowship', label: '친교·봉사' },
              { key: 'ministry', label: '사역·선교' },
              { key: 'special', label: '특별행사' }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  categoryFilter === cat.key
                    ? 'bg-sky-50 text-sky-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle & Today Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={goToday}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg shadow-xs"
            >
              이번 달
            </button>

            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('month')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  viewMode === 'month' ? 'bg-sky-50 text-sky-800 font-semibold shadow-xs' : 'text-slate-500'
                }`}
                title="달력 보기"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">월간</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-sky-50 text-sky-800 font-semibold shadow-xs' : 'text-slate-500'
                }`}
                title="목록 보기"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">목록</span>
              </button>
            </div>
          </div>

        </div>

        {/* Month View Component */}
        {viewMode === 'month' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Calendar Month Grid (lg:col-span-8) */}
            <div className="lg:col-span-8 bg-[#FAFBFD] rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
              
              {/* Month Navigation Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/70">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
                    {year}년 {month + 1}월
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    총 {filteredEvents.filter(e => e.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length}개의 일정
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    type="button"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-colors border border-slate-200/80 shadow-xs"
                    aria-label="이전 달"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    type="button"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-colors border border-slate-200/80 shadow-xs"
                    aria-label="다음 달"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                <span className="text-rose-500 py-1">일</span>
                <span className="py-1">월</span>
                <span className="py-1">화</span>
                <span className="py-1">수</span>
                <span className="py-1">목</span>
                <span className="py-1">금</span>
                <span className="text-sky-600 py-1">토</span>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {calendarDays.map((cell, idx) => {
                  const dayEvents = eventsByDate[cell.dateStr] || [];
                  const isSelected = selectedDateStr === cell.dateStr;
                  const isSunday = idx % 7 === 0;
                  const isSaturday = idx % 7 === 6;

                  return (
                    <div
                      key={cell.dateStr + idx}
                      onClick={() => setSelectedDateStr(cell.dateStr)}
                      className={`min-h-[82px] sm:min-h-[96px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/40 shadow-xs'
                          : cell.isCurrentMonth
                          ? 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/80'
                          : 'bg-slate-50/50 border-slate-100 opacity-40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-semibold font-mono ${
                            isSelected
                              ? 'text-sky-700 font-bold'
                              : isSunday
                              ? 'text-rose-500'
                              : isSaturday
                              ? 'text-sky-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {cell.dayNumber}
                        </span>

                        {dayEvents.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                        )}
                      </div>

                      {/* Event Snippets preview in cell */}
                      <div className="space-y-1 mt-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const badge = categoryLabels[ev.category];
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDateStr(cell.dateStr);
                                setSelectedEventForModal(ev);
                              }}
                              className={`text-[10px] sm:text-[11px] truncate px-1.5 py-0.5 rounded font-medium ${badge.bg} ${badge.text}`}
                              title={ev.title}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-slate-400 font-mono pl-1">
                            +{dayEvents.length - 2}개 더보기
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Selected Day Detail List & RSVP (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#FAFBFD] rounded-3xl border border-slate-200/90 shadow-xs p-6">
                
                {/* Header for Selected Date */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-semibold text-sky-700">선택된 날짜</span>
                    <h4 className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      {selectedDateStr}
                    </h4>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {selectedDayEvents.length}개 일정
                  </span>
                </div>

                {/* Events on this day */}
                {selectedDayEvents.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs">선택하신 날짜에 등록된 일정이 없습니다.</p>
                    <button
                      onClick={() => {
                        setNewDate(selectedDateStr);
                        setIsAddEventOpen(true);
                      }}
                      className="mt-3 px-3 py-1.5 text-xs text-sky-700 hover:bg-sky-50 rounded-lg font-medium transition-colors"
                    >
                      + 이 날짜에 일정 등록하기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {selectedDayEvents.map((ev) => {
                      const badge = categoryLabels[ev.category];
                      return (
                        <div
                          key={ev.id}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                            {ev.time && (
                              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {ev.time}
                              </span>
                            )}
                          </div>

                          <h5 className="text-sm font-bold text-slate-900 leading-snug">
                            {ev.title}
                          </h5>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {ev.description}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1 truncate max-w-[150px]">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{ev.place}</span>
                            </div>

                            <button
                              onClick={() => setSelectedEventForModal(ev)}
                              type="button"
                              className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-2"
                            >
                              자세히 / 참여신청
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Quick Highlight Strip */}
              <div className="p-5 bg-sky-50/60 rounded-3xl border border-sky-100">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>주요 행사 알림</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  성경통독학교 및 사랑의 나눔 바자회 참여 신청을 접수하고 있습니다. 일정을 클릭하여 구글 캘린더에 연동하고 사전 참여 신청을 완료하세요.
                </p>
              </div>

            </div>

          </div>
        ) : (
          /* List / Agenda View */
          <div className="bg-[#FAFBFD] rounded-3xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p className="text-sm">해당 카테고리의 일정이 없습니다.</p>
              </div>
            ) : (
              filteredEvents.map((ev) => {
                const badge = categoryLabels[ev.category];
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEventForModal(ev)}
                    className="p-5 sm:p-6 bg-white hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Date Badge */}
                      <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col items-center justify-center shrink-0 text-sky-800">
                        <span className="text-[11px] font-semibold uppercase">
                          {new Date(ev.date).toLocaleDateString('ko-KR', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold font-mono leading-none">
                          {ev.date.split('-')[2]}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                          {ev.time && (
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {ev.time}
                            </span>
                          )}
                          {ev.target && (
                            <span className="text-xs text-slate-500">
                              · 대상: {ev.target}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-slate-900 hover:text-sky-700 transition-colors">
                          {ev.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-1">
                          {ev.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ev.place}</span>
                      </div>
                      <button
                        type="button"
                        className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* EVENT DETAIL & RSVP MODAL */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${categoryLabels[selectedEventForModal.category].bg} ${categoryLabels[selectedEventForModal.category].text}`}>
                  {categoryLabels[selectedEventForModal.category].label}
                </span>
                <span className="text-xs font-mono text-slate-500">{selectedEventForModal.date}</span>
              </div>
              <button
                onClick={() => setSelectedEventForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {selectedEventForModal.title}
                </h3>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span><strong>시간:</strong> {selectedEventForModal.time || '종일 행사'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <span><strong>장소:</strong> {selectedEventForModal.place}</span>
                </div>
                {selectedEventForModal.target && (
                  <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
                    <Users className="w-4 h-4 text-sky-600 shrink-0" />
                    <span><strong>대상:</strong> {selectedEventForModal.target}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line py-1">
                {selectedEventForModal.description}
              </div>

              {/* Linked Post Button */}
              {selectedEventForModal.postId && (
                <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-sky-900">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>이 일정과 관련된 공식 게시글(주보/공지)이 있습니다.</span>
                  </div>
                  <button
                    onClick={() => {
                      const pid = selectedEventForModal.postId!;
                      setSelectedEventForModal(null);
                      if (onNavigateToPost) onNavigateToPost(pid);
                    }}
                    type="button"
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline"
                  >
                    게시글 보기
                  </button>
                </div>
              )}

              {/* External Calendar Sync Buttons */}
              <div className="pt-3 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  내 캘린더에 일정 저장하기
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={getGoogleCalendarUrl(selectedEventForModal)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>구글 캘린더에 추가</span>
                  </a>

                  <button
                    onClick={() => handleDownloadICS(selectedEventForModal)}
                    type="button"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>iCal (.ics) 파일 다운로드</span>
                  </button>
                </div>
              </div>

              {/* RSVP Form */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">
                    이 행사에 참여 신청하기 ({selectedEventForModal.rsvps?.length || 0}명 신청 중)
                  </span>
                </div>

                <form onSubmit={handleRSVPSubmit} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="신청자 성함 *"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                    <input
                      type="tel"
                      placeholder="연락처 (선택)"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {rsvpSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>신청이 접수되었습니다!</span>
                      </>
                    ) : (
                      <span>일정 참여 신청서 제출</span>
                    )}
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedEventForModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD NEW CALENDAR EVENT MODAL */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-lg font-bold text-slate-900">새로운 교회 일정 등록</h3>
                <p className="text-xs text-slate-500">교회 캘린더에 노출될 행사나 모임 일정을 추가합니다</p>
              </div>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  행사 / 일정 명칭 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 2026 이음 사랑의 바자회 또는 가을 특별기도회"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">날짜</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">시간</label>
                  <input
                    type="text"
                    placeholder="예: 오전 11:00 / 저녁 07:30"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">분류</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="worship">예배·기도회</option>
                    <option value="education">교육·양육</option>
                    <option value="fellowship">친교·봉사</option>
                    <option value="ministry">사역·선교</option>
                    <option value="special">특별행사</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">장소</label>
                  <input
                    type="text"
                    placeholder="예: 본당 3층 / 1층 카페"
                    value={newPlace}
                    onChange={(e) => setNewPlace(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">참석 대상</label>
                <input
                  type="text"
                  placeholder="예: 전교인 / 청년부 / 새가족"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">일정 상세 설명</label>
                <textarea
                  rows={3}
                  placeholder="행사 취지, 준비물, 프로그램 진행 내용 등을 작성하세요."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  캘린더에 일정 등록
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
