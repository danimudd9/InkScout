// ===================== og.js =====================
// OG Member system — first 10 artist signups get Pro for life + OG badge
// Uses a single Firestore document to track the count atomically.

import { db } from './firebase.js';
import {
  doc, getDoc, runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const OG_LIMIT = 10;
const OG_DOC   = doc(db, 'config', 'og');

// Check how many OG spots are left (read-only)
export async function getOGSpotsLeft() {
  try {
    const snap = await getDoc(OG_DOC);
    if (!snap.exists()) return OG_LIMIT;
    const count = snap.data().count || 0;
    return Math.max(0, OG_LIMIT - count);
  } catch (err) {
    console.warn('Could not fetch OG count:', err);
    return null;
  }
}

// Try to claim an OG spot for a new artist (called right after account creation)
// Returns { claimed: true, plan: 'pro', og: true } or { claimed: false, plan: 'standard', og: false }
export async function claimOGSpot(uid) {
  try {
    let claimed = false;

    await runTransaction(db, async (transaction) => {
      const ogSnap = await transaction.get(OG_DOC);
      const current = ogSnap.exists() ? (ogSnap.data().count || 0) : 0;

      if (current < OG_LIMIT) {
        // Claim the spot
        transaction.set(OG_DOC, { count: current + 1 }, { merge: true });
        claimed = true;
      }
    });

    return claimed
      ? { claimed: true,  plan: 'pro',      og: true,  ogSince: new Date().toISOString() }
      : { claimed: false, plan: 'standard',  og: false };

  } catch (err) {
    console.error('OG claim failed:', err);
    return { claimed: false, plan: 'standard', og: false };
  }
}