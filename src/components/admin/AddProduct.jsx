import React, { useState } from 'react';
import api from '../../lib/api';

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cakes',
    stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, description, price, category, stock } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const handleGenerateDesc = async () => {
    if (!keywords) return setError('Please enter keywords.');
    setIsGenerating(true); setError(''); setSuccess('');
    try {
      const res = await api.post('/api/ai/generate-description', { keywords });
      setFormData((prev) => ({ ...prev, description: res.data.description }));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to generate description.');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('description', description);
      fd.append('price', price);
      fd.append('category', category);
      fd.append('stock', stock);
      if (imageFile) fd.append('image', imageFile); // <-- multer field name 'image'

      await api.post('/api/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Product added successfully!');
      setFormData({ name: '', description: '', price: '', category: 'Cakes', stock: '' });
      setImageFile(null);
      setKeywords('');
      onProductAdded && onProductAdded();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add product.');
    }
  };

  return (
    <div style={formContainerStyle}>
      <h3>Add a New Product</h3>
      {error && <div className="error-text" style={{marginBottom: '1rem'}}>{error}</div>}
      {success && <div style={{color: 'green', backgroundColor: '#D4EDDA', padding: '0.5rem', borderRadius: '5px', marginBottom: '1rem'}}>{success}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Product Name" required style={inputStyle} />
        <input type="number" name="price" value={price} onChange={onChange} placeholder="Price" required style={inputStyle} />
        <input type="number" name="stock" value={stock} onChange={onChange} placeholder="Stock Quantity" required style={inputStyle} />
        {/* Image file input for Cloudinary */}
        <input type="file" accept="image/*" onChange={handleFileChange} required style={inputStyle} />
        <select name="category" value={category} onChange={onChange} style={inputStyle}>
          <option value="Cakes">Cakes</option>
          <option value="Pastries">Pastries</option>
          <option value="Breads">Breads</option>
          <option value="Cookies">Cookies</option>
        </select>

        <div style={aiSectionStyle}>
          <p style={{margin: '0 0 0.5rem 0', fontWeight:'bold'}}>AI Description Generator</p>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., chocolate, fudge, rich" style={inputStyle} />
          <button type="button" onClick={handleGenerateDesc} disabled={isGenerating} style={generateButtonStyle}>
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <textarea name="description" value={description} onChange={onChange} placeholder="Product Description" required rows="4" style={inputStyle}></textarea>
        <input type="submit" value="Add Product" style={submitStyle} />
      </form>
    </div>
  );
};

const formContainerStyle = { padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'};
const inputStyle = { width: 'calc(100% - 20px)', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' };
const submitStyle = { width: '100%', padding: '12px', backgroundColor: '#7B3F00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const aiSectionStyle = { border: '1px dashed #C4A484', padding: '1rem', margin: '1rem 0', borderRadius: '5px', backgroundColor: '#FEFBF6' };
const generateButtonStyle = { padding: '10px 15px', backgroundColor: '#C4A484', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'block', width: '100%' };

export default AddProduct;
