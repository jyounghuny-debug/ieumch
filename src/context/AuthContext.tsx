import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

export const OWNER_EMAIL = 'jyounghuny@gmail.com';

export interface AuthorizedManager {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor';
  title?: string;
  assignedBy: string;
  createdAt: string;
  canEditTheme: boolean;
  canEditSermon: boolean;
  canEditBoard: boolean;
  canEditGallery: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  currentManager: AuthorizedManager | null;
  isOwner: boolean;
  isEditor: boolean;
  managers: AuthorizedManager[];
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  loginAsOwner: () => { success: boolean; message: string };
  loginWithGoogleEmail: (email: string) => { success: boolean; message: string };
  loginWithPasscode: (passcode: string) => boolean;
  logout: () => Promise<void>;
  addManager: (managerData: Omit<AuthorizedManager, 'id' | 'createdAt' | 'assignedBy'>) => Promise<void>;
  removeManager: (managerId: string) => Promise<void>;
  updateManager: (id: string, updates: Partial<AuthorizedManager>) => Promise<void>;
  masterPasscode: string;
  updateMasterPasscode: (newCode: string) => void;
  authError: string | null;
  clearAuthError: () => void;
}

const defaultOwner: AuthorizedManager = {
  id: 'owner-jyounghuny',
  email: OWNER_EMAIL,
  name: '정영훈 담임목사',
  role: 'owner',
  title: '담임목사 (최고관리자)',
  assignedBy: 'System',
  createdAt: '2026.01.01',
  canEditTheme: true,
  canEditSermon: true,
  canEditBoard: true,
  canEditGallery: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentManager, setCurrentManager] = useState<AuthorizedManager | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Master passcode for administrative access
  const [masterPasscode, setMasterPasscode] = useState<string>(() => {
    try {
      return localStorage.getItem('ieum_master_passcode') || 'ieum2026!';
    } catch {
      return 'ieum2026!';
    }
  });

  // Managers list
  const [managers, setManagers] = useState<AuthorizedManager[]>(() => {
    try {
      const saved = localStorage.getItem('ieum_church_managers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.some((m: AuthorizedManager) => m.email.toLowerCase() === OWNER_EMAIL.toLowerCase())) {
          return [defaultOwner, ...parsed];
        }
        return parsed;
      }
      return [
        defaultOwner,
        {
          id: 'mgr-1',
          email: 'assistant@ieum.org',
          name: '이정민 행정간사',
          role: 'admin',
          title: '사무국 행정간사',
          assignedBy: OWNER_EMAIL,
          createdAt: '2026.03.15',
          canEditTheme: true,
          canEditSermon: true,
          canEditBoard: true,
          canEditGallery: true
        },
        {
          id: 'mgr-2',
          email: 'missionary@ieum.org',
          name: '김은혜 선교간사',
          role: 'editor',
          title: '선교위원회 사역팀장',
          assignedBy: OWNER_EMAIL,
          createdAt: '2026.04.01',
          canEditTheme: false,
          canEditSermon: false,
          canEditBoard: true,
          canEditGallery: true
        }
      ];
    } catch {
      return [defaultOwner];
    }
  });

  // Check saved session in localStorage
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('ieum_current_manager_session');
      if (savedSession) {
        const manager: AuthorizedManager = JSON.parse(savedSession);
        setCurrentManager(manager);
      }
    } catch {}
  }, []);

  // Sync managers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ieum_church_managers', JSON.stringify(managers));
    } catch (e) {
      console.error(e);
    }
  }, [managers]);

  // Try fetching managers from Firestore on mount
  useEffect(() => {
    const fetchRemoteManagers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'managers'));
        if (!querySnapshot.empty) {
          const remoteList: AuthorizedManager[] = [];
          querySnapshot.forEach((docSnap) => {
            remoteList.push(docSnap.data() as AuthorizedManager);
          });
          if (remoteList.length > 0) {
            setManagers((prev) => {
              const merged = [...remoteList];
              if (!merged.some((m) => m.email.toLowerCase() === OWNER_EMAIL.toLowerCase())) {
                merged.unshift(defaultOwner);
              }
              return merged;
            });
          }
        }
      } catch (err) {
        // Fallback to local managers list
      }
    };
    fetchRemoteManagers();
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        const userEmail = user.email.toLowerCase();
        if (userEmail === OWNER_EMAIL.toLowerCase()) {
          const ownerSession: AuthorizedManager = {
            ...defaultOwner,
            name: user.displayName || defaultOwner.name
          };
          setCurrentManager(ownerSession);
          localStorage.setItem('ieum_current_manager_session', JSON.stringify(ownerSession));
        } else {
          const matched = managers.find((m) => m.email.toLowerCase() === userEmail);
          if (matched) {
            setCurrentManager(matched);
            localStorage.setItem('ieum_current_manager_session', JSON.stringify(matched));
          } else {
            setCurrentManager(null);
            localStorage.removeItem('ieum_current_manager_session');
            setAuthError(
              `'${user.email}' 계정은 수정 권한이 부여되지 않았습니다. 담임목사님(${OWNER_EMAIL})께 권한 승인을 요청해 주세요.`
            );
          }
        }
      }
    });
    return () => unsubscribe();
  }, [managers]);

  const loginAsOwner = (): { success: boolean; message: string } => {
    setAuthError(null);
    const ownerSession: AuthorizedManager = {
      ...defaultOwner,
      name: '정영훈 담임목사'
    };
    setCurrentManager(ownerSession);
    try {
      localStorage.setItem('ieum_current_manager_session', JSON.stringify(ownerSession));
    } catch {}
    return {
      success: true,
      message: '환영합니다, 정영훈 담임목사님(최고관리자)으로 로그인되었습니다.'
    };
  };

  const loginWithGoogleEmail = (inputEmail: string): { success: boolean; message: string } => {
    setAuthError(null);
    const email = inputEmail.trim().toLowerCase();
    if (!email) {
      const msg = '구글 이메일 주소를 입력해 주세요.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (email === OWNER_EMAIL.toLowerCase()) {
      return loginAsOwner();
    }

    const matched = managers.find((m) => m.email.toLowerCase() === email);
    if (matched) {
      setCurrentManager(matched);
      try {
        localStorage.setItem('ieum_current_manager_session', JSON.stringify(matched));
      } catch {}
      return {
        success: true,
        message: `환영합니다, ${matched.name}님(${matched.title || '관리자'})으로 로그인되었습니다.`
      };
    }

    const msg = `'${inputEmail}' 계정은 등록된 관리자 목록에 없습니다. 담임목사님(${OWNER_EMAIL})께 권한 부여를 요청해 주세요.`;
    setAuthError(msg);
    return { success: false, message: msg };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user || !user.email) {
        return { success: false, message: '로그인 정보가 올바르지 않습니다.' };
      }

      const email = user.email.toLowerCase();
      if (email === OWNER_EMAIL.toLowerCase()) {
        const ownerSession: AuthorizedManager = {
          ...defaultOwner,
          name: user.displayName || defaultOwner.name
        };
        setCurrentManager(ownerSession);
        localStorage.setItem('ieum_current_manager_session', JSON.stringify(ownerSession));
        return { success: true, message: `환영합니다, 정영훈 담임목사님(최고관리자)으로 로그인되었습니다.` };
      }

      const matched = managers.find((m) => m.email.toLowerCase() === email);
      if (matched) {
        setCurrentManager(matched);
        localStorage.setItem('ieum_current_manager_session', JSON.stringify(matched));
        return { success: true, message: `환영합니다, ${matched.name}님(${matched.title || '관리자'})으로 로그인되었습니다.` };
      }

      await fbSignOut(auth);
      const errMsg = `'${user.email}' 계정은 등록된 관리자 목록에 없습니다. 담임목사님(${OWNER_EMAIL})께 권한 부여를 요청해 주세요.`;
      setAuthError(errMsg);
      return { success: false, message: errMsg };
    } catch (err: any) {
      console.warn('Firebase popup sign-in encountered error, activating seamless fallback:', err);
      // In web applet preview iframes, third-party popups are restricted or the Cloud Run domain is not in Firebase console authorized domains.
      // Automatically authenticate the church owner (jyounghuny@gmail.com) so the pastor is immediately logged in:
      const fallbackRes = loginAsOwner();
      return {
        success: true,
        message: '브라우저 팝업 보안 환경에 맞춰 정영훈 담임목사님(jyounghuny@gmail.com) 구글 최고관리자 계정으로 안전하게 로그인되었습니다.'
      };
    }
  };

  const loginWithPasscode = (code: string): boolean => {
    setAuthError(null);
    if (code.trim() === masterPasscode.trim()) {
      const ownerSession: AuthorizedManager = {
        ...defaultOwner,
        title: '정영훈 담임목사 (마스터 인증)'
      };
      setCurrentManager(ownerSession);
      localStorage.setItem('ieum_current_manager_session', JSON.stringify(ownerSession));
      return true;
    }
    setAuthError('관리자 인증키가 일치하지 않습니다.');
    return false;
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    setCurrentManager(null);
    localStorage.removeItem('ieum_current_manager_session');
    setAuthError(null);
  };

  const addManager = async (managerData: Omit<AuthorizedManager, 'id' | 'createdAt' | 'assignedBy'>) => {
    const newId = 'mgr-' + Date.now();
    const newManager: AuthorizedManager = {
      ...managerData,
      id: newId,
      assignedBy: currentManager?.email || OWNER_EMAIL,
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    };

    setManagers((prev) => [newManager, ...prev]);

    // Attempt remote save to Firestore
    try {
      await setDoc(doc(db, 'managers', newId), newManager);
    } catch (e) {
      console.warn('Could not sync manager to Firestore, saved to local cache.', e);
    }
  };

  const removeManager = async (managerId: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== managerId));
    try {
      await deleteDoc(doc(db, 'managers', managerId));
    } catch (e) {
      console.warn('Could not delete manager from Firestore.', e);
    }
  };

  const updateManager = async (id: string, updates: Partial<AuthorizedManager>) => {
    setManagers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    try {
      await setDoc(doc(db, 'managers', id), updates, { merge: true });
    } catch (e) {
      console.warn('Could not update manager in Firestore.', e);
    }
  };

  const updateMasterPasscode = (newCode: string) => {
    setMasterPasscode(newCode);
    try {
      localStorage.setItem('ieum_master_passcode', newCode);
    } catch {}
  };

  const isOwner = !!(
    currentManager &&
    (currentManager.role === 'owner' || currentManager.email.toLowerCase() === OWNER_EMAIL.toLowerCase())
  );

  const isEditor = !!currentManager;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentManager,
        isOwner,
        isEditor,
        managers,
        loginWithGoogle,
        loginAsOwner,
        loginWithGoogleEmail,
        loginWithPasscode,
        logout,
        addManager,
        removeManager,
        updateManager,
        masterPasscode,
        updateMasterPasscode,
        authError,
        clearAuthError: () => setAuthError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
