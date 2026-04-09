// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Grid, Activity } from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="container">
      <h1 className="title-glow">SonicAI Dashboard</h1>
      <p className="subtitle">Welcome back. What will you create today?</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '3rem' }}>
        <Link to="/generate" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ cursor: 'pointer', height: '100%', transition: 'all 0.3s' }}>
            <Music size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: 'white', marginTop: 0 }}>Studio</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Create new music from AI-powered text prompts and advanced synthesis.</p>
          </div>
        </Link>
        <Link to="/library" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ cursor: 'pointer', height: '100%', transition: 'all 0.3s' }}>
            <Grid size={40} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: 'white', marginTop: 0 }}>Library</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>View your previously generated tracks and download stems.</p>
          </div>
        </Link>
        <div className="glass-panel" style={{ opacity: 0.6 }}>
          <Activity size={40} color="#ff9900" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'white', marginTop: 0 }}>Analytics</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Coming soon. View generation statistics and platform usage.</p>
        </div>
      </div>
    </div>
  );
};
