(function () {
  const $ = (id) => document.getElementById(id);
  const pad3 = (i) => String(i + 1).padStart(3, "0");
  const h = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "value") n.value = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (v === true) n.setAttribute(k, "");
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    kids.flat().forEach((c) => c != null && n.append(c));
    return n;
  };

  let pw = sessionStorage.getItem("adminpw") || "";
  let S = null;
  let dirty = false;
  let openRow = -1;
  let dragFrom = -1;

  const say = (id, text, kind) => {
    const n = $(id);
    n.textContent = text;
    n.classList.toggle("is-error", kind === "error");
    n.classList.toggle("is-ok", kind === "ok");
  };

  function markDirty() {
    dirty = true;
    $("editor").querySelector(".savebar").classList.add("is-dirty");
    say("status", "저장하지 않은 변경이 있어요.");
  }

  async function api(method, body, query = "") {
    return fetch(`/api/content${query}`, {
      method,
      cache: "no-store",
      headers: { "x-admin-password": pw, ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async function enter(password, auto) {
    pw = password;
    const msg = (t, k) => (auto ? null : say("login-msg", t, k));
    msg("확인하는 중…");
    let res;
    try {
      res = await api("GET", null, "?auth=1");
    } catch {
      return msg("서버에 연결할 수 없어요. 배포된 주소에서 열었는지 확인하세요.", "error");
    }
    if (res.status === 401) {
      pw = "";
      sessionStorage.removeItem("adminpw");
      return msg("비밀번호가 맞지 않아요.", "error");
    }
    if (res.status === 503) return msg("저장소(Supabase)가 아직 연결되지 않았어요. Vercel 환경변수를 확인하세요.", "error");
    if (!res.ok) return msg(`내용을 불러오지 못했어요. (${res.status})`, "error");

    const remote = await res.json();
    S = window.mergeContent(structuredClone(window.SITE), remote);
    S.works.items.forEach((w) => {
      w.hidden = Boolean(w.hidden);
      w.images = Array.isArray(w.images) ? w.images : [];
    });
    sessionStorage.setItem("adminpw", pw);
    $("login").hidden = true;
    $("editor").hidden = false;
    $("logout").hidden = false;
    renderAll();
  }

  function renderAll() {
    const intro = $("intro");
    intro.value = S.hero.description || "";
    intro.oninput = () => {
      S.hero.description = intro.value;
      markDirty();
    };
    const cd = $("contact-desc");
    cd.value = S.contact.description || "";
    cd.oninput = () => {
      S.contact.description = cd.value;
      markDirty();
    };
    renderChannels();
    renderWorks();
  }

  function renderChannels() {
    const box = $("channels");
    box.replaceChildren();
    S.contact.channels.forEach((c, i) => {
      let hrefInput = null;
      const syncHref = () => {
        const v = (c.value || "").trim();
        const cur = c.href || "";
        let next = null;
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && (!cur || cur.startsWith("mailto:"))) next = `mailto:${v}`;
        else if (/^\+?[\d\s\-()]{7,}$/.test(v) && (!cur || cur.startsWith("tel:"))) next = `tel:${v.replace(/[^\d+]/g, "")}`;
        if (next) {
          c.href = next;
          hrefInput.value = next;
        }
      };
      const bind = (key, ph, label) =>
        h("input", {
          value: c[key] || "",
          placeholder: ph,
          "aria-label": label,
          oninput: (e) => {
            c[key] = e.target.value;
            if (key === "value") syncHref();
            markDirty();
          },
        });
      hrefInput = bind("href", "링크 (이메일·전화번호는 자동으로 채워져요)", "링크");
      box.append(
        h(
          "div",
          { class: "chan" },
          bind("label", "이름 (예: 이메일)", "연락 수단 이름"),
          bind("value", "화면에 보일 글자", "화면에 보일 글자"),
          hrefInput,
          h("button", {
            type: "button",
            class: "tbtn",
            text: "삭제",
            onclick: () => {
              S.contact.channels.splice(i, 1);
              markDirty();
              renderChannels();
            },
          }),
        ),
      );
    });
  }

  function move(from, to) {
    const items = S.works.items;
    if (to < 0 || to >= items.length || from === to) return;
    items.splice(to, 0, items.splice(from, 1)[0]);
    openRow = -1;
    markDirty();
    renderWorks();
  }

  function renderWorks() {
    const ul = $("works-admin");
    ul.replaceChildren();
    S.works.items.forEach((w, i) => ul.append(workRow(w, i)));
  }

  function field(label, input, wide) {
    return h("label", { class: "field" + (wide ? " field--wide" : "") }, h("span", { text: label }), input);
  }

  function workRow(w, i) {
    const items = S.works.items;
    const li = h("li", { class: "row" + (w.hidden ? " is-hidden" : "") });
    const titleEl = h("span", { class: "row__title", text: w.title || "(제목 없음)" });

    const handle = h("span", { class: "row__handle", draggable: "true", title: "끌어서 순서 바꾸기", text: "⠿" });
    handle.addEventListener("dragstart", (e) => {
      dragFrom = i;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(i));
      e.dataTransfer.setDragImage(li, 0, 0);
      li.classList.add("is-dragging");
    });
    handle.addEventListener("dragend", () => {
      dragFrom = -1;
      li.classList.remove("is-dragging");
      document.querySelectorAll(".row.is-over").forEach((n) => n.classList.remove("is-over"));
    });
    li.addEventListener("dragover", (e) => {
      if (dragFrom < 0) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      li.classList.add("is-over");
    });
    li.addEventListener("dragleave", () => li.classList.remove("is-over"));
    li.addEventListener("drop", (e) => {
      e.preventDefault();
      const from = dragFrom;
      dragFrom = -1;
      if (from >= 0) move(from, i);
    });

    const head = h(
      "div",
      { class: "row__head" },
      handle,
      h("span", { class: "row__idx", text: pad3(i) }),
      titleEl,
      h("span", { class: "row__cat", text: w.category }),
      w.hidden ? h("span", { class: "badge", text: "숨김" }) : null,
      h(
        "div",
        { class: "row__tools" },
        h("button", { type: "button", class: "tbtn", text: "↑", "aria-label": "위로", disabled: i === 0, onclick: () => move(i, i - 1) }),
        h("button", { type: "button", class: "tbtn", text: "↓", "aria-label": "아래로", disabled: i === items.length - 1, onclick: () => move(i, i + 1) }),
        h("button", {
          type: "button",
          class: "tbtn",
          text: openRow === i ? "접기" : "수정",
          "aria-expanded": String(openRow === i),
          onclick: () => {
            openRow = openRow === i ? -1 : i;
            renderWorks();
          },
        }),
        h("button", {
          type: "button",
          class: "tbtn",
          text: w.hidden ? "다시 보이기" : "숨기기",
          onclick: () => {
            w.hidden = !w.hidden;
            markDirty();
            renderWorks();
          },
        }),
      ),
    );
    li.append(head);

    if (openRow === i) {
      const text = (key, label, extra = {}) =>
        field(
          label,
          h("input", {
            value: w[key] || "",
            ...extra,
            oninput: (e) => {
              w[key] = e.target.value;
              if (key === "title") titleEl.textContent = e.target.value || "(제목 없음)";
              markDirty();
            },
          }),
        );
      li.append(
        h(
          "div",
          { class: "row__form" },
          text("title", "제목", { maxlength: "120" }),
          text("category", "구분 (예: 홈페이지, PPT)", { maxlength: "40" }),
          field(
            "목록에 보이는 한 줄 설명",
            h("input", {
              value: w.description || "",
              maxlength: "200",
              oninput: (e) => {
                w.description = e.target.value;
                markDirty();
              },
            }),
            true,
          ),
          field(
            "팝업에 보이는 자세한 설명",
            h("textarea", {
              rows: "4",
              maxlength: "1500",
              value: w.detail || "",
              oninput: (e) => {
                w.detail = e.target.value;
                markDirty();
              },
            }),
            true,
          ),
          text("year", "기간 (예: 2026)", { maxlength: "20" }),
          text("role", "역할", { maxlength: "60" }),
          text("tools", "도구", { maxlength: "100" }),
          text("link", "프로젝트 링크 (선택)", { placeholder: "https://…", maxlength: "2000" }),
          text("image", "목록 썸네일 이미지 주소 (선택)", { placeholder: "https://…", maxlength: "2000" }),
          field(
            "팝업 갤러리 이미지 주소 (한 줄에 하나, 선택)",
            h("textarea", {
              rows: "3",
              placeholder: "https://…\nhttps://…",
              value: w.images.join("\n"),
              oninput: (e) => {
                w.images = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                markDirty();
              },
            }),
            true,
          ),
        ),
      );
    }
    return li;
  }

  $("add-work").onclick = () => {
    S.works.items.push({
      title: "새 작업물", category: "홈페이지", description: "", detail: "",
      year: "", role: "", tools: "", image: "", images: [], link: "", hidden: false,
    });
    openRow = S.works.items.length - 1;
    markDirty();
    renderWorks();
  };
  $("add-channel").onclick = () => {
    S.contact.channels.push({ label: "", value: "", href: "" });
    markDirty();
    renderChannels();
  };

  $("save").onclick = async () => {
    const btn = $("save");
    btn.disabled = true;
    say("status", "저장하는 중…");
    try {
      const res = await api("POST", {
        hero: { description: S.hero.description },
        contact: { description: S.contact.description, channels: S.contact.channels },
        works: { items: S.works.items },
      });
      if (res.status === 401) {
        say("status", "비밀번호가 바뀌었거나 만료됐어요. 다시 로그인해 주세요.", "error");
      } else if (!res.ok) {
        say("status", `저장하지 못했어요. (${res.status})`, "error");
      } else {
        dirty = false;
        $("editor").querySelector(".savebar").classList.remove("is-dirty");
        say("status", "저장했어요. 사이트에 바로 반영됐습니다.", "ok");
      }
    } catch {
      say("status", "서버에 연결할 수 없어요.", "error");
    }
    btn.disabled = false;
  };

  $("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    enter($("pw").value, false);
  });
  $("logout").onclick = () => {
    sessionStorage.removeItem("adminpw");
    location.reload();
  };
  window.addEventListener("beforeunload", (e) => {
    if (dirty) e.preventDefault();
  });

  if (pw) enter(pw, true);
})();
