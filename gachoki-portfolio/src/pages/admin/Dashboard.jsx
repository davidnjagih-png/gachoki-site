import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContent } from "../../lib/contentContext";
import { ALBUMS, CATEGORIES, PRESS_KINDS, SAMPLE_GALLERY, SAMPLE_PRESS, SAMPLE_PROJECTS } from "../../data/defaults";
import { formatDate } from "../../lib/format";
import Crud from "./Crud";
import SiteEditor from "./SiteEditor";
import Messages from "./Messages";

const workFields = [
  { key: "title", label: "Project or bill name", required: true, max: 120, wide: true },
  { key: "category", label: "Category", type: "combo", options: CATEGORIES, default: CATEGORIES[0], hint: "Pick one or type a new category." },
  { key: "year", label: "Year", max: 20, placeholder: "2024" },
  { key: "place", label: "Place", max: 120, placeholder: "Ward, town or National Assembly" },
  { key: "result", label: "Headline result", max: 40, placeholder: "e.g. 12,000 or 85% or Passed", hint: "A number or one word, shown large." },
  { key: "resultLabel", label: "What the result measures", max: 80, placeholder: "e.g. households connected" },
  { key: "summary", label: "One-line description", type: "textarea", max: 400, wide: true },
  { key: "url", label: "Link (optional)", type: "url", max: 300, wide: true, hint: "Where to read more. Makes the row clickable." },
  { key: "image", label: "Photo", type: "image" },
];

const pressFields = [
  { key: "title", label: "Headline or title", required: true, max: 160, wide: true },
  { key: "kind", label: "Type", type: "combo", options: PRESS_KINDS, default: PRESS_KINDS[0] },
  { key: "outlet", label: "Outlet", max: 80, placeholder: "e.g. Nation, KTN, Parliament" },
  { key: "date", label: "Date", type: "date" },
  { key: "url", label: "Link to the original", type: "url", max: 400, wide: true, hint: "Paste the article, video or document link." },
  { key: "summary", label: "One-line summary", type: "textarea", max: 400, wide: true },
  { key: "image", label: "Image (optional)", type: "image" },
];

const galleryFields = [
  { key: "image", label: "Photo", type: "image", maxSide: 1400 },
  { key: "caption", label: "Caption", max: 160, wide: true, placeholder: "Event, place" },
  { key: "category", label: "Album", type: "combo", options: ALBUMS, default: ALBUMS[0], hint: "Photos in the same album are grouped under one filter." },
];

function Overview() {
  const { projects, press, gallery, displayName } = useContent();
  const cards = [
    ["Selected work", projects.length, "/admin/work"],
    ["Press items", press.length, "/admin/press"],
    ["Gallery photos", gallery.length, "/admin/gallery"],
  ];
  return (
    <div>
      <div className="admin-head"><div><h1>Welcome back</h1><p className="admin-small">Changes to {displayName}&rsquo;s site appear straight away.</p></div></div>
      <div className="admin-cards">
        {cards.map(([label, n, to]) => (
          <NavLink key={label} to={to} className="admin-stat"><strong>{n}</strong><span>{label}</span></NavLink>
        ))}
      </div>
      <div className="admin-panel">
        <h2>What you can do here</h2>
        <ul className="admin-small steps">
          <li><b>Selected work</b>: add projects and bills with a photo and one headline result. The top four show on the Profile page.</li>
          <li><b>Press</b>: add each article, interview, video or statement with a link to the original.</li>
          <li><b>Gallery</b>: use &ldquo;Upload several photos&rdquo; to add many at once, then give each a caption and album.</li>
          <li><b>Profile and career</b>: portrait, wide photo and quote, headline numbers, career, committees, vision and contact details.</li>
        </ul>
        <a className="admin-btn" href="/" target="_blank" rel="noopener noreferrer">Open the public site</a>
      </div>
    </div>
  );
}

function Dashboard({ user, onSignOut }) {
  const [unread, setUnread] = useState(0);
  useEffect(
    () => onSnapshot(collection(db, "messages"), (snap) => setUnread(snap.docs.filter((d) => !d.data().read).length)),
    []
  );
  const links = [
    ["/admin", "Overview", true],
    ["/admin/work", "Selected work"],
    ["/admin/press", "Press"],
    ["/admin/gallery", "Gallery"],
    ["/admin/profile", "Profile and career"],
    ["/admin/messages", "Messages"],
  ];
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">Admin</div>
        <nav aria-label="Admin">
          {links.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} className="admin-nav">
              {label}
              {label === "Messages" && unread > 0 && <span className="badge">{unread}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <span className="admin-small">{user.email}</span>
          <button className="admin-btn" onClick={onSignOut}>Sign out</button>
        </div>
      </aside>
      <section className="admin-main">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="work" element={
            <Crud name="projects" title="Selected work" intro="Projects and legislation. Use the arrows to choose the order; the first four appear on the Profile page." singular="project" fields={workFields} sortable samples={SAMPLE_PROJECTS}
              describe={(p) => ({ title: p.title, sub: [p.category, p.place, p.year].filter(Boolean).join(" · "), image: p.image })} />
          } />
          <Route path="press" element={
            <Crud name="press" title="Press" intro="Newest first. Paste the link to the original so visitors can read it at the source." singular="press item" fields={pressFields} samples={SAMPLE_PRESS}
              describe={(n) => ({ title: n.title, sub: [n.kind, n.outlet, formatDate(n.date)].filter(Boolean).join(" · "), image: n.image })} />
          } />
          <Route path="gallery" element={
            <Crud name="gallery" title="Gallery" intro="Photos from events, projects and community visits. The first five show on the Profile page." singular="photo" fields={galleryFields} sortable samples={SAMPLE_GALLERY}
              bulk={{ maxSide: 1400, category: ALBUMS[0] }}
              describe={(g) => ({ title: g.caption || "No caption yet", sub: g.category, image: g.image })} />
          } />
          <Route path="profile" element={<SiteEditor />} />
          <Route path="messages" element={<Messages />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </section>
    </div>
  );
}

export default Dashboard;
