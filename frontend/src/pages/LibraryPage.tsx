// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Track } from '../types';
import { apiClient } from '../api/client';
import { WaveformPlayer } from '../components/WaveformPlayer';
import { Library } from 'lucide-react';



const GENRE_COLORS: Record<string, string> = {
  'Lo-Fi': '#9d4edd',
  'Cinematic': '#3a86ff',
  'Electronic': '#00f5d4',
  'Ambient': '#06d6a0',
  'Jazz': '#ffb703',
  'Pop': '#fb5607',
};

export const LibraryPage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/tracks/')
      .then(({ data }) => setTracks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const token = localStorage.getItem('token');

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
        <Library size={32} color="var(--secondary)" />
        <h1 className="title-glow" style={{ margin: 0 }}>Library</h1>
      </div>
      <p className="subtitle">All your generated tracks.</p>

      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
          Loading your tracks...
        </div>
      ) : tracks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
          <Library size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>No tracks yet. Head to the Studio to generate your first track.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '2rem' }}>
          {tracks.map(track => {
            const color = GENRE_COLORS[track.genre] || 'var(--primary)';
            const streamUrl = `/tracks/${track.id}/stream`;
            return (
              <div key={track.id} className="glass-panel" style={{ borderLeft: `3px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{track.prompt_used}</p>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(track.created_at).toLocaleString()} · {track.duration_sec}s
                    </p>
                  </div>
                  <span style={{
                    background: `${color}22`, color, border: `1px solid ${color}44`,
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
                  }}>
                    {track.genre}
                  </span>
                </div>
                <WaveformPlayer url={streamUrl} trackId={track.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
