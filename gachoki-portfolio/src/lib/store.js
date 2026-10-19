import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

/* Everything the dashboard writes goes through here. */

export async function saveItem(name, item) {
  const { id, ...data } = item;
  if (id) {
    await updateDoc(doc(db, name, id), data);
    return id;
  }
  const ref = await addDoc(collection(db, name), { ...data, createdAt: Date.now() });
  return ref.id;
}

export const removeItem = (name, id) => deleteDoc(doc(db, name, id));

export const saveSettings = (settings) => setDoc(doc(db, "settings", "site"), settings);

// Persist a new order after the admin moves an item up or down.
export async function saveOrder(name, orderedIds) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, i) => batch.update(doc(db, name, id), { order: i }));
  await batch.commit();
}

export async function seedSamples(name, items) {
  const batch = writeBatch(db);
  items.forEach((item, i) => {
    const { id: _id, ...data } = item; // eslint-disable-line no-unused-vars
    batch.set(doc(collection(db, name)), { ...data, order: i, createdAt: Date.now() + i });
  });
  await batch.commit();
}

export async function sendMessage(message) {
  await addDoc(collection(db, "messages"), {
    ...message,
    read: false,
    createdAt: Date.now(),
    sentAt: serverTimestamp(),
  });
}

export async function listMessages() {
  const snap = await getDocs(collection(db, "messages"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
