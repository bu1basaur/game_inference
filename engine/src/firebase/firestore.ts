// ──────────────────────────────────────────────────
// # Firestore 인스턴스 export
// ──────────────────────────────────────────────────

import { getFirestore } from "firebase/firestore";
import { app } from "./config";

export const db = getFirestore(app);
