import { useMemo, useState } from "react";
import Seo from "../components/Seo";
import PressItem from "../components/PressItem";
import { useContent } from "../lib/contentContext";

function Press() {
  const { displayName, press } = useContent();
  const [filter, setFilter] = useState("All");
  const kinds = useMemo(() => ["All", ...new Set(press.map((p) => p.kind).filter(Boolean))], [press]);
  const shown = filter === "All" ? press : press.filter((p) => p.kind === filter);
  return (
    <>
      <Seo title="Press" path="/press" description={`Articles, interviews, videos and statements featuring ${displayName}.`} />
      <section className="page-head">
        <div className="container">
          <div className="kicker">IN THE NEWS</div>
          <h1>Press</h1>
          <p className="lead">Articles, interviews, videos and statements.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          {kinds.length > 2 && (
            <div className="filters" role="group" aria-label="Filter by type">
              {kinds.map((k) => (
                <button key={k} type="button" className={`filter ${filter === k ? "is-active" : ""}`} aria-pressed={filter === k} onClick={() => setFilter(k)}>{k}</button>
              ))}
            </div>
          )}
          {shown.length ? (
            <div className="press-list">{shown.map((n) => <PressItem key={n.id} item={n} />)}</div>
          ) : (
            <p className="empty">Press coverage will appear here soon.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Press;
