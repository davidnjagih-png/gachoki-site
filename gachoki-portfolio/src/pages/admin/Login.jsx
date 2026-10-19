import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/auth";

const MESSAGES = {
  "auth/invalid-credential": "That email or password is not correct.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No internet connection. Please try again.",
};

function Login() {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await signInWithEmailAndPassword(auth, String(form.get("email")).trim(), String(form.get("password")));
    } catch (err) {
      setError(MESSAGES[err.code] || "Sign-in failed. Please try again.");
      setBusy(false);
    }
  }

  async function reset(e) {
    const email = e.currentTarget.form.elements.email.value.trim();
    if (!email) {
      setError("Type your email above first, then press this link.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch {
      /* Same message either way, so strangers cannot test which emails exist. */
    }
    setError("");
    setInfo("If that email belongs to an administrator, a reset link is on its way.");
  }

  return (
    <div className="admin-center">
      <form className="admin-card" onSubmit={onSubmit}>
        <h1>Admin sign in</h1>
        <p className="admin-small">For campaign staff only.</p>
        <label>Email<input name="email" type="email" required autoComplete="username" /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {info && <p className="admin-ok" role="status">{info}</p>}
        <button className="admin-btn primary" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <button type="button" className="admin-link" onClick={reset}>Forgot password?</button>
      </form>
    </div>
  );
}

export default Login;
