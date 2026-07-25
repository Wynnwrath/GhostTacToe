import { API_BASE } from "./constants";

async function request(path, options = {}) {
  const token = localStorage.getItem("auth-token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/api${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.error?.message || "Request failed");
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),
  health: () => request("/health"),
};
