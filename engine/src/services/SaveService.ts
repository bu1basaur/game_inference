import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import { SavedNote } from "../stores/useNoteStore";

export type SaveData = {
    storyState: string;
    timelineMinutes: number;
    notes: SavedNote[];
    playerName?: string;
};

export type SaveSlot = SaveData & {
    id: string;
    savedAt: Timestamp;
};

const MAX_SLOTS = 10;

const slotsRef = (userId: string) =>
    collection(db, "saves", userId, "slots");

export async function saveGame(userId: string, data: SaveData): Promise<void> {
    const ref = slotsRef(userId);

    await addDoc(ref, { ...data, savedAt: serverTimestamp() });

    // 10개 초과 시 가장 오래된 것 삭제
    const all = await getDocs(query(ref, orderBy("savedAt", "asc")));
    if (all.size > MAX_SLOTS) {
        const toDelete = all.docs.slice(0, all.size - MAX_SLOTS);
        await Promise.all(toDelete.map((d) => deleteDoc(d.ref)));
    }
}

export async function listSaves(userId: string): Promise<SaveSlot[]> {
    const ref = slotsRef(userId);
    const snap = await getDocs(query(ref, orderBy("savedAt", "desc")));
    return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as SaveData & { savedAt: Timestamp }),
    }));
}

export async function loadSave(
    userId: string,
    slotId: string
): Promise<SaveData | null> {
    const ref = doc(db, "saves", userId, "slots", slotId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as SaveData;
}
