import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// Only the admin area imports this, so visitors never download sign-in code.
export const auth = app ? getAuth(app) : null;
