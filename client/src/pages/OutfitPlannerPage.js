import React, { useState } from 'react';
import { outfitService } from '../services/api';
import './OutfitPlannerPage.css';
import './FashionMatrixPanel.css';

const OutfitPlannerPage = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('Summer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const suggestOutfits = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const data = await outfitService.suggest(selectedSeason);
      setRecommendations(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate outfits. Make sure you have enough items in your closet.');
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfitItems) => {
    try {
      const itemIds = outfitItems.map(item => item.id);
      await outfitService.save(itemIds);
      setSuccess('Outfit saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save outfit');
    }
  };

  const renderOutfitCard = (recommendation) => {
    // Filter out null items and create array of items
    const itemsArray = [
      recommendation.items.top,
      recommendation.items.bottom,
      recommendation.items.shoes,
      recommendation.items.outerwear
    ].filter(item => item); // Remove nulls/undefined

    return (
      <div key={recommendation.outfit_name} className="fashion-matrix-outfit-card">
        <div className="outfit-card-header">
          <h3 className="outfit-card-title">{recommendation.outfit_name}</h3>
          <span className="outfit-style-logic">{recommendation.style_logic}</span>
        </div>

        <div className="outfit-reasoning">
          <p>{recommendation.reasoning}</p>
        </div>

        {/* Display actual item images and names */}
        <div className="outfit-items-grid">
          {itemsArray.map((item) => (
            <div key={item.id} className="outfit-item-mini">
              <div className="mini-item-image">
                <img
                  src={`http://localhost:5000${item.image_path}`}
                  alt={item.item_name}
                />
              </div>
              <div className="mini-item-info">
                <p className="mini-item-name">{item.item_name}</p>
                <span className="mini-item-category">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-save-outfit"
          onClick={() => saveOutfit(itemsArray)}
        >
          Save This Outfit
        </button>
      </div>
    );
  };

  return (
    <div className="outfit-planner-page page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Fashion Matrix Outfit Planner</h1>
          <p className="page-subtitle">AI-powered styling with color theory & seasonal intelligence</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Season Selector */}
        <div className="season-selector">
          <button
            className={`season-btn ${selectedSeason === 'Summer' ? 'active' : ''}`}
            onClick={() => setSelectedSeason('Summer')}
          >
            ☀️ Summer
          </button>
          <button
            className={`season-btn ${selectedSeason === 'Winter' ? 'active' : ''}`}
            onClick={() => setSelectedSeason('Winter')}
          >
            ❄️ Winter
          </button>
        </div>

        <div className="planner-container">
          {!recommendations ? (
            <div className="suggestion-prompt">
              <div className="prompt-icon">✨</div>
              <h2 className="prompt-title">Ready for AI-powered styling?</h2>
              <p className="prompt-text">
                Select your season and we'll create {selectedSeason} outfits using advanced color theory,
                silhouette balancing, and seasonal compatibility rules
              </p>
              <button
                className="btn-suggest"
                onClick={suggestOutfits}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Analyzing Your Wardrobe...
                  </>
                ) : (
                  `Generate ${selectedSeason} Outfits`
                )}
              </button>
            </div>
          ) : (
            <div className="recommendations-display fade-in">
              <div className="recommendations-header">
                <h2>Your {selectedSeason} Outfit Recommendations</h2>
                <button className="btn-regenerate" onClick={suggestOutfits}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Regenerate
                </button>
              </div>

              {recommendations.recommendations && recommendations.recommendations.length > 0 ? (
                <div className="outfit-cards-grid">
                  {recommendations.recommendations.map((rec) => renderOutfitCard(rec))}
                </div>
              ) : (
                <div className="no-outfits-message">
                  <p>Not enough {selectedSeason.toLowerCase()} items to create outfits. Try adding more clothes or selecting a different season.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitPlannerPage;
