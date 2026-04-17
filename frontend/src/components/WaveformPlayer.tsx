// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Download } from 'lucide-react';

interface WaveformProps {
  url: string;
  trackId?: number;
}

export const WaveformPlayer: React.FC<WaveformProps> = ({ url, trackId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Build authenticated URL by appending token as query param
  const token = localStorage.getItem('token');
  const authUrl = token ? `${url}?token=${token}` : url;

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current?.destroy();

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(0, 245, 212, 0.35)',
      progressColor: '#00f5d4',
      cursorColor: 'rgba(255,255,255,0.5)',
      barWidth: 3,
      barRadius: 3,
      height: 72,
      url: authUrl,
    });

    wavesurferRef.current.on('ready', () => {
      setDuration(wavesurferRef.current?.getDuration() || 0);
    });
    wavesurferRef.current.on('audioprocess', () => {
      setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
    });
    wavesurferRef.current.on('finish', () => setIsPlaying(false));

    return () => { wavesurferRef.current?.destroy(); };
  }, [authUrl]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
    setIsPlaying(wavesurferRef.current.isPlaying());
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const handleDownload = () => {
    if (!trackId) return;
    const a = document.createElement('a');
    a.href = `/tracks/${trackId}/download${token ? `?token=${token}` : ''}`;
    a.download = `sonicai-track-${trackId}.wav`;
    a.click();
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={togglePlay} style={{
          width: '48px', height: '48px', borderRadius: '50%', border: 'none', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary), #5a189a)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 15px rgba(157,78,221,0.4)',
        }}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '3px' }} />}
        </button>

        <div ref={containerRef} style={{ flexGrow: 1 }} />

        {trackId && (
          <button onClick={handleDownload} title="Download WAV" style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
            color: 'var(--text-muted)', width: '40px', height: '40px', borderRadius: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
          }}>
            <Download size={16} />
          </button>
        )}
      </div>

      {duration > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      )}
    </div>
  );
};
