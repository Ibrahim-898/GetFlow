import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

// Import your API services (adjust paths if needed)
import api from '../../services/api';
import { authAPI } from '../../services/api';
import { apiKeyAPI } from '../../services/apiKeyAPI';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [requestsPerMinute, setRequestsPerMinute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch current logged-in user
  const getCurrentUser = async () => {
    try {
      const res = await authAPI.getme('/auth/me');
      return res.data;
    } catch (err) {
      console.error('Failed to get current user:', err);
      throw err;
    }
  };

  // Fetch API Keys (filtered by current user)
  const fetchApiKeys = async () => {
    try {
      const response = await apiKeyAPI.getAll();

      const userKeys = response.data.data;

      setApiKeys(userKeys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      // Don't block the whole dashboard if API keys fail
    }
  };

  // Fetch Logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await api.get('/analytics/logs');
      const logsData = res.data.data || res.data || [];

      setLogs(logsData);
      processRequestsPerMinute(logsData);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError('Failed to load analytics logs');
    } finally {
      setLoading(false);
    }
  };

  // Process logs for chart (Requests Per Minute)
  const processRequestsPerMinute = (logsData) => {
    const counts = {};

    logsData.forEach((log) => {
      if (!log.createdAt) return;
      const d = new Date(log.createdAt);
      const key = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes()
        .toString()
        .padStart(2, '0')}`;

      counts[key] = (counts[key] || 0) + 1;
    });

    const chartData = Object.keys(counts)
      .map((time) => ({
        time,
        requests: counts[time],
      }))
      .sort((a, b) => a.time.localeCompare(b.time));

    setRequestsPerMinute(chartData);
  };

  // Load data when component mounts
  useEffect(() => {
    fetchLogs();
    fetchApiKeys();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>API Analytics</h1>
          <p className="subtitle">Track API usage, performance & limits</p>
        </div>

        {loading && <p className="status">Loading logs...</p>}
        {error && <p className="error">{error}</p>}

        {/* Requests Per Minute Chart */}
        {!loading && requestsPerMinute.length > 0 && (
          <div className="chart-section">
            <h2>Requests Per Minute</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestsPerMinute}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#00f5d4"
                  strokeWidth={2}
                  dot={{ fill: '#00f5d4', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* API Keys Section */}
        <div className="keys-section">
  <h2>Your API Keys</h2>

  {apiKeys.length > 0 ? (
    <div className="table-container">
      <table className="api-keys-table">
        <thead>
          <tr>
            <th>API Key</th>
            <th>Target URL</th>
            <th>Created</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id}>
              <td>
                <code className="key-prefix">
                  {key.prefix ? `${key.prefix}...` : 'N/A'}
                </code>
              </td>
              <td className="target-url">
                {key.target_url || key.targetUrl || 'No target URL'}
              </td>
              <td className="created-date">
                {new Date(key.createdAt).toLocaleDateString()}
              </td>
              <td>
                <span className="status active">Active</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No API keys found.</p>
  )}
</div>

        {/* Logs List */}
        <div className="logs-section">
  <h2>Recent Logs</h2>
  
  <div className="logs-layout">
    {/* LEFT: 70% - Logs Table */}
    <div className="logs-table-container">
      {logs.length > 0 ? (
        <table className="logs-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Method</th>
              <th>Endpoint</th>
              <th>IP Address</th>
              <th>API Key ID</th>
              <th>Response Time</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <span
                    className={`status-code ${
                      log.status_code >= 400 ? 'error' : 'success'
                    }`}
                  >
                    {log.status_code}
                  </span>
                  {log.rate_limit_hit && (
                    <span className="rate-limit">Rate Limited</span>
                  )}
                </td>
                <td className="method">{log.method}</td>
                <td className="endpoint">{log.endpoint}</td>
                <td className="ip-address">{log.ip_address || 'N/A'}</td>
                <td className="apikey-id">{log.apikey_id || 'N/A'}</td>
                <td className="response-time">
                  {log.response_time_ms || 0} ms
                </td>
                <td className="timestamp">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-data">No logs available yet.</p>
      )}
    </div>

    {/* RIGHT: 30% - Summary Statistics & Chart */}
    <div className="logs-summary">
      <h3>API Usage Summary</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{logs.length}</span>
          <span className="stat-label">Total Requests</span>
        </div>
        <div className="stat-card">
          <span className="stat-number success-count">
            {logs.filter(l => l.status_code < 400).length}
          </span>
          <span className="stat-label">Successful</span>
        </div>
        <div className="stat-card">
          <span className="stat-number error-count">
            {logs.filter(l => l.status_code >= 400).length}
          </span>
          <span className="stat-label">Errors</span>
        </div>
      </div>

      {/* Success vs Error Visual */}
      <div className="chart-container">
        <h4>Success vs Error Rate</h4>
        <div className="pie-visual">
          <div 
            className="pie success-slice" 
            style={{
              '--success-percent': 
                logs.length > 0 
                  ? Math.round((logs.filter(l => l.status_code < 400).length / logs.length) * 100) 
                  : 0
            }}
          ></div>
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="dot success-dot"></span>
            Success
          </div>
          <div className="legend-item">
            <span className="dot error-dot"></span>
            Error
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Dashboard;