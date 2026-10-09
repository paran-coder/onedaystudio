// 저장된 내용(d)을 content.js의 기본값(S) 위에 덮어씁니다. 저장된 게 없으면 기본값이 그대로 남습니다.
window.mergeContent = function (S, d) {
  if (!d || typeof d !== "object") return S;
  if (d.hero && d.hero.description) S.hero.description = d.hero.description;
  if (d.contact) {
    if (d.contact.description) S.contact.description = d.contact.description;
    if (Array.isArray(d.contact.channels)) S.contact.channels = d.contact.channels;
  }
  if (d.works && Array.isArray(d.works.items)) S.works.items = d.works.items;
  return S;
};
