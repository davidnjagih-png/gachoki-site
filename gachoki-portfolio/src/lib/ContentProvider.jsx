import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db, isConfigured } from "./firebase";
import { ContentContext } from "./contentContext";
import { DEFAULT_SETTINGS, SAMPLE_GALLERY, SAMPLE_PRESS, SAMPLE_PROJECTS } from "../data/defaults";

/*
  One place that supplies all site content.
  - Firebase not connected: sample content from src/data/defaults.js.
  - Firebase connected: live data, updated instantly when the admin saves.
*/

function mergeSettings(saved) {
  if (!saved) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    contact: { ...DEFAULT_SETTINGS.contact, ...(saved.contact || {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(saved.socials || {}) },
    theme: { ...DEFAULT_SETTINGS.theme, ...(saved.theme || {}) },
  };
}

const byOrder = (a, b) => (a.order ?? 9999) - (b.order ?? 9999) || (b.createdAt ?? 0) - (a.createdAt ?? 0);
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (b.createdAt ?? 0) - (a.createdAt ?? 0);

const SAMPLES = { projects: SAMPLE_PROJECTS, press: SAMPLE_PRESS, gallery: SAMPLE_GALLERY };

function ContentProvider({ children }) {
  const [live, setLive] = useState({});
  const [saved, setSaved] = useState(null);
  const [ready, setReady] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    const unsubs = Object.keys(SAMPLES).map((name) =>
      onSnapshot(
        collection(db, name),
        (snap) => setLive((prev) => ({ ...prev, [name]: snap.docs.map((d) => ({ id: d.id, ...d.data() })) })),
        () => setLive((prev) => ({ ...prev, [name]: [] }))
      )
    );
    unsubs.push(
      onSnapshot(
        doc(db, "settings", "site"),
        (snap) => { setSaved(snap.exists() ? snap.data() : null); setReady(true); },
        () => setReady(true)
      )
    );
    return () => unsubs.forEach((u) => u());
  }, []);

  const settings = useMemo(() => mergeSettings(saved), [saved]);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--primary", settings.theme.primary);
    root.setProperty("--accent", settings.theme.accent);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", settings.theme.primary);
  }, [settings.theme]);

  const value = useMemo(() => {
    const pick = (name, sorter) => [...(isConfigured ? live[name] ?? [] : SAMPLES[name])].sort(sorter);
    const displayName = [settings.title, settings.name].filter(Boolean).join(" ");
    return {
      ready,
      isLive: isConfigured,
      settings,
      displayName,
      projects: pick("projects", byOrder),
      press: pick("press", byDateDesc),
      gallery: pick("gallery", byOrder),
    };
  }, [live, settings, ready]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export default ContentProvider;
