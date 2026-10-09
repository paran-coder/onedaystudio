-- Supabase > SQL Editor 에 통째로 붙여넣고 Run 하세요. (한 번만)
-- 사이트 내용을 JSON 한 줄(id = 1)로 저장하는 표입니다.

create table if not exists site_content (
  id int primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 보안 설정(RLS)을 켜고 정책은 만들지 않습니다.
-- 브라우저에서는 이 표에 직접 접근할 수 없고, 서버 함수(/api/content)만 읽고 씁니다.
alter table site_content enable row level security;
