import { useEffect } from "react";
import Photo from "./Photo";

function Lightbox({ items, index, onClose, onMove }) {
  const item = items[index];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onMove]);
  if (!item) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <Photo src={item.image} label="PHOTO" alt={item.caption} dark />
        <figcaption>{item.caption} <span>{index + 1} / {items.length}</span></figcaption>
      </figure>
      <button type="button" className="lightbox-btn close" onClick={onClose} aria-label="Close photo">&times;</button>
      <button type="button" className="lightbox-btn prev" onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label="Previous photo">&larr;</button>
      <button type="button" className="lightbox-btn next" onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label="Next photo">&rarr;</button>
    </div>
  );
}

export default Lightbox;
