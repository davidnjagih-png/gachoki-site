import Photo from "./Photo";

function WorkRow({ project: p, featured = false }) {
  const body = (
    <>
      <span className="row-year">{p.year}</span>
      {featured && <Photo src={p.image} label="PROJECT PHOTO" alt={p.title} className="row-thumb-img" />}
      <div className="row-main">
        <div className="kicker">{[p.category, p.place].filter(Boolean).join(" · ").toUpperCase()}</div>
        <h3>{p.title}</h3>
        {p.summary && <p className="muted">{p.summary}</p>}
      </div>
      {p.result && (
        <div className="row-result">
          <strong>{p.result}</strong>
          <span>{p.resultLabel}</span>
        </div>
      )}
      <span className="row-arrow" aria-hidden="true">{p.url ? "↗" : ""}</span>
    </>
  );
  return p.url ? (
    <a className="work-row" href={p.url} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <article className="work-row">{body}</article>
  );
}

export default WorkRow;
