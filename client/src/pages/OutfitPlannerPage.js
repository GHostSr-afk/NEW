import React, { useState } from 'react';
import { outfitService } from '../services/api';
import './OutfitPlannerPage.css';

const OutfitPlannerPage = () => {
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const suggestOutfit = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const data = await outfitService.suggest();
      setOutfit(data.outfit);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate outfit. Make sure you have enough items in your closet.');
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async () => {
    if (!outfit) return;

    try {
      const itemIds = outfit.map((item) => item.id);
      await outfitService.save(itemIds);
      setSuccess('Outfit saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save outfit');
    }
  };

  const rollAgain = () => {
    suggestOutfit();
  };

  return (
    <div className="outfit-planner-page page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Outfit Planner</h1>
          <p className="page-subtitle">Let us help you choose what to wear today</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="planner-container">
          {!outfit ? (
            <div className="suggestion-prompt">
              <div className="prompt-icon">✨</div>
              <h2 className="prompt-title">Ready to look amazing?</h2>
              <p className="prompt-text">
                Click the button below and we'll create a perfectly coordinated outfit for you
              </p>
              <button
                className="btn-suggest"
                onClick={suggestOutfit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Generating...
                  </>
                ) : (
                  'Suggest Outfit'
                )}
              </button>
            </div>
          ) : (
            <div className="outfit-display fade-in">
              <h2 className="outfit-title">Your Outfit</h2>
              
              <div className="outfit-grid">
                {outfit.map((item) => (
                  <div key={item.id} className="outfit-item">
                    <div className="outfit-item-image-container">
                      <img
                        src={`http://localhost:5000${item.image_path}`}
                        alt={item.item_name}
                        className="outfit-item-image"
                      />
                    </div>
                    <div className="outfit-item-info">
                      <h3 className="outfit-item-name">{item.item_name}</h3>
                      <div className="outfit-item-tags">
                        <span className="tag tag-category">{item.category}</span>
                        <span className="tag tag-season">{item.season}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="outfit-actions">
                <button className="btn-action btn-roll" onClick={rollAgain}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Roll Again
                </button>
                <button className="btn-action btn-save" onClick={saveOutfit}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Outfit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitPlannerPage;
