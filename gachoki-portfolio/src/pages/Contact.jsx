import site from "../../site.config.js";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { createElement } from "react";
import Seo from "../components/Seo";
import { useContent } from "../lib/contentContext";
import { isConfigured } from "../lib/firebase";
import { sendMessage } from "../lib/store";

const TOPICS = ["A question or idea", "Constituency matter", "Invite to an event", "Media enquiry"];
const SOCIALS = [
  ["facebook", "Facebook", FaFacebookF],
  ["x", "X", FaXTwitter],
  ["instagram", "Instagram", FaInstagram],
  ["youtube", "YouTube", FaYoutube],
];
const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID || site.formspreeId;

function Contact() {
  const { settings, displayName } = useContent();
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const c = settings.contact;

  async function onSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget; // React clears currentTarget after an await
    const form = new FormData(formEl);
    if (form.get("website")) return; // honeypot: bots fill this in
    const data = {
      name: String(form.get("name")).trim().slice(0, 120),
      email: String(form.get("email")).trim().slice(0, 160),
      ward: String(form.get("ward") || "").trim().slice(0, 120),
      topic: String(form.get("topic")),
      message: String(form.get("message")).trim().slice(0, 3000),
    };
    setState("sending");
    try {
      if (isConfigured) await sendMessage(data);
      if (FORMSPREE) {
        await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
      }
      if (!isConfigured && !FORMSPREE) await new Promise((r) => setTimeout(r, 500)); // preview mode
      formEl.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const socials = SOCIALS.filter(([k]) => settings.socials[k]);

  return (
    <>
      <Seo title="Contact" path="/contact" description={`Send a question, idea or invitation to ${displayName} and his office.`} />
      <section className="page-head">
        <div className="container">
          <div className="kicker">GET IN TOUCH</div>
          <h1>Contact</h1>
        </div>
      </section>

      <section className="section tight">
        <div className="container contact-grid">
          <form className="form" onSubmit={onSubmit}>
            <label>Full name<input name="name" required maxLength={120} autoComplete="name" /></label>
            <div className="form-row">
              <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
              <label>Your area<input name="ward" maxLength={120} /></label>
            </div>
            <label>I am writing about
              <select name="topic">{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label>Message<textarea name="message" rows={6} required minLength={5} maxLength={3000} /></label>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="btn btn-dark" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Sending..." : "Send message"}
            </button>
            <p className="muted small" role="status" aria-live="polite">
              {state === "sent" && "Thank you. Your message has been sent."}
              {state === "error" && "Sorry, that did not send. Please try again in a moment."}
              {state === "idle" && "Your details are used only to reply to you."}
            </p>
          </form>
          <aside className="contact-side">
            <div className="card">
              <h2>Office</h2>
              <p>
                {[c.address, c.phone, c.email, c.hours].filter(Boolean).map((line, i) => <span key={i}>{line}<br /></span>)}
              </p>
            </div>
            {socials.length > 0 && (
              <div className="card">
                <h2>Follow</h2>
                <div className="socials dark">
                  {socials.map(([k, label, icon]) => (
                    <a key={k} href={settings.socials[k]} target="_blank" rel="noopener noreferrer" aria-label={label}>{createElement(icon)}</a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}

export default Contact;
