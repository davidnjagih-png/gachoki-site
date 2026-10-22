import Photo from "./Photo";
import { formatDate } from "../lib/format";

function PressItem({ item: n }) {
  const body = (
    <>
      {n.image && <Photo src={n.image} alt="" className="press-thumb" />}
      <div>
        <div className="kicker">{[n.kind, n.outlet, formatDate(n.date)].filter(Boolean).join(" · ").toUpperCase()}</div>
        <h3>{n.title}</h3>
        {n.summary && <p className="muted">{n.summary}</p>}
        {n.url && <span className="read-link">Read at source &rarr;</span>}
      </div>
    </>
  );
  return n.url ? (
    <a className="press-item" href={n.url} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <article className="press-item">{body}</article>
  );
}

export default PressItem;
