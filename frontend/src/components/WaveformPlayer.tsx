// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';

interface WaveformProps {
  url: string;
}

export const WaveformPlayer: React.FC<WaveformProps> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(0, 245, 212, 0.4)',
      progressColor: '#00f5d4',
      cursorColor: '#ffffff',
      barWidth: 3,
      barRadius: 3,
      height: 80,
      url: url,
    });

    wavesurferRef.current.on('finish', () => setIsPlaying(false));

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(wavesurferRef.current.isPlaying());
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', padding: '10px 0' }}>
      <button 
        onClick={togglePlay}
        style={{
          width: '50px', height: '50px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, var(--primary), #5a189a)',
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 4px 15px rgba(157, 78, 221, 0.4)'
        }}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
      </button>
      <div ref={containerRef} style={{ flexGrow: 1 }} />
    </div>
  );
};
