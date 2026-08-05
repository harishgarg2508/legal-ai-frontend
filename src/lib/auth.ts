import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google.
 * Uses popup for seamless auth without page reloads.
 * Falls back to redirect if popups are blocked by browser.
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      console.warn('Popup blocked, falling back to redirect...');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    console.error('Google Sign-in Error:', error);
    throw error;
  }
};

/** Sign out and clear local session */
export const signOut = () => firebaseSignOut(auth);

/**
 * Call this once on app mount to handle redirect result if popup was blocked.
 */
export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (error) {
    console.error('Redirect sign-in error:', error);
    return null;
  }
};

/**
 * Sync the Firebase user to the backend after sign-in.
 * Sends POST /api/v1/auth/sync with Firebase ID token.
 */
export const syncUserWithBackend = async (user: User) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      // Force refresh token to prevent expired/skewed token errors on mobile browsers
      const idToken = await user.getIdToken(true);
      const res = await fetch(`${apiUrl}/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Sync HTTP Error:', res.status, errText);
        throw new Error(`Backend Sync (${res.status}): ${errText || res.statusText}`);
      }

      return await res.json();
    } catch (error: any) {
      console.error(`syncUserWithBackend Attempt ${attempts}/${maxAttempts} failed:`, error);
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to fetch from backend (${apiUrl}). Network or CORS issue on mobile device.`);
      }
      // Wait 600ms before retrying on mobile network glitch
      await new Promise((res) => setTimeout(res, 600));
    }
  }
};

/**
 * Subscribe to Firebase auth state changes.
 */
export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
