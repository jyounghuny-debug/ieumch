import { ChurchTheme, PostItem, WorshipSchedule, SEOSettings, CalendarEvent, CommunityStory, PrayerRequest } from '../types';
import heroImg from '../assets/images/hero_ieum_church_1792553379074.jpg';
import pastorStudyImg from '../assets/images/pastor_jeong_study_final.png';
import pastorOriginalImg from '../assets/images/pastor_original.png';
import fellowshipImg from '../assets/images/community_fellowship_1792553379457.jpg';
import worshipImg from '../assets/images/worship_praise_service_1792553380119.jpg';

export { heroImg, pastorStudyImg, pastorOriginalImg, fellowshipImg, worshipImg };

export const initialTheme: ChurchTheme = {
  primaryColor: '#0284c7', // Sky Blue primary (#0284c7 / sky-600)
  primaryLightColor: '#e0f2fe', // sky-100
  bgTone: 'warm', // #FAFBFD
  fontFamily: 'sans',
  churchName: '이음교회',
  churchEngName: 'IEUM CHURCH',
  slogan: '하나님 나라와 열방을 이어가는 이음교회',
  subSlogan: '',
  scriptureVerse: '누구든지 자기 십자가를 지고 나를 따르지 않는 자도 능히 내 제자가 되지 못하리라 (누가복음 14:27)',
  seniorPastor: '정영훈 목사',
  pastorTitle: '담임목사',
  pastorGreeting: '이음교회 홈페이지를 찾아주신 여러분을 주님의 이름으로 진심으로 환영하고 축복합니다.',
  pastorGreetingDetails: [
    '우리의 삶은 끊임없이 연결을 갈망합니다. 하나님과의 친밀한 만남, 이웃과의 따뜻한 나눔, 그리고 다음 세대를 향한 신실한 축복이 우리 안에 있을 때 영혼은 참된 안식을 얻습니다.',
    '이음교회는 복음의 본질 위에서 상처 입은 세상을 위로하고, 하나님 나라의 기쁨을 함께 누려가는 은혜의 울타리입니다.',
    '처음 발걸음하시는 분들도 언제나 편안하게 쉼을 얻을 수 있도록 마음을 다해 섬기겠습니다. 온 가족과 함께 주님의 사랑을 누리는 귀한 여정에 여러분을 초대합니다.'
  ],
  heroImage: heroImg,
  pastorImage: pastorStudyImg,
  fellowshipImage: '/assets/aistudio/_____e9823737.jpg',
  worshipImage: worshipImg,
  address: '대전광역시 유성구 지족로 148번길 5-10',
  addressDetail: '미르빌딩 4층',
  phone: '042-822-2026',
  email: 'contact@ieumchurch.kr',
  visibleSections: {
    hero: true,
    about: true,
    worship: true,
    calendar: true,
    sermon: true,
    prayer: true,
    posts: true,
    gallery: true,
    newFamily: true,
    directions: true
  }
};

export const initialSchedules: WorshipSchedule[] = [
  {
    id: 'w1',
    name: '주일 공동체예배',
    time: '매주 주일 오전 11:00',
    target: '전 교인 및 공동체 (예배실)',
    place: '예배실 (4층)',
    isMain: true
  },
  {
    id: 'w2',
    name: '다음세대예배',
    time: '매주 주일 오후 01:00',
    target: '어린이 및 청소년 다음세대',
    place: '예배실 (4층)',
    isMain: false
  },
  {
    id: 'w3',
    name: '장년목장모임',
    time: '매주 주일 오후 02:00',
    target: '장년 목장 가족',
    place: '소그룹실 (4층)',
    isMain: false
  },
  {
    id: 'w4',
    name: '새가족모임',
    time: '매주 주일 오후 01:00',
    target: '새가족 등록 성도',
    place: '소그룹실 (4층)',
    isMain: false
  },
  {
    id: 'w5',
    name: '저녁기도회',
    time: '평일 저녁 08:00',
    target: '모든 기도 성도',
    place: '예배실 (4층)',
    isMain: false
  }
];

export const initialPosts: PostItem[] = [
  {
    id: 'p-mission-1',
    category: 'mission',
    title: '이음교회 국내외 협력 선교지 소식 및 중보기도',
    content: `[이음교회 국내외 협력 선교지 소식]

하나님 나라와 열방을 이어가는 이음교회의 국내외 동역 선교지와 지원 기관 소식입니다.
열방을 품고 충성스럽게 사역하시는 선교사님들과 이웃을 위해 성도님들의 뜨거운 중보기도를 부탁드립니다.

■ 해외선교
1. 캄보디아: 김동선, 이금주 선교사
  - 현지 교회 개척, 어린이 방과후 학교 및 청소년 기술 교육 사역
  - 기도제목: 선교사 가정의 영육간 건강, 현지인 제자 양육 및 복음 전파의 문이 활짝 열리도록

2. 필리핀: 김명식, 정지은 선교사
  - 도시 빈민가 구제, 어린이 말씀 사역 및 장학 결연 사역
  - 기도제목: 빈민촌 아동들의 건강한 성장, 청소년 리더들이 하나님 나라의 일꾼으로 굳건히 세워지도록

■ 국내기관
1. 기아대책본부 (태훈이 가족)
  - 결연 후원 및 위기가정 긴급 생계/의료 지원
  - 기도제목: 태훈이 가족에게 주님의 평안과 치료의 손길이 임하고, 믿음 안에서 소망을 품고 일어설 수 있도록

"오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 (사도행전 1:8)"`,
    author: '선교위원회',
    date: '2026.04.22',
    views: 420,
    likes: 85,
    isPinned: true,
    imageUrl: '/assets/aistudio/KakaoTalk_20260525_183850966_03_18abfd03.jpg',
    comments: [
      { id: 'cm-1', author: '정영훈 담임목사', content: '열방과 소외된 이웃을 향해 복음의 다리를 놓는 귀한 선교사님들과 후원 가정을 위해 매일 마음 모아 기도합시다.', date: '2026.04.22' }
    ]
  },
  {
    id: 'p1',
    category: 'bulletin',
    title: '2026년 4월 셋째 주 이음주보 (제 2026-16호)',
    content: `[예배 순서 안내]
· 찬양 인도: 이음 찬양팀
· 신앙고백: 사도신경
· 교독문: 42번 (시편 103편)
· 대표기도: 박은혜 장로
· 성경봉독: 요한복음 14장 25~27절
· 말씀선포: "세상이 줄 수 없는 참된 평안" (정영훈 담임목사)
· 봉헌 및 축도

[금주의 목회 소식]
1. 봄맞이 성경통독학교 개강 (매주 화요일 저녁 8시, 줌 및 대면)
2. 5월 이음 사랑의 바자회 물품 기증 접수 중 (본당 로비 1층 접수처)
3. 새가족 환영 4주 양육 과정 등록 안내 (문의: 새가족부장 최믿음 권사)`,
    author: '이음교회 사무국',
    date: '2026.04.19',
    views: 342,
    likes: 48,
    isPinned: true,
    imageUrl: '/src/assets/images/worship_praise_service_1792553380119.jpg',
    pdfDownloadName: '이음주보_20260419.pdf',
    comments: [
      { id: 'c1', author: '이정민 성도', content: '이번 주 대표기도 문구가 마음에 큰 울림이 되었습니다. 감사합니다.', date: '2026.04.19' },
      { id: 'c2', author: '한동훈 집사', content: '새가족 양육팀 늘 응원하고 기도합니다!', date: '2026.04.20' }
    ]
  },
  {
    id: 'p2',
    category: 'sermon',
    title: '세상이 줄 수 없는 참된 평안 (요한복음 14:27)',
    content: `예수님께서는 십자가를 앞두고 제자들에게 불안과 두려움 대신 '평안'을 유업으로 남겨주셨습니다.
세상이 말하는 평안은 조건이 채워질 때 잠시 머무는 안락함이지만, 주님이 주시는 평안은 어떤 폭풍 속에서도 흔들리지 않는 하늘의 평강입니다.

말씀 포인트:
1. 평안의 근원은 상황이 아니라 주님과의 연결(이음)에 있습니다.
2. 근심과 두려움을 주님께 온전히 맡기는 기도가 참된 평안을 지킵니다.
3. 받은 평안을 주변의 고난받는 이웃들에게 흘려보내는 것이 교회의 사명입니다.`,
    author: '정영훈 담임목사',
    date: '2026.04.19',
    views: 520,
    likes: 89,
    isPinned: true,
    scripture: '요한복음 14:27',
    scripturePassage: '"평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라. 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라. 너희는 마음에 근심하지도 말고 두려워하지도 말라."',
    preacher: '정영훈 담임목사',
    videoDuration: '38:15',
    videoUrl: 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg',
    imageUrl: '/src/assets/images/hero_ieum_church_1792553379074.jpg',
    comments: [
      { id: 'c3', author: '강지혜 청년', content: '취업 준비로 마음이 많이 불안했는데 큰 위로가 되었습니다. 아멘.', date: '2026.04.19' }
    ]
  },
  {
    id: 'p2-2',
    category: 'sermon',
    title: '십자가를 지고 따르는 참된 제자의 길 (누가복음 14:27)',
    content: `우리가 주님을 따른다는 것은 나의 계획과 뜻을 내려놓고 주님의 말씀 앞에 온전히 순종하는 결단입니다.
참된 제자도는 십자가 너머에 예비된 부활의 기쁨과 생명의 풍성함을 바라보며 날마다 자기를 부인하는 거룩한 동행입니다.

말씀 포인트:
1. 십자가는 희생이 아니라 참된 자유와 생명으로 들어가는 문입니다.
2. 매일의 삶 속에서 작은 순종으로 그리스도를 닮아가는 것이 제자의 삶입니다.
3. 믿음의 동역자들과 함께 어깨를 맞대고 복음의 다리를 이어갑시다.`,
    author: '정영훈 담임목사',
    date: '2026.04.12',
    views: 480,
    likes: 72,
    isPinned: false,
    scripture: '누가복음 14:27',
    scripturePassage: '"누구든지 자기 십자가를 지고 나를 따르지 않는 자도 능히 내 제자가 되지 못하리라"',
    preacher: '정영훈 담임목사',
    videoDuration: '41:20',
    videoUrl: 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg',
    imageUrl: '/src/assets/images/worship_praise_service_1792553380119.jpg',
    comments: [
      { id: 'c3-2', author: '박태양 순장', content: '제자도로 세워지는 교회를 위해 함께 기도합니다.', date: '2026.04.12' }
    ]
  },
  {
    id: 'p2-3',
    category: 'sermon',
    title: '광야에서 만나는 하나님의 신실하신 은혜 (출애굽기 16:1-8)',
    content: `인생의 광야를 만날 때마다 우리는 주님이 준비하신 만나와 메추라기의 기적을 기억해야 합니다.
결핍과 한계의 순간이야말로 하나님이 우리의 유일한 공급자 되심을 친히 경험하는 가장 거룩한 훈련장입니다.

말씀 포인트:
1. 광야의 결핍은 하나님의 채우심을 경험하는 은혜의 기회입니다.
2. 매일 주시는 일용할 양식에 감사하며 오늘 하루를 온전히 신뢰합시다.
3. 하나님은 결코 우리를 홀로 버려두지 않으시고 항상 함께 걷고 계십니다.`,
    author: '정영훈 담임목사',
    date: '2026.04.05',
    views: 410,
    likes: 64,
    isPinned: false,
    scripture: '출애굽기 16:1-8',
    scripturePassage: '"보라 내가 너희를 위하여 하늘에서 양식을 비 같이 내리리니 백성이 나가서 일용할 것을 날마다 거둘 것이라"',
    preacher: '정영훈 담임목사',
    videoDuration: '36:45',
    videoUrl: 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg',
    imageUrl: '/src/assets/images/fellowship_community_tea_1792553381014.jpg',
    comments: [
      { id: 'c3-3', author: '김은혜 집사', content: '광야 같은 삶 속에 큰 힘이 되는 말씀이었습니다.', date: '2026.04.05' }
    ]
  },
  {
    id: 'p3',
    category: 'notice',
    title: '2026년 상반기 새가족 양육 4주 코스 안내 및 등록',
    content: `이음교회에 처음 오신 성도님들을 위해 따뜻한 만남과 기초 신앙의 여정을 준비했습니다.
담임목사님과의 티타임, 교회 비전 나눔, 소그룹 순모임 안내 등이 함께 진행됩니다.

· 일시: 5월 첫째 주부터 매주 주일 오후 1시 (총 4주)
· 장소: 2층 새가족 환영실
· 대상: 최근 6개월 내 등록하신 모든 성도 및 방문자
· 신청: 홈페이지 새가족 신청 폼 또는 현장 안내데스크`,
    author: '새가족사역팀',
    date: '2026.04.15',
    views: 290,
    likes: 31,
    isPinned: false,
    imageUrl: '/src/assets/images/community_fellowship_1792553379457.jpg',
    comments: []
  },
  {
    id: 'p4',
    category: 'grace',
    title: '소그룹 순모임에서 발견한 따뜻한 예수님의 손길',
    content: `이음교회에 등록하고 가장 감사한 것은 진솔한 삶을 나눌 수 있는 순모임을 만난 것입니다.
아픔을 숨기지 않고 함께 눈물 흘려주며, 서로를 위해 날마다 중보기도해 주는 지체들이 있어 믿음의 길을 외롭지 않게 걸어가고 있습니다.
서로를 사랑으로 품는 이음교회 공동체에 속하게 하신 하나님께 모든 영광을 올려드립니다.`,
    author: '박수연 성도 (온유순)',
    date: '2026.04.12',
    views: 215,
    likes: 42,
    isPinned: false,
    comments: [
      { id: 'c4', author: '정태양 순장', content: '수연 성도님의 간증에 온 순원들이 함께 감사의 눈물을 흘렸습니다 축복합니다!', date: '2026.04.13' }
    ]
  },
  {
    id: 'p5',
    category: 'prayer',
    title: '선교지와 환우들을 위한 4월 릴레이 중보기도',
    content: `1. 캄보디아 이음 선교센터 건축과 유치원 교육 사역의 은혜로운 진행을 위해
2. 투병 중인 성도님들의 온전한 영육의 회복과 평강을 위해
3. 대학 진학과 취업을 준비하는 다음 세대 청년들의 앞길을 주님께서 친히 인도하시도록
매일 새벽과 가정 예배 시 함께 마음 모아 기도해 주시기 바랍니다.`,
    author: '중보기도팀',
    date: '2026.04.10',
    views: 180,
    likes: 55,
    isPinned: false,
    comments: []
  }
];

export const initialSEOSettings: SEOSettings = {
  metaTitle: '이음교회 - 하나님과 이웃을 잇는 믿음의 공동체',
  metaDescription: '하나님과 이웃을 잇는 따뜻한 믿음의 공동체, 이음교회에 오신 것을 환영합니다. 주일예배, 설교말씀, 이음주보 및 새가족 안내.',
  keywords: '이음교회, 서울교회, 주일예배, 설교말씀, 새가족, 주보, 교회소식, 기독교대한감리회, 은혜로운교회',
  ogImage: '/src/assets/images/hero_ieum_church_1792553379074.jpg',
  siteUrl: 'https://ieumchurch.kr',
  socialLinks: {
    youtube: 'https://www.youtube.com/channel/UCQNgJ4A8zgLqHRNYLIkGRqg',
    instagram: 'https://instagram.com/ieumchurch',
    kakaotalk: 'https://pf.kakao.com/_ieumchurch',
    band: 'https://band.us/@ieumchurch'
  }
};

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: '주일 2부 대예배 & 청년 이음 워십',
    description: '매주일 주님 앞에 드리는 거룩하고 은혜로운 정규 대예배 및 청년부 찬양 집회입니다.',
    date: '2026-10-25',
    time: '오전 11:00 / 오후 01:30',
    place: '본당 (3층 대예배실)',
    category: 'worship',
    target: '전 교인 및 청년',
    isHighlight: true,
    rsvps: [
      { id: 'r1', name: '이정민', createdAt: '2026-10-20' },
      { id: 'r2', name: '박수연', createdAt: '2026-10-20' }
    ]
  },
  {
    id: 'evt-2',
    title: '2026 가을 성경통독학교 개강 (창세기~신명기)',
    description: '모세오경의 구속사적 맥락을 함께 읽고 묵상하는 8주간의 성경통독 훈련 과정입니다.',
    date: '2026-10-27',
    time: '매주 화요일 저녁 08:00',
    place: '2층 비전홀 및 줌(Zoom) 온라인',
    category: 'education',
    target: '성경 통독을 사모하는 모든 성도',
    postId: 'p3',
    isHighlight: true,
    rsvps: [
      { id: 'r3', name: '최믿음', createdAt: '2026-10-20' },
      { id: 'r4', name: '김은혜', createdAt: '2026-10-20' },
      { id: 'r5', name: '정태양', createdAt: '2026-10-21' }
    ]
  },
  {
    id: 'evt-3',
    title: '수요 은혜 성경강해 (요한복음)',
    description: '삶의 현장에서 만나는 참된 진리의 말씀, 요한복음 강해 설교 및 중보기도회.',
    date: '2026-10-28',
    time: '수요일 저녁 07:30',
    place: '본당 (3층 대예배실)',
    category: 'worship',
    target: '성도 및 기도자'
  },
  {
    id: 'evt-4',
    title: '교회학교 홀리윈(Holy-Win) 말씀 & 달란트 잔치',
    description: '세상 문화를 넘어 예수님의 사랑과 빛을 기념하는 어린이 및 다음 세대 축제입니다.',
    date: '2026-10-31',
    time: '토요일 오후 02:00',
    place: '4층 드림홀 및 교육관',
    category: 'special',
    target: '영유아부, 유초등부 어린이 및 학부모',
    isHighlight: true,
    rsvps: [
      { id: 'r6', name: '한동훈 집사 (자녀 2명)', createdAt: '2026-10-21' }
    ]
  },
  {
    id: 'evt-5',
    title: '11월 첫째 주 성찬예식 & 새가족 양육 4주 코스 개강',
    description: '주님의 십자가 살과 피를 기념하는 성찬례와 새가족을 위한 기초 신앙 나눔이 시작됩니다.',
    date: '2026-11-01',
    time: '주일 오전 11:00 / 오후 01:00',
    place: '본당 3층 및 2층 새가족실',
    category: 'worship',
    target: '전 교인 및 새가족',
    isHighlight: true,
    postId: 'p3'
  },
  {
    id: 'evt-6',
    title: '이음 사랑의 나눔 바자회 (지역 소외 이웃 돕기)',
    description: '성도들이 기증한 생활용품, 의류, 직접 담근 과일청과 먹거리 장터를 운영하여 수익금 전액을 관내 독거어르신께 기부합니다.',
    date: '2026-11-07',
    time: '토요일 오전 10:00 ~ 오후 04:00',
    place: '교회 1층 로비 및 야외 주차장 테라스',
    category: 'fellowship',
    target: '전 교인 및 지역 주민 누구나',
    isHighlight: true,
    rsvps: [
      { id: 'r7', name: '박은혜 장로 (봉사팀)', createdAt: '2026-10-21' },
      { id: 'r8', name: '강지혜 청년', createdAt: '2026-10-21' }
    ]
  },
  {
    id: 'evt-7',
    title: '추수감사주일 전교인 온가족 연합예배',
    description: '한 해 동안 베풀어주신 하나님의 신실한 은혜에 감사하며 온 세대가 함께 드리는 연합 감사예배입니다.',
    date: '2026-11-15',
    time: '주일 오전 11:00',
    place: '본당 (3층 대예배실)',
    category: 'special',
    target: '영유아부터 어르신까지 전 성도',
    isHighlight: true
  },
  {
    id: 'evt-8',
    title: '금요 성령 대망 기도회 (치유와 회복의 밤)',
    description: '뜨거운 찬양과 기도, 성도들의 질병 치유와 영적 회복을 위해 마음을 쏟는 금요 심야기도회입니다.',
    date: '2026-11-20',
    time: '금요일 저녁 08:30',
    place: '본당 (3층 대예배실)',
    category: 'worship',
    target: '치유와 회복을 사모하는 모든 성도'
  },
  {
    id: 'evt-9',
    title: '동계 캄보디아 단기선교 1차 훈련 및 준비모임',
    description: '겨울 방학 선교팀 오리엔테이션 및 어린이 여름성경학교 사역 교재 연구 모임입니다.',
    date: '2026-11-28',
    time: '토요일 오후 02:00',
    place: '2층 세미나실',
    category: 'ministry',
    target: '단기선교 지원자 및 청년부'
  }
];

export const initialCommunityStories: CommunityStory[] = [
  {
    id: 'story-1',
    title: '주일 예배 후 따뜻한 차 한 잔과 성도의 교제',
    category: '성도의 교제',
    description: '주일 공동체 예배를 드린 후 로비 카페 공간에서 따뜻한 차를 나누며 서로의 삶을 축복하고 위로하는 은혜 가득한 시간입니다.',
    date: '매주 주일',
    imageUrl: '/assets/aistudio/_____e9823737.jpg',
    author: '친교사역팀',
    likes: 38
  },
  {
    id: 'story-2',
    title: '감격과 열정이 넘치는 이음 워십 찬양 예배',
    category: '찬양 & 예배',
    description: '다음 세대와 온 성도가 함께 두 손을 높이 들고 주님의 임재를 경험하며 뜨겁게 하나님을 송축하는 은혜의 현장입니다.',
    date: '2026.04.19',
    imageUrl: worshipImg,
    author: '이음 찬양팀',
    likes: 54
  },
  {
    id: 'story-3',
    title: '열방을 품는 캄보디아 단기선교 및 현지 아이들과의 만남',
    category: '선교지 소식 & 나눔',
    description: '김동선·이금주 선교사님 사역지인 캄보디아 현지에서 어린이 방과후 교실과 성경학교를 함께하며 예수님의 사랑을 전했습니다.',
    date: '2026.04.15',
    imageUrl: '/assets/aistudio/KakaoTalk_20260525_183850966_03_18abfd03.jpg',
    author: '선교위원회',
    likes: 72
  },
  {
    id: 'story-4',
    title: '삶을 나누고 함께 기도하는 장년 목장모임',
    category: '목장모임',
    description: '주일 오후 2시 소그룹실에 모여 한 주간의 말씀 묵상을 나누고, 가정과 일터의 기도제목을 함께 끌어안으며 믿음의 가족으로 동역합니다.',
    date: '매주 주일 오후',
    imageUrl: '/assets/aistudio/_____ce1030c5.jpg',
    author: '목양팀',
    likes: 41
  }
];

export const initialPrayers: PrayerRequest[] = [
  {
    id: 'prayer-1',
    title: '어머님의 고관절 수술과 빠른 회복을 위해 중보를 부탁드립니다',
    author: '이정민 집사',
    isAnonymous: false,
    category: 'healing',
    content: '이번 주 목요일 대전 충남대병원에서 어머님의 수술이 예정되어 있습니다. 집도의의 손길을 주님께서 친히 인도하여 주시고, 연세가 많으신 어머님의 심신이 평안 가운데 온전히 회복되도록 함께 기도해 주세요.',
    prayerCount: 38,
    createdAt: '2026.05.20',
    encouragements: [
      { id: 'enc-1', author: '정영훈 목사', message: '주님의 치유하는 광선이 어머님과 온 가족의 마음을 감싸 안아주시기를 함께 기도합니다.', createdAt: '2026.05.20' },
      { id: 'enc-2', author: '익명의 권사', isAnonymous: true, message: '아멘! 하나님께서 붙드십니다. 힘내세요!', createdAt: '2026.05.21' }
    ]
  },
  {
    id: 'prayer-2',
    title: '취업과 진로의 갈림길에서 하나님의 지혜를 구합니다',
    author: '청년부 성도',
    isAnonymous: true,
    category: 'career',
    content: '오랫동안 준비해온 시험과 면접을 앞두고 있습니다. 사람의 욕심이 아니라 하나님께서 기뻐하시는 길로 나아갈 수 있도록 믿음의 담대함과 평강을 주시길 기도 부탁드립니다.',
    prayerCount: 45,
    createdAt: '2026.05.19',
    encouragements: [
      { id: 'enc-3', author: '청년부 리더', message: '여호와 이레의 하나님께서 가장 좋은 길을 예비해 두셨음을 믿습니다. 청년부에서 함께 기도할게요!', createdAt: '2026.05.19' }
    ]
  },
  {
    id: 'prayer-3',
    title: '캄보디아 단기선교팀의 안전과 현지 어린이 사역의 열매를 위해',
    author: '선교위원회',
    isAnonymous: false,
    category: 'mission',
    content: '현지 더운 날씨 속에서도 모든 팀원들이 지치지 않고 복음의 기쁨을 담대히 전할 수 있도록, 그리고 새로 결신한 현지 아이들의 믿음이 무럭무럭 자라나도록 기도의 손을 모아주세요.',
    prayerCount: 52,
    createdAt: '2026.05.18',
    encouragements: [
      { id: 'enc-4', author: '김은혜 선교간사', message: '열방을 향한 주님의 마음에 온 교회가 기도로 동역합니다.', createdAt: '2026.05.18' }
    ]
  },
  {
    id: 'prayer-4',
    title: '[응답 감사] 지친 마음을 위로하시고 새 힘을 주신 하나님을 찬양합니다',
    author: '익명의 성도',
    isAnonymous: true,
    category: 'answered',
    isAnswered: true,
    answeredTestimony: '여러 가지 문제로 막막했던 시간 동안 공동체의 중보기도를 통해 형언할 수 없는 하나님의 평안을 경험했습니다. 기도해 주신 모든 성도님들께 진심으로 감사드립니다.',
    content: '가정의 어려운 고비를 주님의 도우심으로 넘기고 감사와 찬양의 고백으로 나아갑니다. 하나님께서 모든 기도를 신실하게 들으셨습니다.',
    prayerCount: 64,
    createdAt: '2026.05.15',
    encouragements: [
      { id: 'enc-5', author: '이음 찬양팀', message: '할렐루야! 하나님께 영광 돌립니다.', createdAt: '2026.05.16' }
    ]
  },
  {
    id: 'prayer-5',
    title: '믿지 않는 가족의 마음이 열리고 함께 예배하는 기쁨을 누리길',
    author: '온유 목장 성도',
    isAnonymous: true,
    category: 'family',
    content: '올해에는 온 가족이 주일 예배에 함께 나와 예수 그리스도를 구주로 영접하는 구원의 은혜가 임하기를 간절히 기도합니다.',
    prayerCount: 29,
    createdAt: '2026.05.17'
  }
];


