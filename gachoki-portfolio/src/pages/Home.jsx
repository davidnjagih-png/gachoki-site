import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import WorkRow from "../components/WorkRow";
import PressItem from "../components/PressItem";
import { useContent } from "../lib/contentContext";

function Home() {
  const { settings: s, displayName, projects, press, gallery } = useContent();
  const first = displayName.split(" ").slice(0, -1).join(" ");
  const last = displayName.split(" ").slice(-1)[0];
  return (
    <>
      <Seo />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="kicker">{[s.title, s.role, s.area].filter(Boolean).join(" · ").toUpperCase()}</div>
            <h1>{first}<br />{last}</h1>
            <p className="lead">{s.intro}</p>
            <div className="btn-row">
              <Link to="/work" className="btn btn-dark">View selected work</Link>
              <Link to="/contact" className="text-link">Invite me to speak &rarr;</Link>
            </div>
            <dl className="facts">
              <div><dt>BASED IN</dt><dd>{s.basedIn}</dd></div>
              <div><dt>FOCUS</dt><dd>{s.focus.join(" · ")}</dd></div>
              <div><dt>PARTY</dt><dd>{s.party}</dd></div>
            </dl>
          </div>
          <div className="portrait-wrap">
            <div className="portrait-frame" aria-hidden="true" />
            <Photo src={s.heroImage} label="PORTRAIT PHOTO" alt={displayName} className="portrait" />
          </div>
        </div>
      </section>

      <section className={`band ${s.wideQuote ? "" : "no-quote"}`}>
        <div className="band-bg"><Photo src={s.wideImage} label="WIDE PHOTO: EVENT OR SITE VISIT" alt="" dark className="cover" /></div>
        <div className="band-shade" aria-hidden="true" />
        {s.wideQuote && (
          <div className="container band-copy">
            <p className="band-quote">&ldquo;{s.wideQuote}&rdquo;</p>
            <p className="band-by">{displayName.toUpperCase()}</p>
          </div>
        )}
      </section>

      <section className="stats" aria-label="Results at a glance">
        <div className="container stats-grid">
          {s.stats.map((st, i) => (
            <div className="stat" key={i}><div className="stat-value">{st.value}</div><div className="stat-label">{st.label}</div></div>
          ))}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>In the community</h2>
              <Link to="/gallery" className="text-link">Photo gallery &rarr;</Link>
            </div>
            <div className="photo-feature">
              <figure className="lead-photo">
                <Photo src={gallery[0].image} label="EVENT PHOTO" alt={gallery[0].caption} />
                <figcaption>{gallery[0].caption}</figcaption>
              </figure>
              <div className="photo-grid-4">
                {gallery.slice(1, 5).map((g) => (
                  <figure key={g.id}><Photo src={g.image} label="EVENT PHOTO" alt={g.caption} /><figcaption>{g.caption}</figcaption></figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Selected work</h2>
              <Link to="/work" className="text-link">All projects &rarr;</Link>
            </div>
            <div className="rows">
              {projects.slice(0, 4).map((p, i) => <WorkRow key={p.id} project={p} featured={i === 0} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container split-career">
          <div>
            <h2>Career</h2>
            <p className="muted">{s.careerIntro}</p>
            <Link to="/career" className="text-link">Full career &rarr;</Link>
          </div>
          <div className="rows">
            {s.career.slice(0, 4).map((c, i) => (
              <div className="career-row" key={i}>
                <span className="row-year">{c.years}</span>
                <div><h3>{c.role}</h3><div className="org">{c.org}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {press.length > 0 && (
        <section className="section alt">
          <div className="container">
            <div className="section-head">
              <h2>Press</h2>
              <Link to="/press" className="text-link">All press &rarr;</Link>
            </div>
            <div className="press-list">{press.slice(0, 3).map((n) => <PressItem key={n.id} item={n} />)}</div>
          </div>
        </section>
      )}

      <section className="cta">
        <div className="container cta-inner">
          <h2>Have a question or an invitation for {s.title} {s.name.split(" ").slice(-1)[0]}?</h2>
          <Link to="/contact" className="btn btn-gold">Get in touch</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
