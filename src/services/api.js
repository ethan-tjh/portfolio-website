const API_URL = process.env.REACT_APP_API_URL || "";
export async function getProjects() {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
export function addProject(item) {
    return fetch(`${API_URL}/addProject`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(item),
    });
}
export function updateProject(id, item) {
    return fetch(`${API_URL}/updateProject/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(item),
    });
}
export function deleteProject(id) {
    return fetch(`${API_URL}/deleteProject/${id}`,{
        method: "DELETE",
    });
}