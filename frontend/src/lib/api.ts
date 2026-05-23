const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getAssignments: () => request<{ data: any[] }>("/assignments"),

  getAssignment: (id: string) => request<{ data: any }>(`/assignments/${id}`),

  createAssignment: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/assignments`, { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed" }));
      throw new Error(err.message);
    }
    return res.json();
  },

  deleteAssignment: (id: string) => request(`/assignments/${id}`, { method: "DELETE" }),

  regenerate: (id: string) => request(`/assignments/${id}/regenerate`, { method: "POST" }),

  getPdfUrl: (id: string) => `${API_BASE}/assignments/${id}/pdf`,
};
