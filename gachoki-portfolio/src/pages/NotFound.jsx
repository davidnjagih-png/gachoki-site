import { Link } from "react-router-dom";
import Seo from "../components/Seo";

function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <section className="page-head">
        <div className="container">
          <h1>Page not found</h1>
          <p className="lead">That page does not exist or has moved.</p>
          <Link to="/" className="btn btn-dark">Back to the profile</Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
