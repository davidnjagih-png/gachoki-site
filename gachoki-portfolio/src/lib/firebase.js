import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import site from "../../site.config.js";

// Values come from site.config.js. Hosting settings named VITE_FIREBASE_*
// (apiKey, authDomain, projectId, appId) override them if you prefer.
const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || site.firebase.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || site.firebase.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || site.firebase.projectId,
  appId: env.VITE_FIREBASE_APP_ID || site.firebase.appId,
};

// Without these four values the site still works: it shows the sample
// content from src/data/defaults.js and the admin area explains what is missing.
export const isConfigured = Boolean(
  config.apiKey && config.projectId && config.appId && config.authDomain
);

export const app = isConfigured ? initializeApp(config) : null;

export const db = app ? getFirestore(app) : null;
