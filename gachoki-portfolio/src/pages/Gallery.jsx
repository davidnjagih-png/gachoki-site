import { useCallback, useMemo, useState } from "react";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import Lightbox from "../components/Lightbox";
import { useContent } from "../lib/contentContext";

function Gallery() {
  const { displayName, gallery } = useContent();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(-1);
  const albums = useMemo(() => ["All", ...new Set(gallery.map((g) => g.category).filter(Boolean))], [gallery]);
  const shown = filter === "All" ? gallery : gallery.filter((g) => g.category === filter);
  const move = useCallback((d) => setOpen((i) => (i + d + shown.length) % shown.length), [shown.length]);
  return (
    <>
      <Seo title="Gallery" path="/gallery" description={`Photos from events, projects and community visits by ${displayName}.`} />
      <section className="page-head">
        <div className="container">
          <div className="kicker">IN PICTURES</div>
          <h1>Gallery</h1>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          {albums.length > 2 && (
            <div className="filters" role="group" aria-label="Filter by album">
              {albums.map((a) => (
                <button key={a} type="button" className={`filter ${filter === a ? "is-active" : ""}`} aria-pressed={filter === a} onClick={() => setFilter(a)}>{a}</button>
              ))}
            </div>
          )}
          {shown.length === 0 && <p className="empty">Photos will appear here soon.</p>}
          <div className="gallery" key={filter}>
            {shown.map((g, i) => (
              <button type="button" className={`gallery-item ${i === 0 ? "big" : ""}`} key={g.id} onClick={() => setOpen(i)} aria-label={`Open photo: ${g.caption || "gallery photo"}`}>
                <Photo src={g.image} label="PHOTO" alt={g.caption} />
                {g.caption && <span className="cap">{g.caption}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>
      {open >= 0 && shown[open] && <Lightbox items={shown} index={open} onClose={() => setOpen(-1)} onMove={move} />}
    </>
  );
}

export default Gallery;
