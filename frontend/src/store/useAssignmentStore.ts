import { create } from "zustand";
import { api } from "@/lib/api";
import type { Assignment } from "@/types";

interface AssignmentState {
  assignments: Assignment[];
  current: Assignment | null;
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  fetchAssignment: (id: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  setCurrent: (a: Assignment | null) => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  current: null,
  loading: false,
  error: null,

  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.getAssignments();
      set({ assignments: res.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  fetchAssignment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.getAssignment(id);
      set({ current: res.data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      await api.deleteAssignment(id);
      set({ assignments: get().assignments.filter((a) => a._id !== id) });
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  updateAssignment: (id, data) => {
    const assignments = get().assignments.map((a) => (a._id === id ? { ...a, ...data } : a));
    const current = get().current?._id === id ? { ...get().current!, ...data } : get().current;
    set({ assignments, current });
  },

  setCurrent: (a) => set({ current: a }),
}));
