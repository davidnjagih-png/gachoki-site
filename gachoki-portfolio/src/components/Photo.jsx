/* A real photo when one exists, otherwise a clearly marked placeholder. */
function Photo({ src, label = "PHOTO", alt = "", className = "", dark = false }) {
  if (src) {
    return <img className={`photo ${className}`} src={src} alt={alt} loading="lazy" decoding="async" />;
  }
  return (
    <div
      className={`photo photo-placeholder ${dark ? "is-dark" : ""} ${className}`}
      role="img"
      aria-label={`Placeholder: ${label.toLowerCase()}`}
    >
      <span>[{label}]</span>
    </div>
  );
}

export default Photo;
