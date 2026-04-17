// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { JobProgressBar } from '../components/JobProgressBar';
import { LearningPlanCard } from '../components/LearningPlanCard';
import { WaveformPlayer } from '../components/WaveformPlayer';
import { useJobStore } from '../store';
import { apiClient } from '../api/client';
import { Music, Wand2, RotateCcw } from 'lucide-react';

const GENRES = ['Lo-Fi', 'Cinematic', 'Electronic', 'Ambient', 'Jazz', 'Pop'];

export const GeneratePage = () => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Lo-Fi');
  const [error, setError] = useState('');
  const { setActiveJob, activeJob } = useJobStore();

  const isGenerating = activeJob?.status === 'queued' || activeJob?.status === 'inference';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError('');
    try {
      const { data } = await apiClient.post('/generate/', { prompt: prompt.trim(), genre });
      setActiveJob(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Generation failed. Is the backend running?');
    }
  };

  const handleReset = () => {
    setActiveJob(null);
    setPrompt('');
    setError('');
  };

  const streamUrl = activeJob?.track_id
    ? `/tracks/${activeJob.track_id}/stream`
    : null;

  return (
    <div className="container">
      <h1 className="title-glow">Studio</h1>
      <p className="subtitle">Plan → Learn → Customize → Generate</p>

      {/* Step 1 & 2: Select genre → see theory plan */}
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '1rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          Step 1 — Choose Your Style
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              style={{
                background: genre === g ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${genre === g ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                color: 'white', padding: '10px 20px', borderRadius: '30px',
                cursor: 'pointer', transition: 'all 0.25s',
                display: 'flex', alignItems: 'center', gap: '7px',
                fontWeight: genre === g ? 600 : 400,
                transform: genre === g ? 'scale(1.05)' : 'scale(1)',
                fontSize: '0.95rem',
              }}
            >
              <Music size={15} /> {g}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Music theory learning plan */}
      <div>
        <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Step 2 — Learn the Theory
        </div>
        <LearningPlanCard genre={genre} />
      </div>

      {/* Step 3: Enter prompt and generate */}
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Step 3 — Describe Your Track
        </label>
        <input
          type="text"
          className="input-field"
          placeholder={`e.g. A relaxing ${genre} beat for late night studying...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
          style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}
          disabled={isGenerating}
        />

        {error && (
          <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              flex: 1, justifyContent: 'center',
              opacity: (!prompt.trim() || isGenerating) ? 0.5 : 1,
            }}
          >
            <Wand2 size={18} />
            {isGenerating ? 'Generating...' : 'Generate Track'}
          </button>
          {activeJob && (
            <button onClick={handleReset} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
              color: 'var(--text-muted)', padding: '14px 18px', borderRadius: '12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <RotateCcw size={16} /> New
            </button>
          )}
        </div>
      </div>

      {/* Live progress */}
      <JobProgressBar />

      {/* Result */}
      {activeJob?.status === 'complete' && streamUrl && (
        <div className="glass-panel" style={{ marginTop: '2rem', border: '1px solid rgba(0,245,212,0.3)' }}>
          <h3 style={{ color: 'var(--secondary)', fontSize: '1.4rem', marginBottom: '0.5rem', marginTop: 0 }}>
            Track Ready
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: 0, fontSize: '0.9rem' }}>
            {genre} · "{prompt}"
          </p>
          <WaveformPlayer url={streamUrl} trackId={activeJob.track_id} />
        </div>
      )}

      {activeJob?.status === 'failed' && (
        <div className="glass-panel" style={{ marginTop: '2rem', border: '1px solid rgba(255,107,107,0.3)' }}>
          <p style={{ color: '#ff6b6b', margin: 0 }}>Generation failed. Please try again.</p>
        </div>
      )}
    </div>
  );
};
