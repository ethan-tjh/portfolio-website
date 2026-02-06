const API_URL = process.env.REACT_APP_API_URL || "";
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
// Auth
export function login(credentials) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}
// Projects
export async function getProjects() {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
export async function getProjectImages(id) {
    const res = await fetch(`${API_URL}/projects/${id}/images`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
export async function getCategories() {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
export function addProject(item) {
    return fetch(`${API_URL}/addProject`, {
        method: "POST",
        headers: {"Content-Type": "application/json", ...authHeader()},
        body: JSON.stringify(item),
    });
}
export function updateProject(id, item) {
    return fetch(`${API_URL}/updateProject/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json", ...authHeader()},
        body: JSON.stringify(item),
    });
}
export function deleteProject(id) {
    return fetch(`${API_URL}/deleteProject/${id}`,{
        method: "DELETE",
        headers: authHeader(),
    });
}
export async function getSkills() {
    const res = await fetch(`${API_URL}/skills`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
export async function getProjectTags(id) {
    const res = await fetch(`${API_URL}/projects/${id}/tags`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}