import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import app, { db } from "./firebase";

export const auth = getAuth(app);

export interface UserProfile {
  role: string;
  branchId?: string;
  regionId?: string;
  mustChangePassword?: boolean;
}

export type AuthUserWithProfile = User & { profile: UserProfile | null };

export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.email) throw new Error("Oturum açık değil.");

  const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  try {
    await reauthenticateWithCredential(currentUser, credential);
  } catch (err: any) {
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      throw new Error("Geçici şifreniz hatalı. Lütfen size iletilen şifreyi kontrol edin.");
    }
    throw err;
  }

  await updatePassword(currentUser, newPassword);
  await set(ref(db, `users/${currentUser.uid}/mustChangePassword`), false);
}

export function signIn(email: string, password: string): Promise<User> {
  return signInWithEmailAndPassword(auth, email, password).then((cred) => cred.user);
}

export function signOut(): Promise<void> {
  return fbSignOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await get(ref(db, `users/${uid}`));
  return snap.exists() ? (snap.val() as UserProfile) : null;
}

export function watchAuthState(callback: (userWithProfile: AuthUserWithProfile | null) => void): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }
    const profile = await getUserProfile(user.uid);
    callback(Object.assign(user, { profile }));
  });
}
