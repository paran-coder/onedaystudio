const crypto = require("crypto");

const MAX_BODY = 300000;

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const anyUrl = (v) => {
  const s = str(v, 2000);
  return /^(https?:|mailto:|tel:)/i.test(s) ? s : "";
};
const httpUrl = (v) => {
  const s = str(v, 2000);
  if (/^https?:/i.test(s)) return s;
  return /^\/images\/[\w\-./]+$/.test(s) && !s.includes("..") ? s : "";
};

function clean(input) {
  const d = input && typeof input === "object" ? input : {};
  const out = {};
  if (d.hero && typeof d.hero === "object") {
    out.hero = { description: str(d.hero.description, 600) };
  }
  if (d.contact && typeof d.contact === "object") {
    const channels = Array.isArray(d.contact.channels) ? d.contact.channels : [];
    out.contact = {
      description: str(d.contact.description, 400),
      channels: channels.slice(0, 8).map((c) => ({
        label: str(c && c.label, 40),
        value: str(c && c.value, 120),
        href: anyUrl(c && c.href),
      })),
    };
  }
  if (d.works && Array.isArray(d.works.items)) {
    out.works = {
      items: d.works.items.slice(0, 60).map((w) => ({
        title: str(w && w.title, 120),
        category: str(w && w.category, 40),
        description: str(w && w.description, 200),
        detail: str(w && w.detail, 1500),
        year: str(w && w.year, 20),
        role: str(w && w.role, 60),
        tools: str(w && w.tools, 100),
        image: httpUrl(w && w.image),
        images: (Array.isArray(w && w.images) ? w.images : []).slice(0, 12).map(httpUrl).filter(Boolean),
        link: anyUrl(w && w.link),
        hidden: Boolean(w && w.hidden),
      })),
    };
  }
  return out;
}

function isAdmin(req) {
  const real = process.env.ADMIN_PASSWORD;
  const given = req.headers["x-admin-password"];
  if (!real || typeof given !== "string") return false;
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

function supabase(path, init = {}) {
  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_KEY;
  const headers = { apikey: key, "Content-Type": "application/json", ...init.headers };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  return fetch(`${base}/rest/v1/${path}`, { ...init, headers });
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(503).json({ error: "not_configured" });
  }

  try {
    if (req.method === "GET") {
      const admin = isAdmin(req);
      if (req.query && req.query.auth === "1" && !admin) {
        await new Promise((r) => setTimeout(r, 400));
        return res.status(401).json({ error: "unauthorized" });
      }
      const r = await supabase("site_content?id=eq.1&select=data");
      if (!r.ok) return res.status(502).json({ error: "db_read_failed" });
      const rows = await r.json();
      let data = (rows[0] && rows[0].data) || {};
      if (!admin && data.works && Array.isArray(data.works.items)) {
        data = { ...data, works: { items: data.works.items.filter((w) => !w.hidden) } };
      }
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      if (!isAdmin(req)) {
        await new Promise((r) => setTimeout(r, 400));
        return res.status(401).json({ error: "unauthorized" });
      }
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: "bad_json" });
        }
      }
      if (JSON.stringify(body || {}).length > MAX_BODY) return res.status(413).json({ error: "too_large" });
      const r = await supabase("site_content?on_conflict=id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ id: 1, data: clean(body), updated_at: new Date().toISOString() }),
      });
      if (!r.ok) return res.status(502).json({ error: "db_write_failed" });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  } catch {
    return res.status(500).json({ error: "server_error" });
  }
};
