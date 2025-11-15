const API_BASE_URL = "http://127.0.0.1:8000/api";

// Public
export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  return res.json();
}

// Admin protected
export async function createProduct(product, token) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id, product, token) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
