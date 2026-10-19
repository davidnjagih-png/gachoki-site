import { useMemo, useState } from "react";
import Seo from "../components/Seo";
import WorkRow from "../components/WorkRow";
import { useContent } from "../lib/contentContext";

function Work() {
  const { settings: s, displayName, projects } = useContent();
  const [filter, setFilter] = useState("All");
  const cats = useMemo(() => ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  return (
    <>
      <Seo title="Selected work" path="/work" description={`Projects, bills and community work delivered by ${displayName} in ${s.area}.`} />
      <section className="page-head">
        <div className="container">
          <div className="kicker">THE RECORD</div>
          <h1>Selected work</h1>
          <p className="lead">Projects and legislation, with the result of each.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          {cats.length > 2 && (
            <div className="filters" role="group" aria-label="Filter by category">
              {cats.map((c) => (
                <button key={c} type="button" className={`filter ${filter === c ? "is-active" : ""}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
          )}
          {shown.length ? (
            <div className="rows">{shown.map((p) => <WorkRow key={p.id} project={p} featured />)}</div>
          ) : (
            <p className="empty">Projects will appear here soon.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Work;
