// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, Library, Activity } from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="container">
      <h1 className="title-glow">Dashboard</h1>
      <p className="subtitle">What will you create today?</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '3rem' }}>
        <Link to="/generate" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ cursor: 'pointer', height: '100%' }}>
            <Music2 size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '0.5rem' }}>Studio</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Plan → Learn → Customize → Generate. Enter a prompt, study the theory, then synthesize your track.
            </p>
          </div>
        </Link>

        <Link to="/library" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ cursor: 'pointer', height: '100%' }}>
            <Library size={40} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: 'white', marginTop: 0, marginBottom: '0.5rem' }}>Library</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Browse, play, and download all your previously generated tracks.
            </p>
          </div>
        </Link>

        <div className="glass-panel" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <Activity size={40} color="#ff9900" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'white', marginTop: 0, marginBottom: '0.5rem' }}>Analytics</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Coming soon — generation stats and platform usage.
          </p>
        </div>
      </div>
    </div>
  );
};
