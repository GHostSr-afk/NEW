import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clothesService } from '../services/api';
import './UploadPage.css';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    season: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['Top', 'Bottom', 'Full-body', 'Shoes', 'Outerwear'];
  const seasons = ['Summer', 'Winter', 'All'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('image', image);
      data.append('item_name', formData.item_name);
      data.append('category', formData.category);
      data.append('season', formData.season);

      console.log('Uploading item...', {
        item_name: formData.item_name,
        category: formData.category,
        season: formData.season,
        image: image.name
      });

      const response = await clothesService.upload(data);
      console.log('Upload successful:', response);
      setSuccess('Item added successfully!');
      
      // Reset form
      setFormData({ item_name: '', category: '', season: '' });
      setImage(null);
      setPreview(null);
      
      // Redirect to closet after 1.5 seconds
      setTimeout(() => {
        navigate('/closet');
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.error || 'Failed to upload item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Add New Item</h1>
          <p className="page-subtitle">Upload a photo and tag your clothing item</p>
        </div>

        <div className="upload-container">
          <form onSubmit={handleSubmit} className="upload-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="image-upload-section">
              <div className="image-preview-container">
                {preview ? (
                  <img src={preview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p>Upload an image</p>
                  </div>
                )}
              </div>
              
              <label htmlFor="image-input" className="btn-upload-image">
                {preview ? 'Change Image' : 'Select Image'}
              </label>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                required
              />
            </div>

            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="item_name">Item Name</label>
                <input
                  type="text"
                  id="item_name"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  placeholder="e.g., White Cotton T-Shirt"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="season">Season</label>
                <select
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a season</option>
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Add to Closet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
