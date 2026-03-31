import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestsPerMinute, setRequestsPerMinute] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/analytics/logs');
      const logsData = res.data.data || [];
      setLogs(logsData);
      processRequestsPerMinute(logsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const processRequestsPerMinute = (logsData) => {
    const counts = {};

    logsData.forEach(log => {
      const d = new Date(log.createdAt);
      const key = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const chartData = Object.keys(counts).map(time => ({
      time,
      requests: counts[time]
    })).sort((a, b) => a.time.localeCompare(b.time));

    setRequestsPerMinute(chartData);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <h1>API Analytics</h1>
          <p className="subtitle">Track API usage, performance & limits</p>
        </div>

        {loading && <p className="status">Loading logs...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && logs.length > 0 && (
          <div className="chart-section">
            <h2>Requests Per Minute</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestsPerMinute}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#00f5d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Logs list below chart */}
        <div className="logs-grid">
          {logs.map(log => (
            <div key={log.id} className="log-card">
              <div className="log-top">
                <span className={`status-code ${log.status_code >= 400 ? 'error' : 'success'}`}>
                  {log.status_code}
                </span>
                {log.rate_limit_hit && <span className="rate-limit">Rate Limited</span>}
              </div>
              <div className="log-main">
                <div className="endpoint">{log.endpoint}</div>
                <div className="method">{log.method}</div>
              </div>
              <div className="log-meta">
                <span>IP: {log.ip_address || 'N/A'}</span>
                <span>API Key ID: {log.apikey_id}</span>
              </div>
              <div className="log-bottom">
                <span>{log.response_time_ms || 0} ms</span>
                <span>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;