import { useState, useEffect, useRef } from "react";

const INITIAL_SECTIONS = [
  {
    id: "s1",
    name: "Social",
    bookmarks: [
      { id: "b1", name: "Twitter / X", url: "https://x.com", favicon: "https://www.google.com/s2/favicons?domain=x.com&sz=64" },
      { id: "b2", name: "Reddit", url: "https://reddit.com", favicon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=64" },
      { id: "b3", name: "LinkedIn", url: "https://linkedin.com", favicon: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=64" },
      { id: "b4", name: "YouTube", url: "https://youtube.com", favicon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64" },
    ],
  },
  {
    id: "s2",
    name: "Work",
    bookmarks: [
      { id: "b5", name: "Gmail", url: "https://mail.google.com", favicon: "https://www.google.com/s2/favicons?domain=gmail.com&sz=64" },
      { id: "b6", name: "Notion", url: "https://notion.so", favicon: "https://www.google.com/s2/favicons?domain=notion.so&sz=64" },
      { id: "b7", name: "Figma", url: "https://figma.com", favicon: "https://www.google.com/s2/favicons?domain=figma.com&sz=64" },
      { id: "b8", name: "Linear", url: "https://linear.app", favicon: "https://www.google.com/s2/favicons?domain=linear.app&sz=64" },
    ],
  },
  {
    id: "s3",
    name: "Dev",
    bookmarks: [
      { id: "b9", name: "GitHub", url: "https://github.com", favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64" },
      { id: "b10", name: "Stack Overflow", url: "https://stackoverflow.com", favicon: "https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64" },
      { id: "b11", name: "Hacker News", url: "https://news.ycombinator.com", favicon: "https://www.google.com/s2/favicons?domain=news.ycombinator.com&sz=64" },
      { id: "b12", name: "MDN", url: "https://developer.mozilla.org", favicon: "https://www.google.com/s2/favicons?domain=developer.mozilla.org&sz=64" },
    ],
  },
  {
    id: "s4",
    name: "Entertainment",
    bookmarks: [
      { id: "b13", name: "Spotify", url: "https://spotify.com", favicon: "https://www.google.com/s2/favicons?domain=spotify.com&sz=64" },
      { id: "b14", name: "Netflix", url: "https://netflix.com", favicon: "https://www.google.com/s2/favicons?domain=netflix.com&sz=64" },
      { id: "b15", name: "Wikipedia", url: "https://wikipedia.org", favicon: "https://www.google.com/s2/favicons?domain=wikipedia.org&sz=64" },
    ],
  },
];

type Bookmark = { id: string; name: string; url: string; favicon: string };
type Section = { id: string; name: string; bookmarks: Bookmark[] };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

// ── Edit bookmark modal ───────────────────────────────────────────────────────
function EditBookmarkModal({
  bm, dark, onSave, onClose,
}: {
  bm: Bookmark; dark: boolean; onSave: (updated: Bookmark) => void; onClose: () => void;
}) {
  const [name, setName] = useState(bm.name);
  const [url, setUrl] = useState(bm.url);
  const [customIcon, setCustomIcon] = useState("");
  const [useCustomIcon, setUseCustomIcon] = useState(false);
  const [previewFavicon, setPreviewFavicon] = useState(bm.favicon);
  const urlDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-refresh favicon when URL changes (unless custom icon is set)
  useEffect(() => {
    if (useCustomIcon) return;
    if (urlDebounce.current) clearTimeout(urlDebounce.current);
    urlDebounce.current = setTimeout(() => {
      try {
        const clean = url.startsWith("http") ? url : `https://${url}`;
        const domain = new URL(clean).hostname;
        setPreviewFavicon(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
      } catch {}
    }, 400);
    return () => { if (urlDebounce.current) clearTimeout(urlDebounce.current); };
  }, [url, useCustomIcon]);

  // When custom icon URL changes, update preview
  useEffect(() => {
    if (useCustomIcon && customIcon.trim()) setPreviewFavicon(customIcon.trim());
  }, [customIcon, useCustomIcon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    onSave({ ...bm, name: name.trim(), url: cleanUrl, favicon: previewFavicon });
    onClose();
  };

  const inp = {
    border: `1px solid ${dark ? "#444" : "#e2e1dc"}`,
    background: dark ? "#1e1e1e" : "#fff",
    color: dark ? "#f0efeb" : "#1a1a1a",
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="rounded-2xl p-6 w-[340px] shadow-2xl"
        style={{ background: dark ? "#252525" : "#fff", color: dark ? "#f0efeb" : "#1a1a1a" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: dark ? "#2e2e2e" : "#f5f4f0", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}
          >
            <img
              src={previewFavicon}
              alt="preview"
              className="w-7 h-7 object-contain"
              onError={() => setPreviewFavicon(`https://www.google.com/s2/favicons?domain=${url}&sz=64`)}
            />
          </div>
          <div>
            <div className="text-[13px] font-semibold leading-tight">{name || "Bookmark"}</div>
            <div className="text-[11px] mt-0.5 truncate max-w-[200px]" style={{ color: dark ? "#666" : "#aaa" }}>{url || "—"}</div>
          </div>
        </div>

        <h3 className="text-[13px] font-semibold mb-3" style={{ color: dark ? "#888" : "#aaa" }}>EDIT BOOKMARK</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-medium mb-1 block" style={{ color: dark ? "#666" : "#aaa" }}>Name</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Bookmark name"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition" style={inp} />
          </div>
          <div>
            <label className="text-[11px] font-medium mb-1 block" style={{ color: dark ? "#666" : "#aaa" }}>URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition" style={inp} />
          </div>

          {/* Icon section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium" style={{ color: dark ? "#666" : "#aaa" }}>Icon</label>
              <button
                type="button"
                onClick={() => {
                  setUseCustomIcon((v) => {
                    if (v) {
                      // revert to auto
                      setCustomIcon("");
                      try {
                        const clean = url.startsWith("http") ? url : `https://${url}`;
                        const domain = new URL(clean).hostname;
                        setPreviewFavicon(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
                      } catch {}
                    }
                    return !v;
                  });
                }}
                className="text-[11px] font-medium transition hover:opacity-80"
                style={{ color: useCustomIcon ? "#2563eb" : (dark ? "#555" : "#bbb") }}
              >
                {useCustomIcon ? "Use auto icon" : "Set custom icon"}
              </button>
            </div>
            {useCustomIcon ? (
              <input
                value={customIcon}
                onChange={(e) => setCustomIcon(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                style={inp}
              />
            ) : (
              <div
                className="w-full rounded-lg px-3 py-2 text-sm flex items-center gap-2"
                style={{ ...inp, opacity: 0.6, cursor: "default" }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: dark ? "#666" : "#bbb", flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span style={{ color: dark ? "#555" : "#bbb" }}>Auto-fetched from URL</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition"
              style={{ background: dark ? "#333" : "#f5f4f0", color: dark ? "#bbb" : "#555" }}>
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Bookmark tile ─────────────────────────────────────────────────────────────
function BookmarkTile({
  bm, dark, editMode, onRemove, onEdit,
}: {
  bm: Bookmark; dark: boolean; editMode: boolean; onRemove: () => void; onEdit: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="relative flex flex-col items-center gap-2 cursor-pointer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => editMode ? onEdit() : window.open(bm.url, "_blank")}
    >
      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-150"
        style={{
          background: dark ? "#2e2e2e" : "#fff",
          boxShadow: hov
            ? dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.12)"
            : dark ? "0 1px 6px rgba(0,0,0,0.3)" : "0 1px 6px rgba(0,0,0,0.07)",
          transform: hov && !editMode ? "translateY(-2px)" : "translateY(0)",
          outline: editMode && hov ? `2px solid ${dark ? "#3b82f6" : "#93c5fd"}` : "none",
        }}
      >
        <img src={bm.favicon} alt={bm.name} className="w-7 h-7 object-contain" />
        {/* Remove badge */}
        {editMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center shadow-sm hover:bg-red-600 transition"
          >
            ×
          </button>
        )}
        {/* Edit overlay hint */}
        {editMode && hov && (
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/30">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <span
        className="text-[11px] font-medium truncate max-w-[60px] text-center leading-tight transition-colors duration-300"
        style={{ color: dark ? "#999" : "#444" }}
      >
        {bm.name}
      </span>
    </div>
  );
}

// ── Add bookmark modal ────────────────────────────────────────────────────────
function AddBookmarkModal({
  dark, sectionId, sections, onAdd, onClose,
}: {
  dark: boolean; sectionId: string | null; sections: Section[]; onAdd: (sectionId: string, bm: Bookmark) => void; onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState(sectionId ?? sections[0]?.id ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    let domain = url;
    try { domain = new URL(cleanUrl).hostname; } catch {}
    onAdd(target, { id: uid(), name: name.trim(), url: cleanUrl, favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64` });
    onClose();
  };

  const inputStyle = {
    border: `1px solid ${dark ? "#444" : "#e2e1dc"}`,
    background: dark ? "#1e1e1e" : "#fff",
    color: dark ? "#f0efeb" : "#1a1a1a",
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="rounded-2xl p-6 w-80 shadow-2xl"
        style={{ background: dark ? "#252525" : "#fff", color: dark ? "#f0efeb" : "#1a1a1a" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold mb-4">Add bookmark</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input autoFocus placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition" style={inputStyle} />
          <input placeholder="URL (e.g. google.com)" value={url} onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition" style={inputStyle} />
          <select value={target} onChange={(e) => setTarget(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition cursor-pointer"
            style={inputStyle}>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition"
              style={{ background: dark ? "#333" : "#f5f4f0", color: dark ? "#bbb" : "#555" }}>
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Section component ─────────────────────────────────────────────────────────
function SectionBlock({
  section, dark, editMode, isFirst, isLast,
  onRename, onDelete, onRemoveBookmark, onEditBookmark, onAddBookmark, onMoveUp, onMoveDown,
}: {
  section: Section; dark: boolean; editMode: boolean; isFirst: boolean; isLast: boolean;
  onRename: (name: string) => void; onDelete: () => void;
  onRemoveBookmark: (id: string) => void; onEditBookmark: (bm: Bookmark) => void; onAddBookmark: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(section.name);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) nameRef.current?.focus(); }, [editing]);
  useEffect(() => { if (!editMode) setEditing(false); }, [editMode]);

  const commitRename = () => {
    const trimmed = draft.trim();
    if (trimmed) onRename(trimmed);
    else setDraft(section.name);
    setEditing(false);
  };

  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const cardBorderEdit = dark ? "rgba(37,99,235,0.25)" : "rgba(37,99,235,0.15)";

  return (
    <div
      className="w-full rounded-2xl mb-4 transition-all duration-200"
      style={{
        background: cardBg,
        border: `1.5px solid ${editMode ? cardBorderEdit : cardBorder}`,
        padding: "18px 20px 16px",
      }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        {editMode && editing ? (
          <input
            ref={nameRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") { setDraft(section.name); setEditing(false); }
            }}
            className="text-[12px] font-semibold tracking-widest uppercase outline-none rounded-lg px-2 py-1 w-44 focus:ring-2 focus:ring-blue-500/30"
            style={{ background: dark ? "#2a2a2a" : "#ebebea", color: dark ? "#f0efeb" : "#1a1a1a", border: `1px solid ${dark ? "#444" : "#ccc"}` }}
          />
        ) : (
          <span
            className="text-[12px] font-semibold tracking-widest uppercase select-none"
            style={{ color: dark ? "#666" : "#aaa" }}
          >
            {section.name}
          </span>
        )}

        {editMode && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="w-5 h-5 rounded flex items-center justify-center transition hover:opacity-80"
            style={{ color: dark ? "#555" : "#bbb" }}
            title="Rename"
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className="flex-1" />

        {/* Reorder + delete controls */}
        {editMode && (
          <div className="flex items-center gap-1">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              title="Move up"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition disabled:opacity-20"
              style={{ background: dark ? "#2a2a2a" : "#ececea", color: dark ? "#aaa" : "#777" }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M6 9V3M3 6l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              title="Move down"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition disabled:opacity-20"
              style={{ background: dark ? "#2a2a2a" : "#ececea", color: dark ? "#aaa" : "#777" }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M6 3v6M3 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              title="Remove section"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:bg-red-500/15 hover:text-red-400"
              style={{ background: dark ? "#2a2a2a" : "#ececea", color: dark ? "#666" : "#bbb" }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Bookmarks */}
      <div className="flex flex-wrap gap-x-5 gap-y-6">
        {section.bookmarks.map((bm) => (
          <BookmarkTile
            key={bm.id}
            bm={bm}
            dark={dark}
            editMode={editMode}
            onRemove={() => onRemoveBookmark(bm.id)}
            onEdit={() => onEditBookmark(bm)}
          />
        ))}
        {editMode && (
          <div onClick={onAddBookmark} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-150 border-2 border-dashed group-hover:border-blue-400 group-hover:bg-blue-500/10"
              style={{ borderColor: dark ? "#3a3a3a" : "#ddd" }}
            >
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="transition-colors group-hover:text-blue-400" style={{ color: dark ? "#444" : "#ccc" }}>
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[11px] font-medium group-hover:text-blue-500 transition-colors" style={{ color: dark ? "#444" : "#bbb" }}>Add</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [now, setNow] = useState(new Date());
  const [query, setQuery] = useState("");
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [dark, setDark] = useState(() => localStorage.getItem("newtab-dark") === "true");
  const [editMode, setEditMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [addModal, setAddModal] = useState<{ sectionId: string | null } | null>(null);
  const [editBmModal, setEditBmModal] = useState<{ sectionId: string; bm: Bookmark } | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(t);
  }, []);

  const toggleDark = () => setDark((d) => { localStorage.setItem("newtab-dark", String(!d)); return !d; });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const isUrl = /^(https?:\/\/|www\.)/.test(query) || /^[^/\s]+\.[a-z]{2,}(\/|$)/.test(query);
    window.open(isUrl ? (query.startsWith("http") ? query : `https://${query}`) : `https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  };

  const addSection = () =>
    setSections((prev) => [...prev, { id: uid(), name: "New Section", bookmarks: [] }]);

  const renameSection = (id: string, name: string) =>
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, name } : s));

  const deleteSection = (id: string) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const moveSection = (id: string, dir: -1 | 1) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const removeBookmark = (sectionId: string, bmId: string) =>
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, bookmarks: s.bookmarks.filter((b) => b.id !== bmId) } : s));

  const addBookmark = (sectionId: string, bm: Bookmark) =>
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, bookmarks: [...s.bookmarks, bm] } : s));

  const updateBookmark = (sectionId: string, updated: Bookmark) =>
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? { ...s, bookmarks: s.bookmarks.map((b) => b.id === updated.id ? updated : b) } : s
    ));

  // Colors
  const bg = dark ? "#1a1a1a" : "#f5f4f0";
  const textPrimary = dark ? "#f0efeb" : "#1a1a1a";
  const textMuted = dark ? "#777" : "#888";
  const card = dark ? "#2a2a2a" : "#ffffff";
  const searchBorderColor = searchFocused ? "#3b82f6" : (dark ? "#333" : "transparent");

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-16 pb-20 px-6 transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}
    >
      {/* Top-right controls */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-40">
        {/* Edit mode toggle */}
        <button
          onClick={() => setEditMode((e) => !e)}
          title={editMode ? "Exit edit mode" : "Edit bookmarks"}
          className="h-9 px-3 rounded-full flex items-center gap-1.5 text-[12px] font-medium transition-all duration-150"
          style={{
            background: editMode ? "#2563eb" : (dark ? "#333" : "#e8e7e2"),
            color: editMode ? "#fff" : (dark ? "#aaa" : "#555"),
            boxShadow: editMode ? "0 2px 12px rgba(37,99,235,0.3)" : "none",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          {editMode ? "Done" : "Edit"}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          title={dark ? "Light mode" : "Dark mode"}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-105"
          style={{ background: dark ? "#333" : "#e8e7e2", color: dark ? "#f0efeb" : "#555" }}
        >
          {dark ? (
            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="4" />
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div
          className="fixed top-0 left-0 right-0 h-1 z-30"
          style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed)" }}
        />
      )}

      {/* Clock */}
      <div className="text-center mb-10 select-none">
        <div className="font-serif leading-none mb-1" style={{ fontSize: "clamp(56px,10vw,88px)", color: textPrimary, letterSpacing: "-2px" }}>
          {formatTime(now)}
        </div>
        <div className="text-[15px] font-light tracking-wide" style={{ color: textMuted }}>{formatDate(now)}</div>
        <div className="text-[18px] font-medium mt-2" style={{ color: dark ? "#c0bfba" : "#333" }}>{getGreeting()}</div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="w-full max-w-[560px] mb-12">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150"
          style={{
            background: card,
            boxShadow: searchFocused
              ? dark ? "0 4px 24px rgba(59,130,246,0.2)" : "0 4px 24px rgba(37,99,235,0.13)"
              : dark ? "0 1px 8px rgba(0,0,0,0.3)" : "0 1px 8px rgba(0,0,0,0.08)",
            border: `1.5px solid ${searchBorderColor}`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0" style={{ color: dark ? "#555" : "#aaa" }}>
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search or enter address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent outline-none text-[15px] font-normal placeholder:text-[#666]"
            style={{ color: textPrimary }}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-[#bbb] hover:text-[#888] transition text-xl leading-none">×</button>
          )}
        </div>
      </form>

      {/* Sections */}
      <div className="w-full max-w-[720px]">
        {sections.map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            dark={dark}
            editMode={editMode}
            isFirst={i === 0}
            isLast={i === sections.length - 1}
            onRename={(name) => renameSection(section.id, name)}
            onDelete={() => deleteSection(section.id)}
            onRemoveBookmark={(bmId) => removeBookmark(section.id, bmId)}
            onEditBookmark={(bm) => setEditBmModal({ sectionId: section.id, bm })}
            onAddBookmark={() => setAddModal({ sectionId: section.id })}
            onMoveUp={() => moveSection(section.id, -1)}
            onMoveDown={() => moveSection(section.id, 1)}
          />
        ))}

        {/* Add section button (edit mode only) */}
        {editMode && (
          <button
            onClick={addSection}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border-2 border-dashed transition-all hover:border-blue-400 hover:text-blue-500 group mt-2"
            style={{ borderColor: dark ? "#333" : "#ddd", color: dark ? "#555" : "#aaa", width: "100%" }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="group-hover:text-blue-400 transition-colors" style={{ color: "inherit" }}>
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add new section
          </button>
        )}
      </div>

      {/* Non-edit-mode global add button */}
      {!editMode && (
        <button
          onClick={() => setAddModal({ sectionId: null })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: "#2563eb", color: "#fff" }}
          title="Add bookmark"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <div className="mt-8 text-[11px] tracking-wider select-none" style={{ color: dark ? "#333" : "#ccc" }}>
        YOUR BROWSER · NEW TAB
      </div>

      {addModal && (
        <AddBookmarkModal
          dark={dark}
          sectionId={addModal.sectionId}
          sections={sections}
          onAdd={addBookmark}
          onClose={() => setAddModal(null)}
        />
      )}
      {editBmModal && (
        <EditBookmarkModal
          dark={dark}
          bm={editBmModal.bm}
          onSave={(updated) => updateBookmark(editBmModal.sectionId, updated)}
          onClose={() => setEditBmModal(null)}
        />
      )}
    </div>
  );
}
