import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

function Messages() {
  const [items, setItems] = useState(null);

  useEffect(
    () =>
      onSnapshot(collection(db, "messages"), (snap) =>
        setItems(
          snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        )
      ),
    []
  );

  const toggle = (m) => updateDoc(doc(db, "messages", m.id), { read: !m.read });
  const remove = (m) => window.confirm("Delete this message?") && deleteDoc(doc(db, "messages", m.id));

  return (
    <div>
      <div className="admin-head"><div><h1>Messages</h1><p className="admin-small">Sent through the Contact form.</p></div></div>
      {items === null && <p className="admin-small">Loading...</p>}
      {items?.length === 0 && <div className="admin-empty"><p>No messages yet.</p></div>}
      <ul className="admin-list">
        {items?.map((m) => (
          <li key={m.id} className={`admin-message ${m.read ? "" : "unread"}`}>
            <div className="msg-top">
              <strong>{m.name}</strong>
              <span className="admin-small">{m.createdAt ? new Date(m.createdAt).toLocaleString("en-GB") : ""}</span>
            </div>
            <div className="admin-small">{[m.email, m.ward, m.topic].filter(Boolean).join(" · ")}</div>
            <p className="msg-body">{m.message}</p>
            <div className="row-actions">
              <a className="admin-btn" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.topic || "Your message"))}`}>Reply</a>
              <button className="admin-btn" onClick={() => toggle(m)}>{m.read ? "Mark unread" : "Mark read"}</button>
              <button className="admin-btn danger" onClick={() => remove(m)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Messages;
