const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function register(user) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user), // Registration data
  });
  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials), // Login credentials
  });
  return res.json();
}

export async function getUser(token) {
  const res = await fetch(`${API_BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` }, // Sends auth token
  });
  return res.json();
}

export async function updateUser(userData, token) {
  const res = await fetch(`${API_BASE_URL}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(userData), // Updated user details
  });
  return res.json();
}