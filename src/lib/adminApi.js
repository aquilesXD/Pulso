// URL de tu servidor Node.js
const API_BASE_URL = 'http://localhost:4000/api';

const TOKEN_KEY = "pulso_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Error en la solicitud");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const adminApi = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  getContactos: ({ estado = "all", search = "", page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ estado, search, page, limit });
    return request(`/contactos?${params.toString()}`);
  },

  getContacto: (id) => request(`/contactos/${id}`),

  updateEstado: (id, estado) =>
    request(`/contactos/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }),

  deleteContacto: (id) => request(`/contactos/${id}`, { method: "DELETE" }),

  getStats: () => request("/contactos/stats"),

  // Público: el formulario de contacto crea solicitudes sin auth
  createContacto: (data) =>
    request("/contactos", { method: "POST", body: JSON.stringify(data) }),
};
