export interface MissionField {
  id: string;
  country: string;
  flag: string;
  missionaries: string;
  fieldTitle: string;
  location: string;
  startedYear: string;
  currentUrgentTopic: string;
  latestNewsTitle: string;
  latestNewsDate: string;
  summary: string;
  details: string[];
  prayerRequests: string[];
  prayerCount: number;
  contactEmail?: string;
  image: string;
}

export const missionFields: MissionField[] = [
  {
    id: 'cambodia',
    country: '캄보디아',
    flag: '🇰🇭',
    missionaries: '김동선 · 이금주 선교사',
    fieldTitle: '프놈펜 이음 유치원 및 현지 지도자 훈련원',
    location: '캄보디아 프놈펜 및 칸달주 일대',
    startedYear: '2021년 협력',
    currentUrgentTopic: '캄보디아 우기 침수 피해 복구 및 어린이 방과후 교실 증축을 위한 긴급 기도',
    latestNewsTitle: '새 학기 어린이 120명 성경학교 입학 및 현지 청년 제자훈련 개강',
    latestNewsDate: '2026년 4월 최신 소식',
    summary: '열악한 환경 속에서도 어린이들에게 예수 그리스도의 사랑과 배움의 기회를 전하고 있습니다.',
    details: [
      '현지 유치원 3개 학급 85명과 방과후 아카데미 35명의 어린이들이 매일 찬양과 성경 암송으로 하루를 시작하고 있습니다.',
      '지난 3월 우기 초입에 침수 피해를 입었던 교실 바닥 보수 공사가 성도님들의 중보기도 덕분에 무사히 마무리되었습니다.',
      '현지 크메르어 성경 교재 보급과 차세대 현지인 사역자 4명의 신학 훈련이 은혜 가운데 진행되고 있습니다.'
    ],
    prayerRequests: [
      '김동선, 이금주 선교사 가정의 영육 간의 강건함과 풍토병으로부터의 안전을 위해',
      '새롭게 진행되는 방과후 교실 증축을 위한 건축 재정과 안전한 시공을 위해',
      '복음을 접한 어린이들과 그 가족들의 마음 문이 열려 온 가정이 구원받도록'
    ],
    prayerCount: 142,
    image: '/assets/aistudio/KakaoTalk_20260525_183850966_03_18abfd03.jpg'
  },
  {
    id: 'philippines',
    country: '필리핀',
    flag: '🇵🇭',
    missionaries: '김명식 · 정지은 선교사',
    fieldTitle: '마닐라 빈민가 어린이 급식 및 청소년 비전 센터',
    location: '필리핀 메트로 마닐라 톤도(Tondo) 빈민 지구',
    startedYear: '2022년 협력',
    currentUrgentTopic: '톤도 빈민지역 결식아동 200명 주말 무료 급식 및 청소년 장학사역 확대 기도',
    latestNewsTitle: '톤도 청소년 부활절 찬양 캠프 성료 및 15명 세례식 거행',
    latestNewsDate: '2026년 4월 최신 소식',
    summary: '쓰레기 마을이라 불리는 마닐라 톤도에서 생명의 복음과 따뜻한 밥 한 끼로 주님의 손길을 전합니다.',
    details: [
      '매주 토요일 결식 어린이 200여 명에게 영양가 있는 따뜻한 도시락을 나누며 성경 이야기를 들려주고 있습니다.',
      '중고등부 청소년 25명이 장학생으로 선발되어 정규 공립학교 학업을 이어가고 있으며, 교회 찬양팀과 교사로 헌신하고 있습니다.',
      '최근 부활절 주간에 3일간 진행된 청소년 말씀 캠프에서 15명의 학생들이 예수님을 인격적으로 영접하고 세례를 받았습니다.'
    ],
    prayerRequests: [
      '김명식, 정지은 선교사의 지치지 않는 영적 충만함과 치안이 열악한 환경 속에서의 신변 안전을 위해',
      '지속적인 아동 무료 급식을 위한 쌀과 식자재 후원 결연이 넉넉히 채워지도록',
      '세례받은 15명의 청소년들이 마약과 범죄의 유혹을 이기고 믿음의 리더로 자라나도록'
    ],
    prayerCount: 128,
    image: '/src/assets/images/worship_praise_service_1792553380119.jpg'
  },
  {
    id: 'domestic',
    country: '국내기관',
    flag: '🇰🇷',
    missionaries: '기아대책본부 (태훈이 가족)',
    fieldTitle: '국내 결연 위기가정 생계 및 의료 긴급 지원',
    location: '국내 긴급 복지 사각지대',
    startedYear: '2024년 결연',
    currentUrgentTopic: '소아 난치병 치료 중인 태훈이의 재활 수술 및 가정의 경제적 회복 기도',
    latestNewsTitle: '태훈이 2차 보행 재활 치료 시작 및 주거 환경 개선 지원',
    latestNewsDate: '2026년 4월 최신 소식',
    summary: '희귀 난치성 질환으로 투병 중인 태훈이와 한부모 가정에 주님의 사랑과 치료의 희망을 함께 심어갑니다.',
    details: [
      '이음교회 성도님들의 사랑의 헌금으로 태훈이의 2차 보행 보조기구 구입 및 주 3회 집중 재활 치료가 순조롭게 시작되었습니다.',
      '곰팡이와 누수로 어려움을 겪던 태훈이네 반지하 주거 공간의 방수 공사와 도배를 지원하여 쾌적한 치료 환경을 마련했습니다.',
      '태훈이 어머니께서도 교회의 따뜻한 관심과 기도 속에 지친 몸과 마음을 회복하며 교회 공동체에 출석하기 시작했습니다.'
    ],
    prayerRequests: [
      '태훈이의 뇌병변 재활 치료 경과가 좋아 혼자서 일어서고 걸을 수 있는 기적이 일어나도록',
      '홀로 간병과 생계를 책임지는 어머니의 건강과 영적 회복을 위해',
      '가정에 필요한 치료비와 생활비가 후원의 손길을 통해 계속 공급되도록'
    ],
    prayerCount: 165,
    image: '/src/assets/images/hero_ieum_church_1792553379074.jpg'
  }
];
