import { create } from "zustand";

export type SavedNote = {
    id: number;
    imageKey: string;
};

interface NoteState {
    notes: SavedNote[];
    addNote: (note: Omit<SavedNote, "id">) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
    notes: [],
    addNote: (note) =>
        set((state) => ({
            notes: [...state.notes, { ...note, id: state.notes.length + 1 }],
        })),
}));
