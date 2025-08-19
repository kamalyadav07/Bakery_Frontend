import React, { useState } from 'react';
import api from '../../lib/api';

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    category: product.category || 'Cakes',
    stock: product.stock || ''
  });
  const [imageFile, setImageFile] = useState(null);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile); // optional

      await api.put(`/api/products/${product._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onProductUpdated && onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update product', error);
      alert('Update failed!');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Edit {product.name}</h2>
        <form onSubmit={onSubmit}>
          <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Product Name" required style={inputStyle} />
          <textarea name="description" value={formData.description} onChange={onChange} placeholder="Description" rows="3" required style={inputStyle}></textarea>
          <input type="number" name="price" value={formData.price} onChange={onChange} placeholder="Price" required style={inputStyle} />
          <input type="number" name="stock" value={formData.stock} onChange={onChange} placeholder="Stock" required style={inputStyle} />
          {/* Optional new image */}
          <input type="file" accept="image/*" onChange={(e)=>setImageFile(e.target.files?.[0]||null)} style={inputStyle} />
          <select name="category" value={formData.category} onChange={onChange} style={inputStyle}>
            <option value="Cakes">Cakes</option>
            <option value="Pastries">Pastries</option>
            <option value="Breads">Breads</option>
            <option value="Cookies">Cookies</option>
          </select>
          <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <button type="button" onClick={onClose} style={{...btnStyle, background: 'grey'}}>Cancel</button>
            <button type="submit" style={{...btnStyle, background: '#007bff'}}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: '2rem', borderRadius: '10px', width: '90%', maxWidth: '500px' };
const inputStyle = { width: 'calc(100% - 22px)', padding: '10px', margin: '8px 0', border: '1px solid #ddd', borderRadius: '5px' };
const btnStyle = { flex: 1, padding: '12px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' };

export default EditProductModal;
