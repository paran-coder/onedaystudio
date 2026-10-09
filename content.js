// 사이트에 보이는 글자는 전부 이 파일에서 바꿉니다.
window.SITE = {
  name: "원데이 스튜디오",
  tagline: "홈페이지 · PPT 디자인",

  // 첫 화면 아래에서 가로로 흐르는 띠에 들어가는 단어들
  marquee: ["홈페이지 디자인", "PPT · 발표 자료", "IR · 제안서", "랜딩 페이지", "회사 소개서", "키노트"],

  hero: {
    eyebrow: "디자인 파트너를 찾고 계신가요",
    title: "회사의 이야기를\n한눈에 읽히는 화면으로.",
    // title 안에서 파란색으로 강조할 단어
    titleAccent: "읽히는",
    label: "MANIFESTO",
    description:
      "홈페이지와 발표 자료를 디자인합니다. 처음 보는 사람도 3초 안에 핵심을 이해하도록, 보기 좋은 것보다 읽히는 것을 먼저 만듭니다.",
    cta: "작업 의뢰하기",
    secondary: "작업물 보기",
  },

  about: {
    label: "APPROACH",
    title: "이렇게 일합니다",
    guide: "맡기려는 작업이 아래 세 가지 중 어디에 가까운지 먼저 확인해 보세요. 해당하는 게 있다면 바로 '의뢰하기'로 넘어가시면 됩니다.",
    points: [
      { title: "홈페이지 디자인", body: "회사 소개, 서비스 랜딩, 채용 페이지까지. 기획 단계부터 함께 정리합니다." },
      { title: "PPT · 발표 자료", body: "IR, 제안서, 회사 소개서. 내용 구조를 먼저 잡고 디자인을 입힙니다." },
      { title: "빠른 소통", body: "작업 중간마다 시안을 공유하고, 피드백은 당일 안에 반영합니다." },
    ],
  },

  works: {
    label: "WORKS",
    title: "작업물",
    description: "홈페이지와 발표 자료 6건. 클릭하면 화면을 넘겨보며 자세히 볼 수 있어요.",
    // 메뉴 안내 문구 — 방문자에게 이 메뉴에서 뭘 하면 되는지 알려줍니다.
    guide: "작업물을 누르면 팝업이 열려요. 화살표 키(← →)나 좌우 스와이프로 이미지를 넘기고, 상단의 이전·다음으로 다른 작업을 이어서 볼 수 있어요. 닫을 때는 ESC.",
    // 작업물을 클릭하면 팝업이 열립니다. 칸을 비워두면 그 줄은 팝업에서 사라집니다.
    //   title   : "회사명\n작업명" 처럼 \n 으로 줄바꿈하면 목록·팝업에서 두 줄로 보입니다.
    //   category / description : 목록에 보이는 글자
    //   image   : 목록 오른쪽에 보이는 작은 이미지 (사이트 안 이미지는 images/파일명, 외부 이미지는 https:// 주소)
    //   images  : 팝업 갤러리에 넘겨볼 이미지들. 비우면 색 블록 3장이 대신 보입니다.
    //   detail  : 팝업에 보이는 긴 설명 (비우면 description을 씁니다)
    //   year / role / tools : 팝업의 작업 정보
    //   link    : 팝업의 "프로젝트 보기" 버튼이 여는 주소
    // ※ 아래 6건은 포트폴리오 구성을 보여주기 위한 가상의 샘플 작업입니다. 실제 작업으로 교체하세요.
    items: [
      {
        title: "핀빗\n앱 소개 홈페이지", category: "홈페이지", description: "소비·자산 관리 앱의 서비스 소개 사이트",
        detail: "소비와 자산을 한곳에서 관리하는 핀테크 앱의 소개 사이트입니다. 첫 화면에서 헤드라인과 앱 화면을 한 프레임에 묶어 '무엇을 해주는 앱인지'가 3초 안에 읽히게 했고, 기능 → 요금제 → 다운로드 순으로 한 번에 읽히는 스크롤 흐름을 설계했습니다. 금융 서비스라서 색은 코발트 블루 하나로 제한해 신뢰감을 우선했습니다.",
        year: "2024", role: "UX 설계 · 웹 디자인", tools: "Figma",
        image: "images/w1-1.webp", images: ["images/w1-1.webp", "images/w1-2.webp", "images/w1-3.webp"], link: "",
      },
      {
        title: "팀메이트 AI\n시리즈 A IR 자료", category: "PPT", description: "핵심 지표 중심으로 구성한 투자 유치 발표 자료",
        detail: "투자자가 10분 안에 사업의 핵심을 이해하도록 장표 흐름부터 다시 짰습니다. 가장 중요한 지표를 첫 장에 모으고, 한 장에는 하나의 메시지만 담았어요. 차트는 강조할 막대 하나만 색을 주고 나머지는 같은 색 계열로 눌러서 시선이 숫자로 가게 했습니다.",
        year: "2024", role: "스토리라인 · 장표 디자인", tools: "PowerPoint · Excel",
        image: "images/w2-1.webp", images: ["images/w2-1.webp", "images/w2-2.webp", "images/w2-3.webp"], link: "",
      },
      {
        title: "어센드솔루션\n회사 소개서", category: "PPT", description: "B2B 소프트웨어 기업의 영업용 소개서",
        detail: "영업팀이 제안 메일에 첨부해 보내는 회사 소개서입니다. 고객사가 가장 먼저 찾는 정보(해결하는 문제, 도입 효과, 연혁과 사례)를 앞쪽으로 당기고, 차분한 아이보리와 딥그린 두 색으로 전문성이 느껴지는 에디토리얼 톤을 잡았습니다. 출력해도, 화면으로 넘겨도 읽히도록 여백과 글자 크기를 정했어요.",
        year: "2024", role: "에디토리얼 디자인", tools: "PowerPoint · Illustrator",
        image: "images/w3-1.webp", images: ["images/w3-1.webp", "images/w3-2.webp", "images/w3-3.webp"], link: "",
      },
      {
        title: "배움의 내일\n온라인 강의 플랫폼", category: "홈페이지", description: "수강생 모집 랜딩 페이지와 모바일 신청 흐름",
        detail: "실무 강의를 모집하는 플랫폼의 랜딩 페이지입니다. 따뜻한 노란색과 강사 사진으로 친근함을 주되, 수강 신청 버튼과 커리큘럼은 어디서든 한 번에 닿도록 배치했어요. 신청자의 대부분이 모바일로 들어온다는 전제로 폼을 세 단계로 쪼개 입력 부담을 줄였습니다.",
        year: "2024", role: "웹 디자인 · 퍼블리싱", tools: "Figma · HTML/CSS",
        image: "images/w4-1.webp", images: ["images/w4-1.webp", "images/w4-2.webp", "images/w4-3.webp"], link: "",
      },
      {
        title: "정밀산업\n제조사 기업 홈페이지", category: "홈페이지", description: "제품 카탈로그를 중심에 둔 기업 사이트",
        detail: "제품이 많은 정밀 부품 제조사를 위해 카탈로그를 중심에 둔 기업 사이트를 설계했습니다. 처음 방문한 바이어가 원하는 제품군을 세 번 클릭 안에 찾을 수 있도록 카테고리와 검색을 앞세웠고, 사양표와 카탈로그 다운로드 버튼을 상세 화면 어디서나 보이게 했어요. 주황 포인트 색은 '문의하기' 하나에만 씁니다.",
        year: "2024", role: "정보 구조 설계 · 웹 디자인", tools: "Figma",
        image: "images/w5-1.webp", images: ["images/w5-1.webp", "images/w5-2.webp", "images/w5-3.webp"], link: "",
      },
      {
        title: "몰입 헤드폰\n신제품 런칭 키노트", category: "PPT", description: "무대에서 읽히는 큰 글자 중심의 발표 자료",
        detail: "언론 발표회 무대에서 쓰는 신제품 런칭 키노트입니다. 객석 뒤에서도 읽히도록 헤드라인을 아주 크게 잡고, 검은 배경 위에 제품 하나만 남겨 시선을 모았습니다. 기능 소개, 사양 비교, 가격과 출시일까지 발표 순서에 맞춰 장표를 이어 붙였어요.",
        year: "2024", role: "구성 · 디자인", tools: "Keynote",
        image: "images/w6-1.webp", images: ["images/w6-1.webp", "images/w6-2.webp", "images/w6-3.webp"], link: "",
      },
    ],
  },

  contact: {
    label: "CONTACT",
    title: "작업 의뢰",
    // 큰 검정 버튼. 첫 번째 연락 수단으로 연결됩니다.
    cta: "의뢰 메일 보내기",
    description: "어떤 작업인지, 언제까지 필요한지 짧게 남겨주시면 하루 안에 답장드립니다.",
    guide: "아래 세 가지만 적어 보내주시면 가장 빠르게 견적과 일정을 안내드릴 수 있어요. 자료가 정리되지 않았어도 괜찮아요.",
    stepsTitle: "의뢰는 이렇게 진행돼요",
    steps: [
      { title: "작업 내용 보내기", body: "홈페이지인지 PPT인지, 분량과 용도를 알려주세요. 참고하고 싶은 사이트나 자료 링크가 있으면 함께요." },
      { title: "견적·일정 안내", body: "내용을 확인한 뒤 영업일 기준 하루 안에 견적과 작업 일정을 회신드립니다." },
      { title: "시안 → 수정 → 납품", body: "첫 시안을 공유하고, 수정은 2회까지 포함입니다. 최종 파일과 사용 가이드를 함께 전달해요." },
    ],
    hours: "운영 시간 · 평일 10:00–19:00 (점심 12:30–13:30) · 주말·공휴일 휴무",
    // 쓰지 않는 연락 수단은 value를 비워두면 화면에서 사라집니다.
    channels: [
      // ※ 아래 연락처는 모두 가상의 샘플입니다. 실제 연락처로 교체하세요.
      { label: "이메일", value: "hello@oneday-studio.example", href: "mailto:hello@oneday-studio.example" },
      { label: "전화", value: "010-1234-5678", href: "tel:01012345678" },
      { label: "카카오톡 오픈채팅", value: "오픈채팅으로 문의하기", href: "https://open.kakao.com/" },
      { label: "인스타그램", value: "@oneday.studio", href: "https://www.instagram.com/" },
    ],
  },

  footer: "© 2026 원데이 스튜디오",
};
