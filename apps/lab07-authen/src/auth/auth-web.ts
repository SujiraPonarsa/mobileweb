import "@/firebase";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  type ConfirmationResult,
} from "firebase/auth";

import type {
  IAuthService,
  AuthUser,
  EmailPasswordCredentials,
  PhoneCredentials,
} from "./auth-interface";

const auth = getAuth();

function mapUser(user: any): AuthUser {
  return {
    uid: user.uid,
    email: user.email ?? null,
    phoneNumber: user.phoneNumber ?? null,
    displayName: user.displayName ?? null,
    photoUrl: user.photoURL ?? null, // ✅ รูปโปรไฟล์
  };
}

let confirmationResult: ConfirmationResult | null = null;

export class FirebaseWebAuthService implements IAuthService {

  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user ? mapUser(user) : null);
      });
    });
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);
    return mapUser(result.user);
  }

  async loginWithEmailPassword(
    creds: EmailPasswordCredentials
  ): Promise<AuthUser> {
    const result = await signInWithEmailAndPassword(
      auth,
      creds.email,
      creds.password
    );
    return mapUser(result.user);
  }

  async startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }> {

    const recaptcha = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "normal" }
    );

    confirmationResult = await signInWithPhoneNumber(
      auth,
      creds.phoneNumberE164,
      recaptcha
    );

    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }): Promise<AuthUser> {

    if (!confirmationResult) {
      throw new Error("No confirmation result");
    }

    const result = await confirmationResult.confirm(
      payload.verificationCode
    );

    return mapUser(result.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}