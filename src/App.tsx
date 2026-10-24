/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  initialTheme, 
  initialSchedules, 
  initialPosts, 
  initialSEOSettings, 
  initialCalendarEvents,
  initialCommunityStories,
  initialPrayers,
  pastorStudyImg 
} from './data/initialData';
import { ChurchTheme, PostItem, WorshipSchedule, SEOSettings, CalendarEvent, EventCategory, CommunityStory, PrayerRequest, PrayerCategory } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorshipScheduleSection } from './components/WorshipScheduleSection';
import { CalendarSection } from './components/CalendarSection';
import { SermonSection } from './components/SermonSection';
import { PrayerSection } from './components/PrayerSection';
import { BoardSection } from './components/BoardSection';
import { GallerySection } from './components/GallerySection';
import { NewFamilySection } from './components/NewFamilySection';
import { DirectionsSection } from './components/DirectionsSection';
import { Footer } from './components/Footer';
import { CustomizerModal } from './components/CustomizerModal';
import { SEOAndSocialModal } from './components/SEOAndSocialModal';
import { PostEditorModal } from './components/PostEditorModal';
import { PostDetailModal } from './components/PostDetailModal';
import { MissionPrayerModal } from './components/MissionPrayerModal';
import { ManagerAuthModal } from './components/ManagerAuthModal';
import { PermissionsModal } from './components/PermissionsModal';
import { useAuth } from './context/AuthContext';
import { db } from './lib/firebase';
import { doc, setDoc, onSnapshot, collection, deleteDoc } from 'firebase/firestore';

const migrateStories = (inputList: CommunityStory[]): CommunityStory[] => {
  return inputList.map((story) => {
    if (
      story.id === 'story-1' || 
      story.category === '성도 친교 & 카페' || 
      story.category === '성도친교&카페' ||
      story.category === '성도 친교' ||
      story.category === '친교모임'
    ) {
      return {
        ...story,
        category: '성도의 교제',
        imageUrl: '/assets/aistudio/_____e9823737.jpg'
      };
    }
    if (
      story.id === 'story-4' || 
      story.category === '목장모임 & 양육' || 
      story.category === '목장모임&양육'
    ) {
      return {
        ...story,
        category: '목장모임',
        imageUrl: '/assets/aistudio/_____ce1030c5.jpg'
      };
    }
    return story;
  });
};

export default function App() {
  const { currentManager, masterPasscode } = useAuth();
  const isSavingLocallyRef = useRef(false);

  // Theme state with LocalStorage persistence - cleanly merges saved custom settings without overwriting
  const [theme, setTheme] = useState<ChurchTheme>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialTheme,
          ...parsed
        };
      }
      return initialTheme;
    } catch {
      return initialTheme;
    }
  });

  // Worship schedules
  const [schedules, setSchedules] = useState<WorshipSchedule[]>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_schedules_v3');
      if (saved) return JSON.parse(saved);
      return initialSchedules;
    } catch {
      return initialSchedules;
    }
  });

  // Posts & Bulletins & Sermons list
  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_posts_v3');
      if (saved) {
        const parsed: PostItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialPosts;
    } catch {
      return initialPosts;
    }
  });

  // Community Stories state (이음공동체 이야기)
  const [stories, setStories] = useState<CommunityStory[]>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_community_stories');
      if (saved) {
        const parsed: CommunityStory[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return migrateStories(parsed);
      }
      return initialCommunityStories;
    } catch {
      return initialCommunityStories;
    }
  });

  // SEO settings
  const [seoSettings, setSEOSettings] = useState<SEOSettings>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_seo');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSEOSettings,
          ...parsed,
          socialLinks: {
            ...initialSEOSettings.socialLinks,
            ...(parsed.socialLinks || {})
          }
        };
      }
      return initialSEOSettings;
    } catch {
      return initialSEOSettings;
    }
  });

  // Calendar Events state
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialCalendarEvents;
    } catch {
      return initialCalendarEvents;
    }
  });

  // Intercessory Prayer requests state
  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_prayers');
      if (saved) {
        const parsed: PrayerRequest[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialPrayers;
    } catch {
      return initialPrayers;
    }
  });

  // Modals state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSEOOpen, setIsSEOOpen] = useState(false);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [isNewFamilyModalOpen, setIsNewFamilyModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [selectedMissionFieldId, setSelectedMissionFieldId] = useState<string>('cambodia');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  // Real-time synchronization from Firestore cloud database (main document + prayers collection)
  useEffect(() => {
    let isMounted = true;
    
    // 1. Sync church configurations and data
    const unsubMain = onSnapshot(
      doc(db, 'church_data', 'main'),
      (docSnap) => {
        if (!isMounted || !docSnap.exists() || isSavingLocallyRef.current) return;
        const data = docSnap.data();
        if (data.theme) {
          setTheme((prev) => ({ ...prev, ...data.theme }));
          try { localStorage.setItem('ieum_church_theme', JSON.stringify(data.theme)); } catch {}
        }
        if (Array.isArray(data.schedules) && data.schedules.length > 0) {
          setSchedules(data.schedules);
          try { localStorage.setItem('ieum_church_schedules_v3', JSON.stringify(data.schedules)); } catch {}
        }
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
          try { localStorage.setItem('ieum_church_posts_v3', JSON.stringify(data.posts)); } catch {}
        }
        if (Array.isArray(data.stories) && data.stories.length > 0) {
          const migrated = migrateStories(data.stories);
          setStories(migrated);
          try { localStorage.setItem('ieum_church_community_stories', JSON.stringify(migrated)); } catch {}
        }
        if (Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
          try { localStorage.setItem('ieum_church_events', JSON.stringify(data.events)); } catch {}
        }
        if (data.seoSettings) {
          setSEOSettings(data.seoSettings);
          try { localStorage.setItem('ieum_church_seo', JSON.stringify(data.seoSettings)); } catch {}
        }
        if (Array.isArray(data.prayers) && data.prayers.length > 0) {
          setPrayers(data.prayers);
          try { localStorage.setItem('ieum_church_prayers', JSON.stringify(data.prayers)); } catch {}
        }
      },
      (error) => {
        console.warn('Firestore real-time sync listener info:', error);
      }
    );

    // 2. Real-time listener on /prayers collection for atomic count and encouragement updates
    const unsubPrayers = onSnapshot(
      collection(db, 'prayers'),
      (querySnap) => {
        if (!isMounted || querySnap.empty || isSavingLocallyRef.current) return;
        const remotePrayers: PrayerRequest[] = [];
        querySnap.forEach((d) => {
          remotePrayers.push(d.data() as PrayerRequest);
        });
        if (remotePrayers.length > 0) {
          setPrayers(remotePrayers);
          try { localStorage.setItem('ieum_church_prayers', JSON.stringify(remotePrayers)); } catch {}
        }
      },
      (err) => {
        console.warn('Firestore prayers collection listener notice:', err);
      }
    );

    return () => {
      isMounted = false;
      unsubMain();
      unsubPrayers();
    };
  }, []);

  // Save church data both to LocalStorage and Firestore Cloud Database
  const saveChurchDataToCloudAndLocal = async (overrides?: {
    theme?: ChurchTheme;
    schedules?: WorshipSchedule[];
    posts?: PostItem[];
    stories?: CommunityStory[];
    events?: CalendarEvent[];
    seoSettings?: SEOSettings;
    prayers?: PrayerRequest[];
  }) => {
    isSavingLocallyRef.current = true;
    const targetTheme = overrides?.theme || theme;
    const targetSchedules = overrides?.schedules || schedules;
    const targetPosts = overrides?.posts || posts;
    const targetStories = overrides?.stories || stories;
    const targetEvents = overrides?.events || events;
    const targetSEO = overrides?.seoSettings || seoSettings;
    const targetPrayers = overrides?.prayers || prayers;

    // 1. Immediately persist to localStorage
    try {
      localStorage.setItem('ieum_church_theme', JSON.stringify(targetTheme));
      localStorage.setItem('ieum_church_schedules_v3', JSON.stringify(targetSchedules));
      localStorage.setItem('ieum_church_posts_v3', JSON.stringify(targetPosts));
      localStorage.setItem('ieum_church_community_stories', JSON.stringify(targetStories));
      localStorage.setItem('ieum_church_events', JSON.stringify(targetEvents));
      localStorage.setItem('ieum_church_seo', JSON.stringify(targetSEO));
      localStorage.setItem('ieum_church_prayers', JSON.stringify(targetPrayers));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }

    // 2. Persist to Firestore Cloud Database
    try {
      const payload = {
        theme: targetTheme,
        schedules: targetSchedules,
        posts: targetPosts,
        stories: targetStories,
        events: targetEvents,
        seoSettings: targetSEO,
        prayers: targetPrayers,
        updatedAt: new Date().toISOString(),
        updatedBy: currentManager?.email || 'jyounghuny@gmail.com',
        adminKey: masterPasscode || 'ieum2026!'
      };
      await setDoc(doc(db, 'church_data', 'main'), payload);
    } catch (err) {
      console.warn('Firestore cloud save notice:', err);
    } finally {
      setTimeout(() => {
        isSavingLocallyRef.current = false;
      }, 1000);
    }
  };

  const handleOpenMissionModal = (fieldId?: string) => {
    if (fieldId) setSelectedMissionFieldId(fieldId);
    setIsMissionModalOpen(true);
  };

  const handleSaveWebsite = async () => {
    await saveChurchDataToCloudAndLocal();
    setSaveToast('이음교회 홈페이지 수정 내용이 실시간 클라우드 및 모든 방문자 기기에 안전하게 저장되었습니다!');
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleUpdateTheme = (updatedTheme: ChurchTheme) => {
    setTheme(updatedTheme);
    saveChurchDataToCloudAndLocal({ theme: updatedTheme });
  };

  const handleUpdateSchedules = (updatedSchedules: WorshipSchedule[]) => {
    setSchedules(updatedSchedules);
    saveChurchDataToCloudAndLocal({ schedules: updatedSchedules });
  };

  const handleUpdateSEO = (updatedSEO: SEOSettings) => {
    setSEOSettings(updatedSEO);
    saveChurchDataToCloudAndLocal({ seoSettings: updatedSEO });
  };

  const handleUpdateStories = (updatedStories: CommunityStory[]) => {
    setStories(updatedStories);
    saveChurchDataToCloudAndLocal({ stories: updatedStories });
  };

  // Handle saving (creating or updating) a post + Calendar auto-sync
  const handleSavePost = (
    postData: Omit<PostItem, 'id' | 'views' | 'likes' | 'comments'>,
    editingId?: string,
    syncToCalendar?: boolean,
    calendarData?: {
      date: string;
      time: string;
      place: string;
      category: EventCategory;
      target: string;
    }
  ) => {
    const postId = editingId || 'post_' + Date.now();
    let updatedPosts: PostItem[] = [];

    if (editingId) {
      updatedPosts = posts.map((p) =>
        p.id === editingId
          ? {
              ...p,
              ...postData
            }
          : p
      );
      if (selectedPost && selectedPost.id === editingId) {
        setSelectedPost((prev) => (prev ? { ...prev, ...postData } : null));
      }
    } else {
      const newPost: PostItem = {
        id: postId,
        ...postData,
        views: 1,
        likes: 0,
        comments: []
      };
      updatedPosts = [newPost, ...posts];
    }
    setPosts(updatedPosts);

    let updatedEvents = events;
    // Auto sync to Calendar if requested
    if (syncToCalendar && calendarData) {
      const linkedEventId = 'evt-post-' + postId;
      const newEvent: CalendarEvent = {
        id: linkedEventId,
        title: postData.title,
        description: postData.content,
        date: calendarData.date,
        time: calendarData.time,
        place: calendarData.place,
        category: calendarData.category,
        target: calendarData.target,
        postId: postId,
        isHighlight: true
      };
      const filtered = events.filter((e) => e.id !== linkedEventId && e.postId !== postId);
      updatedEvents = [newEvent, ...filtered];
      setEvents(updatedEvents);
    }

    setEditingPost(null);
    saveChurchDataToCloudAndLocal({ posts: updatedPosts, events: updatedEvents });
  };

  const handleUpdateSermon = (updatedSermon: PostItem) => {
    const exists = posts.some((p) => p.id === updatedSermon.id);
    const updatedPosts = exists
      ? posts.map((p) => (p.id === updatedSermon.id ? updatedSermon : p))
      : [updatedSermon, ...posts];

    setPosts(updatedPosts);
    if (selectedPost && selectedPost.id === updatedSermon.id) {
      setSelectedPost(updatedSermon);
    }
    saveChurchDataToCloudAndLocal({ posts: updatedPosts });
  };

  const handleAddCalendarEvent = (newEventData: Omit<CalendarEvent, 'id' | 'rsvps'>) => {
    const newEvent: CalendarEvent = {
      id: 'evt_' + Date.now(),
      ...newEventData,
      rsvps: []
    };
    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    saveChurchDataToCloudAndLocal({ events: updatedEvents });
  };

  const handleRSVP = (eventId: string, name: string, phone?: string) => {
    const newRsvp = {
      id: 'rsvp_' + Date.now(),
      name,
      phone,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const updatedEvents = events.map((ev) =>
      ev.id === eventId
        ? {
            ...ev,
            rsvps: [...(ev.rsvps || []), newRsvp]
          }
        : ev
    );
    setEvents(updatedEvents);
    saveChurchDataToCloudAndLocal({ events: updatedEvents });
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter((p) => p.id !== postId);
    const updatedEvents = events.filter((ev) => ev.postId !== postId);
    setPosts(updatedPosts);
    setEvents(updatedEvents);
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
    saveChurchDataToCloudAndLocal({ posts: updatedPosts, events: updatedEvents });
  };

  const handleLikePost = (postId: string) => {
    const updatedPosts = posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    setPosts(updatedPosts);
    if (selectedPost?.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
    saveChurchDataToCloudAndLocal({ posts: updatedPosts });
  };

  const handleAddComment = (postId: string, author: string, content: string) => {
    const newComment = {
      id: 'cmt_' + Date.now(),
      author,
      content,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    };

    const updatedPosts = posts.map((p) =>
      p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
    );
    setPosts(updatedPosts);

    if (selectedPost?.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), newComment]
            }
          : null
      );
    }
    saveChurchDataToCloudAndLocal({ posts: updatedPosts });
  };

  // Intercessory Prayer Handlers
  const handlePray = async (prayerId: string) => {
    const updatedPrayers = prayers.map((p) =>
      p.id === prayerId ? { ...p, prayerCount: (p.prayerCount || 0) + 1 } : p
    );
    setPrayers(updatedPrayers);
    try {
      localStorage.setItem('ieum_church_prayers', JSON.stringify(updatedPrayers));
    } catch {}

    try {
      const currentPrayer = updatedPrayers.find((p) => p.id === prayerId);
      if (currentPrayer) {
        await setDoc(doc(db, 'prayers', prayerId), currentPrayer, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore direct prayer update notice:', e);
    }

    saveChurchDataToCloudAndLocal({ prayers: updatedPrayers });
  };

  const handleAddPrayer = async (
    newPrayerData: Omit<PrayerRequest, 'id' | 'prayerCount' | 'createdAt' | 'encouragements'>
  ) => {
    const newId = 'prayer-' + Date.now();
    const newPrayer: PrayerRequest = {
      id: newId,
      ...newPrayerData,
      prayerCount: 1,
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      encouragements: []
    };

    const updatedPrayers = [newPrayer, ...prayers];
    setPrayers(updatedPrayers);
    try {
      localStorage.setItem('ieum_church_prayers', JSON.stringify(updatedPrayers));
    } catch {}

    try {
      await setDoc(doc(db, 'prayers', newId), newPrayer);
    } catch (e) {
      console.warn('Firestore set prayer document notice:', e);
    }

    saveChurchDataToCloudAndLocal({ prayers: updatedPrayers });
  };

  const handleAddEncouragement = async (
    prayerId: string,
    message: string,
    author: string,
    isAnonymous: boolean
  ) => {
    const newEnc = {
      id: 'enc-' + Date.now(),
      author,
      isAnonymous,
      message,
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    };

    const updatedPrayers = prayers.map((p) =>
      p.id === prayerId
        ? {
            ...p,
            encouragements: [...(p.encouragements || []), newEnc]
          }
        : p
    );

    setPrayers(updatedPrayers);
    try {
      localStorage.setItem('ieum_church_prayers', JSON.stringify(updatedPrayers));
    } catch {}

    try {
      const currentPrayer = updatedPrayers.find((p) => p.id === prayerId);
      if (currentPrayer) {
        await setDoc(doc(db, 'prayers', prayerId), currentPrayer, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore encouragement update notice:', e);
    }

    saveChurchDataToCloudAndLocal({ prayers: updatedPrayers });
  };

  const handleMarkAnswered = async (prayerId: string, testimony?: string) => {
    const updatedPrayers = prayers.map((p) =>
      p.id === prayerId
        ? {
            ...p,
            isAnswered: true,
            category: 'answered' as PrayerCategory,
            answeredTestimony: testimony || p.answeredTestimony
          }
        : p
    );

    setPrayers(updatedPrayers);
    try {
      localStorage.setItem('ieum_church_prayers', JSON.stringify(updatedPrayers));
    } catch {}

    try {
      const currentPrayer = updatedPrayers.find((p) => p.id === prayerId);
      if (currentPrayer) {
        await setDoc(doc(db, 'prayers', prayerId), currentPrayer, { merge: true });
      }
    } catch (e) {}

    saveChurchDataToCloudAndLocal({ prayers: updatedPrayers });
  };

  const handleDeletePrayer = async (prayerId: string) => {
    const updatedPrayers = prayers.filter((p) => p.id !== prayerId);
    setPrayers(updatedPrayers);
    try {
      localStorage.setItem('ieum_church_prayers', JSON.stringify(updatedPrayers));
    } catch {}

    try {
      await deleteDoc(doc(db, 'prayers', prayerId));
    } catch (e) {}

    saveChurchDataToCloudAndLocal({ prayers: updatedPrayers });
  };

  const handleOpenEdit = (post: PostItem) => {
    setEditingPost(post);
    setIsPostEditorOpen(true);
  };

  const handleResetTheme = async () => {
    setTheme(initialTheme);
    setSchedules(initialSchedules);
    setPosts(initialPosts);
    setSEOSettings(initialSEOSettings);
    setEvents(initialCalendarEvents);
    setStories(initialCommunityStories);
    setPrayers(initialPrayers);
    try {
      localStorage.removeItem('ieum_church_theme');
      localStorage.removeItem('ieum_church_schedules_v3');
      localStorage.removeItem('ieum_church_posts_v3');
      localStorage.removeItem('ieum_church_seo');
      localStorage.removeItem('ieum_church_events');
      localStorage.removeItem('ieum_church_community_stories');
      localStorage.removeItem('ieum_church_prayers');
    } catch {}
    await saveChurchDataToCloudAndLocal({
      theme: initialTheme,
      schedules: initialSchedules,
      posts: initialPosts,
      seoSettings: initialSEOSettings,
      events: initialCalendarEvents,
      stories: initialCommunityStories,
      prayers: initialPrayers
    });
    setSaveToast('모든 설정이 기본 초기 상태로 재설정되었습니다.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Determine background tone color code
  const getBgColor = () => {
    switch (theme.bgTone) {
      case 'pure': return '#FFFFFF';
      case 'cool': return '#F8FAFC';
      case 'cream': return '#FDFCF7';
      case 'warm':
      default:
        return '#FAFBFD';
    }
  };

  // Determine font family utility class
  const getFontClass = () => {
    switch (theme.fontFamily) {
      case 'serif': return 'font-serif-kr';
      default: return 'font-sans-kr';
    }
  };

  // Extract sermons for SermonSection
  const sermons = posts.filter((p) => p.category === 'sermon');
  const displaySermons = sermons.length > 0 ? sermons : posts.slice(0, 3);

  return (
    <div
      className={`min-h-screen text-slate-800 transition-colors ${getFontClass()}`}
      style={{
        backgroundColor: getBgColor(),
        // Pass primary color as CSS variable
        ['--primary' as any]: theme.primaryColor
      }}
    >
      {/* 3-Zone Top Bar */}
      <Navbar
        theme={theme}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenSEO={() => setIsSEOOpen(true)}
        onOpenNewPost={() => {
          setEditingPost(null);
          setIsPostEditorOpen(true);
        }}
        onOpenNewFamilyModal={() => setIsNewFamilyModalOpen(true)}
        onSaveWebsite={handleSaveWebsite}
        onOpenMissionModal={handleOpenMissionModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenPermissionsModal={() => setIsPermissionsModalOpen(true)}
      />

      {/* Floating Save Toast Banner */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-white">이음교회 홈페이지 저장 완료</p>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">{saveToast}</p>
          </div>
        </div>
      )}

      {/* Main Content Sections according to visibleSections toggle */}
      <main>
        {theme.visibleSections.hero && (
          <HeroSection
            theme={theme}
            onOpenNewFamily={() => setIsNewFamilyModalOpen(true)}
            onWorshipClick={() => {
              const el = document.getElementById('worship');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onCalendarClick={() => {
              const el = document.getElementById('calendar');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onSermonClick={() => {
              const el = document.getElementById('sermon');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {theme.visibleSections.about && (
          <AboutSection theme={theme} />
        )}

        {theme.visibleSections.worship && (
          <WorshipScheduleSection
            theme={theme}
            schedules={schedules}
            onOpenSEO={() => setIsSEOOpen(true)}
            youtubeUrl={seoSettings.socialLinks.youtube || 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg'}
          />
        )}

        {theme.visibleSections.calendar && (
          <CalendarSection
            theme={theme}
            events={events}
            onAddEvent={handleAddCalendarEvent}
            onRSVP={handleRSVP}
            onNavigateToPost={(postId) => {
              const found = posts.find((p) => p.id === postId);
              if (found) {
                setSelectedPost(found);
              }
              const boardEl = document.getElementById('board');
              if (boardEl) boardEl.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {theme.visibleSections.sermon && (
          <SermonSection
            theme={theme}
            sermons={displaySermons}
            onOpenSermonPost={(post) => setSelectedPost(post)}
            onOpenSEO={() => setIsSEOOpen(true)}
            onUpdateSermon={handleUpdateSermon}
            youtubeUrl={seoSettings.socialLinks.youtube}
          />
        )}

        {theme.visibleSections.prayer !== false && (
          <PrayerSection
            theme={theme}
            prayers={prayers}
            onAddPrayer={handleAddPrayer}
            onPray={handlePray}
            onAddEncouragement={handleAddEncouragement}
            onMarkAnswered={handleMarkAnswered}
            onDeletePrayer={handleDeletePrayer}
          />
        )}

        {theme.visibleSections.posts && (
          <BoardSection
            theme={theme}
            posts={posts}
            onOpenNewPost={() => {
              setEditingPost(null);
              setIsPostEditorOpen(true);
            }}
            onSelectPost={(post) => setSelectedPost(post)}
            onEditPost={handleOpenEdit}
            onDeletePost={handleDeletePost}
            onOpenMissionModal={handleOpenMissionModal}
          />
        )}

        {theme.visibleSections.gallery && (
          <GallerySection 
            theme={theme} 
            stories={stories} 
            onUpdateStories={handleUpdateStories} 
          />
        )}

        {theme.visibleSections.newFamily && (
          <NewFamilySection
            theme={theme}
            isModalOpen={isNewFamilyModalOpen}
            onCloseModal={() => setIsNewFamilyModalOpen(false)}
            onOpenModal={() => setIsNewFamilyModalOpen(true)}
          />
        )}

        {theme.visibleSections.directions && (
          <DirectionsSection theme={theme} />
        )}
      </main>

      {/* Footer */}
      <Footer
        theme={theme}
        seoSettings={seoSettings}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenSEO={() => setIsSEOOpen(true)}
        onOpenNewPost={() => {
          setEditingPost(null);
          setIsPostEditorOpen(true);
        }}
      />

      {/* Modals */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        theme={theme}
        onUpdateTheme={handleUpdateTheme}
        onResetTheme={handleResetTheme}
        schedules={schedules}
        onUpdateSchedules={handleUpdateSchedules}
      />

      <SEOAndSocialModal
        isOpen={isSEOOpen}
        onClose={() => setIsSEOOpen(false)}
        seoSettings={seoSettings}
        onUpdateSEO={handleUpdateSEO}
        theme={theme}
      />

      <PostEditorModal
        isOpen={isPostEditorOpen}
        onClose={() => {
          setIsPostEditorOpen(false);
          setEditingPost(null);
        }}
        onSavePost={handleSavePost}
        editingPost={editingPost}
        theme={theme}
      />

      <PostDetailModal
        isOpen={!!selectedPost}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onLike={handleLikePost}
        onAddComment={handleAddComment}
        onEdit={(post) => {
          setSelectedPost(null);
          handleOpenEdit(post);
        }}
        onDelete={handleDeletePost}
        theme={theme}
        onOpenMissionModal={handleOpenMissionModal}
      />

      <MissionPrayerModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        theme={theme}
        initialFieldId={selectedMissionFieldId}
      />

      <ManagerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        theme={theme}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
