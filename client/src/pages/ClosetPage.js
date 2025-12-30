import React, { useState, useEffect } from 'react';
import { clothesService } from '../services/api';
import './ClosetPage.css';

const ClosetPage = () => {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Top', 'Bottom', 'Full-body', 'Shoes', 'Outerwear'];

  useEffect(() => {
    fetchClothes();
  }, []);

  useEffect(() => {
    filterClothes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, clothes]);

  const fetchClothes = async () => {
    try {
      setLoading(true);
      const data = await clothesService.getAll();
      setClothes(data);
      setFilteredClothes(data);
    } catch (err) {
      setError('Failed to load clothes');
    } finally {
      setLoading(false);
    }
  };

  const filterClothes = () => {
    let filtered = [...clothes];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredClothes(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await clothesService.delete(id);
        setClothes(clothes.filter((item) => item.id !== id));
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="closet-page page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Closet</h1>
          <p className="page-subtitle">Browse and manage your wardrobe</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="closet-controls">
          <div className="search-bar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            {categories.map((category) => (
              <button
                key={category}
                className={`chip ${selectedCategory === category || (category === 'All' && !selectedCategory) ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredClothes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👔</div>
            <h3 className="empty-state-title">No items found</h3>
            <p className="empty-state-text">
              {clothes.length === 0
                ? 'Start building your wardrobe by uploading your first item!'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="clothes-grid">
            {filteredClothes.map((item) => (
              <div key={item.id} className="clothes-card fade-in">
                <div className="card-image-container">
                  <img
                    src={`http://localhost:5000${item.image_path}`}
                    alt={item.item_name}
                    className="card-image"
                  />
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                    title="Delete item"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{item.item_name}</h3>
                  <div className="card-tags">
                    <span className="tag tag-category">{item.category}</span>
                    <span className="tag tag-season">{item.season}</span>
                  </div>
                  {item.last_worn_date && (
                    <p className="card-last-worn">Last worn: {item.last_worn_date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosetPage;
