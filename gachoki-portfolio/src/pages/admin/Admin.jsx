import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, isConfigured } from "../../lib/firebase";
import { auth } from "../../lib/auth";
import Seo from "../../components/Seo";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./admin.css";

/*
  Gatekeeper for /admin.
  1. Firebase must be connected (otherwise explain how).
  2. The visitor must sign in with email and password.
  3. Their account must have a record in the "admins" collection.
  The database rules enforce step 3 on the server, so hiding buttons here is
  only for convenience: nobody can write content without being an admin.
*/
function Admin() {
  const [status, setStatus] = useState(isConfigured ? "checking" : "unconfigured");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isConfigured) return;
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setStatus("signed-out");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "admins", u.uid));
        setUser(u);
        setStatus(snap.exists() ? "admin" : "not-admin");
      } catch {
        setUser(u);
        setStatus("not-admin");
      }
    });
  }, []);

  let body;
  if (status === "unconfigured") {
    body = (
      <div className="admin-center">
        <div className="admin-card">
          <h1>Admin not connected yet</h1>
          <p>Firebase has not been set up for this site. Follow the steps in README.md (section 1), add the four values to the <code>.env</code> file, and restart.</p>
        </div>
      </div>
    );
  } else if (status === "checking") {
    body = <p className="admin-loading">Checking sign-in...</p>;
  } else if (status === "signed-out") {
    body = <Login />;
  } else if (status === "not-admin") {
    body = (
      <div className="admin-center">
        <div className="admin-card">
          <h1>No access</h1>
          <p>{user?.email} is signed in but is not an administrator of this site. Ask the site owner to add you.</p>
          <p className="admin-small">Your account ID: <code>{user?.uid}</code></p>
          <button className="admin-btn" onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>
    );
  } else {
    body = <Dashboard user={user} onSignOut={() => signOut(auth)} />;
  }

  return (
    <div className="admin-root">
      <Seo title="Admin" noindex path="/admin" />
      {body}
    </div>
  );
}

export default Admin;
