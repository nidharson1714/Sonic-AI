// @ts-nocheck
import React, { useState } from 'react';
import { JobProgressBar } from '../components/JobProgressBar';
import { LearningPlanCard } from '../components/LearningPlanCard';
import { WaveformPlayer } from '../components/WaveformPlayer';
import { useJobStore } from '../store';
import { apiClient } from '../api/client';
import { Music, Wand2 } from 'lucide-react';

export const GeneratePage = () => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Lo-Fi');
  const { setActiveJob, activeJob } = useJobStore();

  const handleGenerate = async () => {
    if (!prompt) return;
    try {
      const { data } = await apiClient.post('/generate/', { prompt, genre });
      setActiveJob(data);
    } catch (e) {
      console.error(e);
      alert('Ensure backend is running and you are authenticated (Skipping auth UI for now).');
    }
  };

  return (
    <div className="container">
      <h1 className="title-glow">Studio</h1>
      <p className="subtitle">Enter your creative vision and let SonicAI compose.</p>
      
      <LearningPlanCard genre={genre} />

      <div className="glass-panel" style={{ marginTop: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 500, fontSize: '1.1rem' }}>Musical Prompt</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. A relaxing beat for late night studying..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div style={{ marginBottom: '3rem' }}>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 500, fontSize: '1.1rem' }}>Select Style Formulation</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            {['Lo-Fi', 'Cinematic', 'Electronic'].map(g => (
              <button 
                key={g}
                style={{
                  background: genre === g ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${genre === g ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: genre === g ? 600 : 400,
                  transform: genre === g ? 'scale(1.05)' : 'scale(1)'
                }}
                onClick={() => setGenre(g)}
              >
                <Music size={18} /> {g}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleGenerate}
          disabled={activeJob?.status === 'queued' || activeJob?.status === 'inference'}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center', opacity: (!prompt) ? 0.5 : 1 }}
        >
          <Wand2 size={20} />
          Generate Track
        </button>
      </div>

      <JobProgressBar />
      
      {activeJob?.status === 'complete' && activeJob.track_id && (
        <div className="glass-panel" style={{ marginTop: '2rem', border: '1px solid var(--secondary)' }}>
          <h3 style={{ color: 'var(--secondary)', fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Track Synthesized!</h3>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Track ID #{activeJob.track_id} is ready.</p>
          <div style={{ marginTop: '2rem' }}>
            <WaveformPlayer url={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/tracks/${activeJob.track_id}/stream`} />
          </div>
        </div>
      )}
    </div>
  );
};
