import React, { useState } from 'react';
import { useAuth, OWNER_EMAIL, AuthorizedManager } from '../context/AuthContext';
import { X, ShieldCheck, UserPlus, Trash2, Key, Check, Users, Sparkles, AlertCircle, Edit, Lock } from 'lucide-react';
import { ChurchTheme } from '../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ChurchTheme;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  const { managers, addManager, removeManager, isOwner, masterPasscode, updateMasterPasscode } = useAuth();
  
  // New Manager Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');
  const [canEditTheme, setCanEditTheme] = useState(false);
  const [canEditSermon, setCanEditSermon] = useState(true);
  const [canEditBoard, setCanEditBoard] = useState(true);
  const [canEditGallery, setCanEditGallery] = useState(true);
  const [newPasscode, setNewPasscode] = useState(masterPasscode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      alert('이메일과 성함을 모두 입력해 주세요.');
      return;
    }

    if (managers.some((m) => m.email.toLowerCase() === email.trim().toLowerCase())) {
      alert('이미 권한이 부여된 이메일 계정입니다.');
      return;
    }

    await addManager({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      title: title.trim() || (role === 'admin' ? '사역 관리자' : '게시판 편집자'),
      role,
      canEditTheme: role === 'admin' ? true : canEditTheme,
      canEditSermon,
      canEditBoard,
      canEditGallery
    });

    setEmail('');
    setName('');
    setTitle('');
    setToastMessage(`${name}님에게 수정 권한이 성공적으로 부여되었습니다.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) return;
    updateMasterPasscode(newPasscode.trim());
    setToastMessage('교회 마스터 관리자 인증키가 변경되었습니다.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  Access Control Management
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                  수정 권한 관리 센터
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                홈페이지 수정 권한 부여 및 관리
              </h3>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Top Notice */}
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sky-950 mb-0.5">
                정영훈 담임목사님({OWNER_EMAIL}) 및 승인된 관리자만 홈페이지를 수정할 수 있습니다
              </p>
              이 목록에 등록된 이메일 계정으로 로그인한 사역자에게만 디자인 설정, 설교 및 영상 설명 수정, 소식 작성, 갤러리 관리 버튼이 나타납니다. 일반 성도 및 외부 방문자에게는 편집 버튼이 일체 노출되지 않습니다.
            </div>
          </div>

          {/* Section 1: Add New Authorized Manager Form */}
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-sky-600" />
              <h4 className="text-sm font-bold text-slate-900">
                새 관리자(사역자/간사/부서장) 권한 부여하기
              </h4>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Google 이메일 계정 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="예: associate@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    성함 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 홍길동 부목사 / 김은혜 간사"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    직분 및 담당 사역
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 청년부 디렉터 / 선교팀장"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Role & Specific Permission Checkboxes */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <span className="font-bold text-slate-700">관리 등급:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="role"
                      checked={role === 'editor'}
                      onChange={() => setRole('editor')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>사역 편집자 (설교, 소식, 갤러리 수정 가능)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="role"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>전체 관리자 (디자인 및 전체 설정 포함)</span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-4 text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <span className="font-bold text-slate-700">상세 권한:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canEditSermon}
                      onChange={(e) => setCanEditSermon(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span>설교 & 영상 해설 수정</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canEditBoard}
                      onChange={(e) => setCanEditBoard(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span>소식·주보 작성</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canEditGallery}
                      onChange={(e) => setCanEditGallery(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span>이야기·갤러리 등록</span>
                  </label>
                  {role === 'editor' && (
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={canEditTheme}
                        onChange={(e) => setCanEditTheme(e.target.checked)}
                        className="rounded text-sky-600"
                      />
                      <span>디자인 설정 변경 허용</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-98"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>이 계정에 수정 권한 부여하기</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Currently Authorized Managers List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>현재 권한을 부여받은 관리자 목록 ({managers.length}명)</span>
              </h4>
            </div>

            <div className="space-y-2">
              {managers.map((m) => {
                const isSuperOwner = m.email.toLowerCase() === OWNER_EMAIL.toLowerCase();
                return (
                  <div
                    key={m.id || m.email}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sky-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSuperOwner ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {isSuperOwner ? '목사' : '관리'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{m.name}</span>
                          {isSuperOwner ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white">
                              홈페이지 최고권한 (담임목사)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-100 text-sky-800">
                              {m.role === 'admin' ? '전체 관리자' : '사역 편집자'}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-medium">{m.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                          <span>{m.email}</span>
                          <span>·</span>
                          <span className="font-sans text-[11px] text-slate-400">등록일: {m.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isSuperOwner ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                          항구 권한자
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`${m.name}(${m.email}) 님의 수정 권한을 회수하시겠습니까?`)) {
                              removeManager(m.id);
                              setToastMessage(`${m.name} 님의 권한이 회수되었습니다.`);
                              setTimeout(() => setToastMessage(null), 3000);
                            }
                          }}
                          className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>권한 회수</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Master Passcode Settings (For church office shared PCs) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                  <span>교회 사무실 공용 마스터 관리자 인증키 설정</span>
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  교회 행정실 컴퓨터 등에서 구글 로그인 없이 즉시 최고관리자로 인증할 수 있는 마스터 비밀번호입니다.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePasscode} className="flex gap-2">
              <input
                type="text"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="새 마스터 인증키"
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 shadow-xs"
              >
                인증키 변경
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>설정된 권한은 브라우저 및 데이터베이스에 즉시 동기화됩니다.</span>
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs"
            style={{ backgroundColor: theme.primaryColor }}
          >
            확인 및 닫기
          </button>
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
