import  { useState, useEffect } from 'react';
import { apiKeyAPI } from '../../services/apiKeyAPI';
import { authAPI } from '../../services/api';
import Button from '../../components/button/Button';
import './Main.css';

const Main = () => {
  const [formData, setFormData] = useState({ target_url: '' });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [keys, setKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(true);

  // =========================
  // Fetch Stats
  // =========================
  const fetchStats = async () => {
    try {
      const response = await apiKeyAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch API stats");
    } finally {
      setLoadingStats(false);
    }
  };

  // =========================
  // Fetch Keys
  // =========================
  const fetchKeys = async () => {
    try {
      const response = await apiKeyAPI.getAll();
      setKeys(response.data.data); // ✅ FIXED
    } catch (err) {
      console.error("Failed to fetch keys");
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchKeys();
  }, []);

  // =========================
  // Toggle Status
  // =========================
  const toggleKeyStatus = async (keyId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await authAPI.updateKeyStatus(keyId, { status: newStatus });

      setKeys((prev) =>
        prev.map((key) =>
          key.id === keyId ? { ...key, status: newStatus } : key
        )
      );

      fetchStats(); // refresh stats
    } catch (err) {
      console.error("Failed to update key status");
    }
  };

  // =========================
  // Form Handling
  // =========================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.target_url.trim()) {
      setError('Target URL is required');
      return;
    }

    if (!validateUrl(formData.target_url)) {
      setError('Please enter a valid URL (must start with http/https)');
      return;
    }

    setGenerating(true);
    setError('');
    setResult(null);

    try {
      const response = await apiKeyAPI.generate({
        target_url: formData.target_url.trim()
      });

      const fullKey = response.data.apikey;

      setResult({
        fullKey,
        prefix: fullKey.slice(0, 8)
      });

      fetchStats();
      fetchKeys(); // ✅ refresh keys automatically

      setFormData({ target_url: '' });

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate API key');
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

          {/* ================= DASHBOARD + GENERATE ================= */}
          <div className="dashboard-generate-wrapper">

            {/* Stats Section */}
            <div className="dashboard-section">
              <h2>API Key Overview</h2>

              {loadingStats ? (
                <p>Loading...</p>
              ) : stats ? (
                <div className="dashboard-cards">
                  <div className="card">
                    <h4>Plan</h4>
                    <p>{stats.plan?.toUpperCase()}</p>
                  </div>

                  <div className="card">
                    <h4>Active Keys</h4>
                    <p>{stats.activeKeys} / {stats.maxKeys}</p>
                  </div>

                  <div className="card">
                    <h4>Remaining Keys</h4>
                    <p>{stats.remainingKeys}</p>
                  </div>
                </div>
              ) : (
                <p>Failed to load stats</p>
              )}
            </div>

            {/* Generate Section */}
            <div className="generate-section">
              <h2>Generate New API Key</h2>

              <form onSubmit={handleSubmit} className="api-key-form">
                <div className="form-group">
                  <label>Target URL *</label>
                  <input
                    type="url"
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
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate API Key'}
                </Button>
              </form>

              {result && (
                <div className="api-key-result success">
                  <h3>New API Key Generated!</h3>

                  <div className="key-display">
                    <code>{result.prefix}</code>
                    <code>********</code>
                  </div>

                  <button className="btn-copy" onClick={copyToClipboard}>
                    {copied ? '✅ Copied!' : '📋 Copy Full Key'}
                  </button>

                  <small>
                    Save this full key now — it won't be shown again!
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* ================= MANAGE KEYS ================= */}
          <div className="manage-keys-section">
  <h2 className="section-title">Manage API Keys</h2>

  {loadingKeys ? (
    <p className="loading-text">Loading keys...</p>
  ) : keys.length > 0 ? (
    <div className="table-wrapper">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Status</th>
            <th>Rate Limit</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td className="key-cell">
                {key.prefix}********
              </td>

              <td>
                <span
                  className={
                    key.status === "active"
                      ? "status-badge active"
                      : "status-badge inactive"
                  }
                >
                  {key.status}
                </span>
              </td>

              <td>
                {key.rate_limit}
              </td>

              <td>
                {new Date(key.createdAt).toLocaleString()}
              </td>

              <td>
                <button
                  className={
                    key.status === "active"
                      ? "btn-deactivate"
                      : "btn-activate"
                  }
                  onClick={() =>
                    toggleKeyStatus(key.id, key.status)
                  }
                >
                  {key.status === "active"
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="empty-text">No API keys found.</p>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default Main;