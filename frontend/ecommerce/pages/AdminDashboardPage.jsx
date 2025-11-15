import React, { useState, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { ProductsContext } from "../context/ProductsContext";
import styles from "../styles/AdminDashboard.module.css";

function AdminDashboardPage() {
  const { products, fetchProducts, addProductAPI, updateProductAPI, deleteProductAPI } = useContext(ProductsContext);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    rating: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
      }
    },
  });

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }
    if (!window.confirm("Are you sure you want to add this product?")) return;

    const newProduct = {
      ...form,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating) || 0,
      stock: parseInt(form.stock) || 0,
      image,
    };

    await addProductAPI(newProduct);
    fetchProducts();
    resetForm();
    alert("Product added successfully!");
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setForm(product);
    setImage(product.image);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      alert("Please fill all required fields.");
      return;
    }
    if (!window.confirm("Save changes to this product?")) return;

    const updatedProduct = { ...form, image };
    await updateProductAPI(updatedProduct);
    fetchProducts();
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await deleteProductAPI(id);
    fetchProducts();
    alert("Product deleted successfully!");
  };

  const resetForm = () => {
    setForm({ id: "", name: "", category: "", price: "", description: "", stock: "", rating: "" });
    setImage(null);
    setIsEditing(false);
  };

  return (
    <div className={styles.adminDashboard}>
      <h1>Admin Dashboard</h1>

      <form className={styles.addForm} onSubmit={isEditing ? handleUpdate : handleAddProduct}>
        <div className={styles.dropzone} {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : image ? (
            <img src={image} alt="preview" className={styles.preview} />
          ) : (
            <p>Drag & drop image here, or click to upload</p>
          )}
        </div>

        <input name="name" placeholder="Food Name" value={form.name} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Main">Main</option>
          <option value="Dessert">Dessert</option>
          <option value="Drinks">Drinks</option>
        </select>
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
        <input name="rating" placeholder="Rating (0–5)" type="number" step="0.1" value={form.rating} onChange={handleChange} />

        <button type="submit">{isEditing ? "Update Product" : "Add Product"}</button>
        {isEditing && (
          <button type="button" onClick={resetForm} className={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </form>

      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img src={p.image} alt={p.name} className={styles.thumb} />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₱{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.rating}</td>
                <td>
                  <button className={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboardPage;
