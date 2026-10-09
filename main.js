(async function () {
  const S = window.SITE;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch("/api/content", { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (res.ok) window.mergeContent(S, await res.json());
  } catch (e) {
    // 저장소에 연결되지 않으면 content.js의 기본 내용을 그대로 보여줍니다.
  }
  S.works.items = S.works.items.filter((w) => !w.hidden);

  const get =(path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), S);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const safeUrl = (u) => (/^(https?:|mailto:|tel:)/i.test(u || "") ? u : "");
  const imgUrl = (u) => {
    const s = String(u || "");
    if (/^https?:/i.test(s)) return s;
    return /^\/?images\/[\w\-./]+$/.test(s) && !s.includes("..") ? s : "";
  };
  const pad = (i, n) => String(i + 1).padStart(n, "0");

  document.querySelectorAll("[data-text]").forEach((n) => {
    const v = get(n.dataset.text);
    if (v != null) n.textContent = v;
  });
  document.title = `${S.name} — ${S.tagline}`;

  const h1 = document.getElementById("hero-title");
  const { title, titleAccent } = S.hero;
  const at = titleAccent ? title.indexOf(titleAccent) : -1;
  if (at < 0) {
    h1.textContent = title;
  } else {
    h1.append(title.slice(0, at), el("span", "accent", titleAccent), title.slice(at + titleAccent.length));
  }

  const works = document.getElementById("works-list");
  S.works.items.forEach((w, i) => {
    const item = el("button", "item item--work");
    item.type = "button";
    item.setAttribute("aria-haspopup", "dialog");
    item.addEventListener("click", () => openModal(i));
    const meta = el("div", "item__meta");
    meta.append(el("span", "item__cat", w.category), el("span", "item__desc", w.description));
    item.append(el("span", "item__index", pad(i, 3)), el("span", "item__title", w.title), meta);
    const img = imgUrl(w.image);
    if (img) {
      const im = el("img", "item__thumb");
      const wrap = el("span", "item__thumbwrap");
      im.addEventListener("error", () => {
        wrap.classList.add("is-fallback");
        wrap.replaceChildren(el("span", null, w.category));
      });
      im.src = img;
      im.alt = w.title.replace(/\n/g, " ");
      im.loading = "lazy";
      wrap.appendChild(im);
      item.appendChild(wrap);
    }
    item.appendChild(el("span", "item__arrow", "+"));
    works.appendChild(item);
  });

  /* ---------- 작업물 팝업 ---------- */
  const $ = (id) => document.getElementById(id);
  const modal = $("modal");
  const items = S.works.items;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FADE_MS = reduceMotion ? 0 : 300;
  let current = -1;
  let slide = 0;
  let slideCount = 0;
  let lastFocus = null;
  let closeTimer = 0;

  function buildSlides(w) {
    const track = $("track");
    const thumbs = $("thumbs");
    track.replaceChildren();
    thumbs.replaceChildren();
    const imgs = (w.images || []).map(imgUrl).filter(Boolean);
    slideCount = imgs.length || 3;
    for (let n = 0; n < slideCount; n++) {
      const s = el("div", "slide");
      if (imgs.length) {
        const im = document.createElement("img");
        im.addEventListener("error", () => {
          s.classList.add(`slide--t${n % 3}`);
          s.replaceChildren(el("span", "slide__label", `${w.category} ${pad(n, 2)}`));
        });
        im.src = imgs[n];
        im.alt = `${w.title.replace(/\n/g, " ")} ${n + 1}`;
        im.draggable = false;
        s.appendChild(im);
      } else {
        s.classList.add(`slide--t${n % 3}`);
        s.appendChild(el("span", "slide__label", `${w.category} ${pad(n, 2)}`));
      }
      track.appendChild(s);
      const t = el("button", "thumb", pad(n, 2));
      t.type = "button";
      t.setAttribute("aria-label", `${n + 1}번째 이미지`);
      t.addEventListener("click", () => goSlide(n));
      thumbs.appendChild(t);
    }
    const multi = slideCount > 1;
    $("slide-prev").hidden = !multi;
    $("slide-next").hidden = !multi;
    thumbs.hidden = !multi;
    goSlide(0);
  }

  function goSlide(n) {
    slide = (n + slideCount) % slideCount;
    $("track").style.transform = `translateX(-${slide * 100}%)`;
    [...$("thumbs").children].forEach((t, k) => {
      t.classList.toggle("is-active", k === slide);
      if (k === slide) t.setAttribute("aria-current", "true");
      else t.removeAttribute("aria-current");
    });
  }

  function renderWork(i) {
    current = (i + items.length) % items.length;
    const w = items[current];
    $("modal-count").textContent = `${pad(current, 3)} / ${String(items.length).padStart(3, "0")}`;
    $("modal-cat").textContent = w.category;
    $("modal-title").textContent = w.title;
    $("modal-desc").textContent = w.detail || w.description;

    const meta = $("modal-meta");
    meta.replaceChildren();
    [["기간", w.year], ["역할", w.role], ["도구", w.tools]]
      .filter(([, v]) => v)
      .forEach(([k, v]) => {
        const row = el("div", "meta__row");
        row.append(el("dt", null, k), el("dd", null, v));
        meta.appendChild(row);
      });
    meta.hidden = !meta.children.length;

    const link = $("modal-link");
    const href = safeUrl(w.link);
    link.hidden = !href;
    if (href) link.href = href;

    buildSlides(w);
    history.replaceState(null, "", `#work-${current + 1}`);
  }

  function openModal(i) {
    clearTimeout(closeTimer);
    const wasOpen = !modal.hidden;
    if (!wasOpen) {
      lastFocus = document.activeElement;
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = sw ? `${sw}px` : "";
      document.documentElement.classList.add("is-locked");
      modal.hidden = false;
      modal.querySelector(".modal__body").scrollTop = 0;
    }
    renderWork(i);
    if (!wasOpen) {
      void modal.offsetWidth;
      modal.classList.add("is-open");
      $("modal-close").focus();
    }
  }

  function closeModal(updateHash = true) {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    closeTimer = setTimeout(() => {
      modal.hidden = true;
      document.documentElement.classList.remove("is-locked");
      document.body.style.paddingRight = "";
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    }, FADE_MS);
    current = -1;
    if (updateHash) history.replaceState(null, "", location.pathname + location.search);
  }

  modal.querySelectorAll("[data-close]").forEach((n) => n.addEventListener("click", () => closeModal()));
  $("modal-close").addEventListener("click", () => closeModal());
  $("modal-prev").addEventListener("click", () => renderWork(current - 1));
  $("modal-next").addEventListener("click", () => renderWork(current + 1));
  $("slide-prev").addEventListener("click", () => goSlide(slide - 1));
  $("slide-next").addEventListener("click", () => goSlide(slide + 1));

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    } else if (e.key === "ArrowLeft" && slideCount > 1) {
      goSlide(slide - 1);
    } else if (e.key === "ArrowRight" && slideCount > 1) {
      goSlide(slide + 1);
    } else if (e.key === "Tab") {
      const f = [...modal.querySelectorAll("button, a[href]")].filter((n) => !n.hidden && n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  let startX = null;
  const stage = $("stage");
  stage.addEventListener("pointerdown", (e) => { startX = e.clientX; });
  stage.addEventListener("pointerup", (e) => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40 && slideCount > 1) goSlide(slide + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener("pointercancel", () => { startX = null; });

  const fromHash = () => {
    const m = /^#work-(\d+)$/.exec(location.hash);
    const idx = m ? Number(m[1]) - 1 : -1;
    if (idx >= 0 && idx < items.length) openModal(idx);
    else closeModal(false);
  };
  window.addEventListener("hashchange", fromHash);
  if (/^#work-\d+$/.test(location.hash)) fromHash();

  const points = document.getElementById("about-points");
  S.about.points.forEach((p, i) => {
    const cell = el("div", "cell");
    cell.append(el("span", "cell__index", pad(i, 2)), el("h3", null, p.title), el("p", null, p.body));
    points.appendChild(cell);
  });

  const steps = document.getElementById("contact-steps");
  if (steps) {
    (S.contact.steps || []).forEach((s, i) => {
      const cell = el("div", "cell");
      cell.append(el("span", "cell__index", pad(i, 2)), el("h3", null, s.title), el("p", null, s.body));
      steps.appendChild(cell);
    });
  }

  const channels = S.contact.channels.filter((c) => c.value && safeUrl(c.href));
  const list = document.getElementById("contact-channels");
  channels.forEach((c, i) => {
    const a = el("a", "item");
    a.href = c.href;
    if (/^https?:/i.test(c.href)) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    const meta = el("div", "item__meta");
    meta.appendChild(el("span", "item__cat", c.label));
    a.append(el("span", "item__index", pad(i, 3)), el("h3", "item__title", c.value), meta, el("span", "item__arrow", "→"));
    list.appendChild(a);
  });

  /* ---------- 움직임 효과 ---------- */
  const track = document.getElementById("marquee-track");
  const words = S.marquee || [];
  if (track && words.length) {
    const group = () => {
      const g = el("div", "marquee__group");
      for (let r = 0; r < 2; r++) words.forEach((w) => g.append(el("span", "marquee__word", w), el("i", "marquee__sep")));
      return g;
    };
    track.append(group(), group());
  } else if (track) {
    track.parentElement.remove();
  }

  const nav = document.querySelector(".nav");
  const spyLinks = [...document.querySelectorAll("[data-spy]")];
  let ticking = false;
  const updateProgress = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0");
    if (window.scrollY < 200) spyLinks.forEach((a) => a.classList.remove("is-active"));
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) spyLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.spy === e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spyLinks.forEach((a) => {
      const section = document.getElementById(a.dataset.spy);
      if (section) io.observe(section);
    });
  }

})();
