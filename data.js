/* ──────────────────────────────────────────────────────────────
   ADMIN 랜딩페이지 내용 데이터
   이 파일만 고치면 사이트 내용이 바뀝니다. HTML은 건드리지 않아도 됩니다.
   문자열은 따옴표(" ") 안에만, 항목 사이 쉼표(,)는 지우지 마세요.
   main 브랜치에 머지되면 1~2분 안에 사이트에 자동 반영됩니다.
   ────────────────────────────────────────────────────────────── */

const DATA = {

  /* 1. 첫 화면 ─────────────────────────────────────────────── */
  site: {
    name: "ADMIN",
    // 이름 옆 작은 글씨 (학교/소속)
    affiliation: "충남대학교 컴퓨터인공지능학부",
    // 한 줄 소개. 페이지 최상단 큰 문장.
    tagline: "웹과 AI를 직접 만들고 가르치는 충남대학교 컴퓨터인공지능학부 학술 동아리입니다.",
    // 첫 화면 버튼
    cta: { label: "가입 안내 보기", href: "#join" },
    // 네비게이션. href는 각 섹션 id와 맞춰야 합니다.
    nav: [
      { label: "소개",   href: "#about" },
      { label: "활동",   href: "#activities" },
      { label: "기록",   href: "#events" },
      { label: "성과",   href: "#awards" },
      { label: "운영진", href: "#members" },
      { label: "가입",   href: "#join" }
    ]
  },

  /* 2. 소개 ────────────────────────────────────────────────── */
  about: {
    // 섹션 왼쪽에 붙는 작은 라벨
    label: "소개",
    // 소개 섹션 큰 제목
    heading: "배운 것을 나누고, 직접 만들어 봅니다.",
    // 문단. 배열에 문자열을 넣는 만큼 문단이 늘어납니다.
    paragraphs: [
      "ADMIN은 충남대학교 컴퓨터인공지능학부의 학술 동아리입니다. 웹 개발, 그리고 최근에는 프롬프트 엔지니어링과 RAG 같은 AI 활용 기술까지, 수업에서 배운 내용을 직접 만들어 보며 익히는 것을 가장 중요하게 생각합니다.",
      "부원이 배운 것을 다른 학생들에게 나누는 것도 ADMIN의 중요한 활동입니다. 매 학기 신입생과 학부생을 대상으로 코딩 입문, 파이썬, AI 활용 교육을 직접 기획하고 진행하며, 충남대학교 학부생이 참여하는 해커톤도 열었습니다.",
      "전공이나 학년 제한은 없습니다. 처음 코딩을 시작하는 신입생부터 학회에 논문을 내는 고학년까지 100명 가까운 부원이 함께하고 있고, 매년 어드민데이에는 현업에 있는 선배들이 찾아와 경험을 나눠 줍니다."
    ],
    // ADMIN 다섯 글자의 뜻
    letters: [
      { letter: "A", word: "AI",          desc: "복잡한 AI를 내 손안의 도구로" },
      { letter: "D", word: "Development", desc: "프로젝트와 대회를 통한 실전 경험" },
      { letter: "M", word: "Mentoring",   desc: "학점과 낭만을 챙겨주는 캠퍼스 가이드" },
      { letter: "I", word: "Interaction", desc: "동아리 활동과 소모임으로 즐기는 활발한 상호작용" },
      { letter: "N", word: "Network",     desc: "졸업생 선배와 연결되는 ADMIN만의 강력한 인프라" }
    ]
  },

  /* 3. 하는 일 ─────────────────────────────────────────────── */
  activities: {
    label: "활동",
    heading: "함께 배우고, 함께 어울립니다.",
    // 학습·친목처럼 칸을 나눠 보여 줍니다. desc는 없어도 됩니다.
    // 사진은 images/ 폴더에 넣으세요. 파일이 없으면 회색 박스와 파일 이름이 보입니다.
    // 사진이 두 장이면 image 대신 images: ["...", "..."] 로 적습니다. 카드가 두 칸을 차지합니다.
    groups: [
      {
        name: "학습",
        items: [
          { title: "ADMIN 코딩 입문 세미나", desc: "코딩 이해, 개발 환경 구축, 간단한 코딩 실습, 학습 방법을 안내합니다.", image: "images/event-1.jpg" },
          { title: "ADMIN Python 기초 교육", desc: "기본 문법부터 객체, 제어문, 간단한 문제 풀이까지 차근차근 배웁니다.", image: "images/event-2.jpg" },
          { title: "Harness Engineering 교육", desc: "AI에게 질문을 잘하는 방법부터 하네스 엔지니어링까지 다룹니다.", image: "images/event-3.jpg" },
          { title: "GraphRAG 교육", desc: "RAG와 GraphRAG의 개념을 정리하고 직접 구현해 봅니다.", image: "images/event-4.jpg" },
          { title: "ADMIN AI CHALLENGE", desc: "AI 모델에 관심 있는 충남대학교 학부생이 참여하는 Bio-AI 추론 모델 해커톤입니다.", image: "images/event-5.jpg" }
        ]
      },
      {
        name: "친목",
        items: [
          { title: "ADMIN 멘토링", desc: "재학생 선배와 신입생이 4~5명씩 팀을 이뤄 그룹 스터디, 질의응답, 친목 활동을 합니다.", images: ["images/event-6.jpg", "images/event-7.jpg"] },
          { title: "어막동", desc: "막걸리와 안주를 나누며 함께 어울립니다.", image: "images/event-8.jpg" },
          { title: "ADMIN MT", desc: "부원들이 함께 MT를 다녀옵니다.", images: ["images/event-9.jpg", "images/event-10.jpg"] },
          { title: "풋살", desc: "동아리 연합 풋살에 함께 참여합니다.", image: "images/event-11.jpg" }
        ]
      }
    ]
  },

  /* 4. 올해 기록 ───────────────────────────────────────────── */
  // 날짜 순서대로 적습니다. 날짜가 지나지 않은 행사에는 "예정" 표시가 자동으로 붙습니다.
  // 사진을 넣으려면 image: "images/event-1.jpg" 를 추가하세요. 없으면 글만 나옵니다.
  events: {
    label: "기록",
    heading: "2026 기록",
    list: [
      { title: "ADMIN 코딩 입문 세미나", date: "2026.03.10", place: "", desc: "프로그래밍을 처음 접하는 학생들을 위한 입문 세미나를 열었습니다. 서른 명 넘게 참석했습니다." },
      { title: "ADMIN Python 기초 교육", date: "2026.03.17", place: "", desc: "신입생을 대상으로 파이썬 기초 문법부터 간단한 실습까지 진행했습니다." },
      { title: "개강총회", date: "2026.03.20", place: "", desc: "새 학기를 맞아 부원들이 함께 모였습니다." },
      { title: "어막동", date: "2026.04.01 – 04.02", place: "충남대학교 조각공원", desc: "봄을 맞아 이틀 동안 꿀막걸리와 안주를 나누며 어울렸습니다." },
      { title: "동아리 연합 풋살", date: "2026.04.18", place: "", desc: "다른 동아리와 함께 풋살을 즐겼습니다." },
      { title: "ADMIN MT", date: "2026.05.02 – 05.03", place: "", desc: "부원들이 함께 MT를 다녀왔습니다." },
      { title: "Harness Engineering 교육", date: "2026.05.12", place: "공과대학 5호관 412호", desc: "AI에게 질문을 잘하는 방법부터 하네스 엔지니어링까지, 생성형 AI 활용법을 다뤘습니다. 마흔세 명이 참석했습니다." },
      { title: "제1회 어드민 나이트: GAME START", date: "2026.05", place: "", desc: "어드민의, 어드민에 의한, 어드민을 위한 밤을 처음으로 열었습니다." },
      { title: "종강총회", date: "2026.06.18", place: "", desc: "1학기를 마무리하며 부원들이 함께 모였습니다." },
      { title: "개강총회", date: "2026.09", place: "", desc: "2학기를 시작하며 부원들이 함께 모였습니다." },
      { title: "GraphRAG 교육", date: "2026.09.23", place: "", desc: "LLM에 외부 지식을 연결하는 RAG와 GraphRAG의 개념을 정리하고 직접 구현해 봤습니다." },
      { title: "ADMIN AI CHALLENGE", date: "2026.11.01", place: "", desc: "AI 모델에 관심 있는 충남대학교 학부생을 대상으로 Bio-AI 추론 모델 해커톤을 열었습니다." },
      { title: "2026 ADMIN DAY", date: "2026.11.21", place: "공과대학 5호관 411호", desc: "졸업한 선배들의 강연을 듣고 재학생과 이야기를 나누는 홈커밍 행사입니다." }
    ]
  },

  /* 5. 성과 ────────────────────────────────────────────────── */
  awards: {
    label: "성과",
    heading: "부원들이 거둔 성과",
    note: "재학생 부원들의 수상과 논문 발표 기록입니다.",
    // 최근 순서로 적습니다. result는 오른쪽 굵은 글씨입니다.
    list: [
      { year: "2026", title: "KCC2026 학부생 논문경진대회", result: "우수상 2건" },
      { year: "2025", title: "우수작품 경진대회 (SW중심대학협의회)", result: "대상" },
      { year: "2025", title: "CNU 창의SW/AI 축전", result: "대상" },
      { year: "2025", title: "캡스톤디자인 졸업작품 경진대회", result: "우수상" },
      { year: "2025", title: "바이오AI융합경진대회", result: "우수상" },
      { year: "2025", title: "한국컴퓨터종합학술대회 (KCC2025)", result: "논문 발표" },
      { year: "2025", title: "정보보호학회 하계학술대회 (CISC-S'25)", result: "논문 발표" },
      { year: "2025", title: "대한전자공학회 추계학술대회", result: "논문 발표" },
      { year: "2024", title: "AI활용 기반 CNU 업무효율화 경진대회", result: "최우수상" },
      { year: "2024", title: "CNU 창의SW/AI 축전 주니어", result: "대상" }
    ]
  },

  /* 6. 운영진 (조직도) ─────────────────────────────────────── */
  // 사진은 쓰지 않습니다. 이름·직책·학번·한 줄 소개만 들어갑니다.
  members: {
    label: "운영진",
    heading: "2026학년도 운영진",
    note: "",

    // 맨 위에 크게 나오는 대표 운영진 (3~4명 권장)
    lead: [
      { name: "김호성", role: "회장",   year: "22학번", bio: "동아리 운영 전반과 대외 업무를 맡고 있습니다." },
      { name: "임승현", role: "부회장", year: "25학번", bio: "회장을 도와 행사와 동아리 운영을 함께 챙깁니다." },
      { name: "우성협", role: "총무",   year: "22학번", bio: "회비와 동아리 예산을 관리합니다." }
    ],

    // 그 아래 부서별 조직. 부서를 늘리거나 줄이면 그대로 반영됩니다.
    departments: [
      {
        name: "교육부",
        people: [
          { name: "하태영", role: "부장", year: "22학번", bio: "교육과 세미나를 기획하고 진행합니다." },
          { name: "임서희", role: "부원", year: "24학번", bio: "교육 자료 준비와 세미나 진행을 돕습니다." }
        ]
      },
      {
        name: "홍보부",
        people: [
          { name: "박서연", role: "부장", year: "24학번", bio: "행사 홍보와 SNS 계정을 관리합니다." },
          { name: "윤영서", role: "부원", year: "24학번", bio: "홍보물 제작과 행사 기록을 맡습니다." }
        ]
      },
      {
        name: "기획부",
        people: [
          { name: "전아림", role: "부장", year: "24학번", bio: "대회와 행사의 전체 일정을 기획합니다." },
          { name: "이다희", role: "부원", year: "25학번", bio: "행사 준비와 현장 운영을 돕습니다." }
        ]
      }
    ]
  },

  /* 7. 가입 안내 ───────────────────────────────────────────── */
  // 계좌번호와 개인 전화번호는 이 페이지에 적지 않습니다.
  join: {
    label: "가입",
    heading: "ADMIN에 오신 여러분을 환영합니다.",
    note: "신입 부원은 매 학기 초에 모집합니다.",
    steps: [
      { title: "링크트리 접속", desc: "아래 버튼이나 인스타그램 프로필 링크로 들어갑니다." },
      { title: "구글폼 작성",   desc: "가입 신청서를 작성합니다." },
      { title: "회비 납부",     desc: "본인 이름으로 회비를 납부하면 신청이 완료됩니다." }
    ],
    details: [
      { label: "회비",      value: "1학기 15,000원", href: "" },
      { label: "납부 계좌", value: "인스타그램 입부 안내 게시물", href: "https://www.instagram.com/cnu_admin_official/p/DU6-1gPk6av/" }
    ],
    cta: { label: "가입 신청하기", href: "https://linktr.ee/cnuADMIN" }
  },

  /* 8. 하단 (연락처) ───────────────────────────────────────── */
  // 개인 연락처는 넣지 않습니다. 인스타그램과 링크트리로만 안내합니다.
  contact: {
    label: "연락",
    heading: "물어볼 게 있으면 인스타그램으로 연락 주세요.",
    // 짧은 안내 문구
    note: "모집 기간이 아니어도 문의는 언제든 받습니다.",
    // 왼쪽 연락처 목록
    details: [
      { label: "가입·신청", value: "링크트리", href: "https://linktr.ee/cnuADMIN" }
    ],
    // SNS / 외부 링크
    links: [
      { label: "Instagram", value: "@cnu_admin_official", href: "https://www.instagram.com/cnu_admin_official/" }
    ],
    // 맨 아래 저작권 줄 (연도는 자동으로 들어갑니다)
    copyright: "ADMIN, Chungnam National University"
  }

};
