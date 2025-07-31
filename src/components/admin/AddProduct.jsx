import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: 'Cakes',
        stock: ''
    });
    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name, description, price, imageUrl, category, stock } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGenerateDesc = async () => {
        if (!keywords) {
            setError('Please enter some keywords to generate a description.');
            return;
        }
        setIsGenerating(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };
            const res = await axios.post('/api/ai/generate-description', { keywords }, config);
            setFormData({ ...formData, description: res.data.description });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to generate description.');
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };
            await axios.post('/api/products', formData, config);
            setSuccess('Product added successfully!');
            // Clear the form
            setFormData({ name: '', description: '', price: '', imageUrl: '', category: 'Cakes', stock: '' });
            setKeywords('');
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
                <input type="text" name="imageUrl" value={imageUrl} onChange={onChange} placeholder="Image URL" required style={inputStyle} />
                <select name="category" value={category} onChange={onChange} style={inputStyle}>
                    <option value="Cakes">Cakes</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Breads">Breads</option>
                    <option value="Cookies">Cookies</option>
                </select>
                
                <div style={aiSectionStyle}>
                    <p style={{margin: '0 0 0.5rem 0', fontWeight:'bold'}}>AI Description Generator</p>
                    <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., chocolate, fudge, rich, decadent" style={inputStyle} />
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

// Styles
const formContainerStyle = { maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'};
const inputStyle = { width: 'calc(100% - 20px)', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' };
const submitStyle = { width: '100%', padding: '12px', backgroundColor: '#7B3F00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const aiSectionStyle = { border: '1px dashed #C4A484', padding: '1rem', margin: '1rem 0', borderRadius: '5px', backgroundColor: '#FEFBF6' };
const generateButtonStyle = { padding: '10px 15px', backgroundColor: '#C4A484', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'block', width: '100%' };


export default AddProduct;
