import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useContent } from "../lib/contentContext";

function Vision() {
  const { settings: s, displayName } = useContent();
  return (
    <>
      <Seo title="Vision" path="/vision" description={`${displayName}'s priorities for ${s.area}.`} />
      <section className="page-head">
        <div className="container">
          <div className="kicker">LOOKING AHEAD</div>
          <h1>Vision for {s.area}</h1>
          {s.visionIntro && <p className="lead">{s.visionIntro}</p>}
        </div>
      </section>
      <section className="section tight">
        <div className="container rows">
          {s.pillars.length === 0 && <p className="empty">His priorities for {s.area} will be published here soon.</p>}
          {s.pillars.map((p, i) => (
            <article className="pillar" key={i}>
              <div className="pillar-num">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h2>{p.title}</h2>
                <p className="lead dark">{p.text}</p>
                <ul className="checks">{(p.commitments || []).filter(Boolean).map((c, j) => <li key={j}>{c}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="cta">
        <div className="container cta-inner">
          {s.pledge ? <p className="pledge">&ldquo;{s.pledge}&rdquo;</p> : <h2>Share your priorities for {s.area}.</h2>}
          <Link to="/contact" className="btn btn-gold">Get in touch</Link>
        </div>
      </section>
    </>
  );
}

export default Vision;
