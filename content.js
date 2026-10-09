// 사이트에 보이는 글자는 전부 이 파일에서 바꿉니다.
window.SITE = {
  name: "원데이 스튜디오",
  tagline: "홈페이지 · PPT 디자인",

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
    points: [
      { title: "홈페이지 디자인", body: "회사 소개, 서비스 랜딩, 채용 페이지까지. 기획 단계부터 함께 정리합니다." },
      { title: "PPT · 발표 자료", body: "IR, 제안서, 회사 소개서. 내용 구조를 먼저 잡고 디자인을 입힙니다." },
      { title: "빠른 소통", body: "작업 중간마다 시안을 공유하고, 피드백은 당일 안에 반영합니다." },
    ],
  },

  works: {
    label: "WORKS",
    title: "작업물",
    description: "최근에 작업한 프로젝트입니다. 클릭하면 자세히 볼 수 있어요.",
    // 작업물을 클릭하면 팝업이 열립니다. 칸을 비워두면 그 줄은 팝업에서 사라집니다.
    //   title / category / description : 목록에 보이는 글자
    //   image   : 목록 오른쪽에 보이는 작은 이미지 주소(URL)
    //   images  : 팝업 갤러리에 넘겨볼 이미지 주소들. 비우면 색 블록 3장이 대신 보입니다.
    //   detail  : 팝업에 보이는 긴 설명 (비우면 description을 씁니다)
    //   year / role / tools : 팝업의 작업 정보
    //   link    : 팝업의 "프로젝트 보기" 버튼이 여는 주소
    items: [
      {
        title: "핀테크 스타트업 홈페이지", category: "홈페이지", description: "서비스 소개와 사전 신청 랜딩 페이지",
        detail: "출시 전 사전 신청을 받기 위한 랜딩 페이지입니다. 서비스가 무엇인지 첫 화면에서 한 문장으로 전달하고, 신청 버튼까지 스크롤 한 번 안에 닿도록 구성했습니다.",
        year: "2026", role: "기획 · 디자인", tools: "Figma", image: "", images: [], link: "",
      },
      {
        title: "시리즈 A 투자 IR 자료", category: "PPT", description: "30장 분량 투자 유치 발표 자료",
        detail: "투자자가 10분 안에 사업의 핵심을 이해하도록 장표 흐름부터 다시 짰습니다. 숫자는 크게, 설명은 짧게. 한 장에 하나의 메시지만 담았어요.",
        year: "2026", role: "구성 · 디자인", tools: "PowerPoint", image: "", images: [], link: "",
      },
      {
        title: "브랜드 리뉴얼 회사 소개서", category: "PPT", description: "영업용 회사 소개서 전면 개편",
        detail: "영업팀이 메일에 첨부해 보내는 소개서를 브랜드 리뉴얼에 맞춰 전면 개편했습니다. 고객사가 가장 먼저 찾는 정보(실적, 도입 사례, 연락처)를 앞쪽으로 당겼습니다.",
        year: "2025", role: "디자인", tools: "PowerPoint · Illustrator", image: "", images: [], link: "",
      },
      {
        title: "교육 플랫폼 랜딩 페이지", category: "홈페이지", description: "강의 모집용 원페이지 사이트",
        detail: "강의 모집 기간에 맞춰 만든 원페이지 사이트입니다. 커리큘럼, 강사 소개, 후기를 한 흐름으로 읽히게 배치하고 신청 버튼을 화면 하단에 고정했습니다.",
        year: "2025", role: "디자인 · 퍼블리싱", tools: "Figma · HTML/CSS", image: "", images: [], link: "",
      },
      {
        title: "제조사 기업 홈페이지", category: "홈페이지", description: "제품 카탈로그를 포함한 기업 사이트",
        detail: "제품이 많은 제조사를 위해 카탈로그를 중심에 둔 기업 사이트를 설계했습니다. 처음 방문한 바이어도 원하는 제품군을 세 번 클릭 안에 찾을 수 있게 했습니다.",
        year: "2025", role: "기획 · 디자인", tools: "Figma", image: "", images: [], link: "",
      },
      {
        title: "신제품 런칭 발표 자료", category: "PPT", description: "언론 발표회용 키노트",
        detail: "언론 발표회 무대에서 쓰는 키노트입니다. 멀리서도 읽히는 큰 글자와 제품 이미지 중심으로 구성하고, 발표 흐름에 맞춘 전환 효과를 넣었습니다.",
        year: "2024", role: "구성 · 디자인", tools: "Keynote", image: "", images: [], link: "",
      },
    ],
  },

  contact: {
    label: "CONTACT",
    title: "작업 의뢰",
    // 큰 검정 버튼. 첫 번째 연락 수단으로 연결됩니다.
    cta: "의뢰 메일 보내기",
    description: "어떤 작업인지, 언제까지 필요한지 짧게 남겨주시면 하루 안에 답장드립니다.",
    // 쓰지 않는 연락 수단은 value를 비워두면 화면에서 사라집니다.
    channels: [
      { label: "이메일", value: "hello@example.com", href: "mailto:hello@example.com" },
      { label: "카카오톡 오픈채팅", value: "오픈채팅으로 문의하기", href: "https://open.kakao.com/" },
      { label: "전화", value: "010-0000-0000", href: "tel:01000000000" },
    ],
  },

  footer: "© 2026 원데이 스튜디오",
};
