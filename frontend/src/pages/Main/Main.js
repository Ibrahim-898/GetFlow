import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiKeyAPI } from '../../services/apiKeyAPI';
import Button from '../../components/button/Button';
import './Main.css';

const Main = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ target_url: '' });
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch existing API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await apiKeyAPI.getAll();
      setApiKeys(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.target_url.trim()) {
      setError('Target URL is required');
      return;
    }

    if (!validateUrl(formData.target_url)) {
      setError('Please enter a valid URL');
      return;
    }

    setGenerating(true);
    setError('');
    setResult(null);

    try {
      const response = await apiKeyAPI.generate({
        target_url: formData.target_url.trim()
      });

      setResult({
        fullKey: response.data.apikey,
        prefix: response.data.apikey.slice(0, 8)
      });

      // Refresh API keys list
      fetchApiKeys();

    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to generate API key'
      );
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.fullKey) {
      await navigator.clipboard.writeText(result.fullKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="main-page">
      <div className="main-container">     

        <div className="main-content">
          {/* Generate New Key Section */}
          <div className="generate-section">
            <h2>Generate New API Key</h2>
            
            <form onSubmit={handleSubmit} className="api-key-form">
              <div className="form-group">
                <label htmlFor="target_url">Target URL *</label>
                <input
                  type="url"
                  id="target_url"
                  name="target_url"
                  value={formData.target_url}
                  onChange={handleChange}
                  placeholder="https://api.example.com"
                  className={error ? 'error' : ''}
                  disabled={generating}
                />
                {error && <span className="error-message">{error}</span>}
              </div>

              <Button 
                type="submit" 
                size="large" 
                fullWidth
                disabled={generating || !formData.target_url.trim()}
              >
                {generating ? 'Generating...' : 'Generate API Key'}
              </Button>
            </form>

            {/* New Key Result */}
            {result && (
              <div className="api-key-result success">
                <h3>New API Key Generated!</h3>
                <div className="key-display">
                  <code className="key-prefix">{result.prefix}</code>
                  <code className="key-secret">********</code>
                </div>
                <div className="key-actions">
                  <button 
                    className="btn-copy"
                    onClick={copyToClipboard}
                  >
                    {copied ? '✅ Copied!' : '📋 Copy Full Key'}
                  </button>
                  <small className="key-warning">
                    Save this full key now - secret won't be shown again!
                  </small>
                </div>
              </div>
            )}
          </div>

          {/* Existing API Keys */}
          <div className="keys-section">
            <div className="section-header">
              <h2>Your API Keys ({apiKeys.length})</h2>
              {apiKeys.length === 0 && (
                <p className="empty-state">
                  No API keys yet. Generate your first one above!
                </p>
              )}
            </div>

            <div className="keys-grid">
              {apiKeys.map((key) => (
                <div key={key.id} className="key-card">
                  <div className="key-info">
                    <code className="key-prefix">{key.prefix}</code>
                    <div className="key-meta">
                      <span className="target-url">{key.target_url}</span>
                      <span className="created-date">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="key-status">
                    <span className="status active">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;