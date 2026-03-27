import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { app } from "./config";
import { useAuthStore } from "../stores/useAuthStore";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        useAuthStore.getState().setUid(user.uid);
    } else {
        signInAnonymously(auth).catch(console.error);
    }
});

export async function ensureSignedIn(): Promise<string> {
    const uid = useAuthStore.getState().uid;
    if (uid) return uid;

    const user = await signInAnonymously(auth);
    useAuthStore.getState().setUid(user.user.uid);
    return user.user.uid;
}
