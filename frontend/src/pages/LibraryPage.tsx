// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Track } from '../types';
import { apiClient } from '../api/client';
import { WaveformPlayer } from '../components/WaveformPlayer';

export const LibraryPage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { data } = await apiClient.get('/tracks/');
        setTracks(data);
      } catch (e) {
        console.error("No tracks found or error fetching", e);
      }
    };
    fetchTracks();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 className="title-glow">Your Library</h1>
      <p className="subtitle">All your generated masterpieces in one place.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '2rem' }}>
        {tracks.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't generated any tracks yet.</p>
          </div>
        ) : (
          tracks.map(track => (
            <div key={track.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: 600 }}>{track.prompt_used}</h3>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>{track.genre}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Created: {new Date(track.created_at).toLocaleString()}</p>
              <WaveformPlayer url={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/tracks/${track.id}/stream`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
