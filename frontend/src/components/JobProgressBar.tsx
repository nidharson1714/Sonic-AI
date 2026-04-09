// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useJobStore } from '../store';

export const JobProgressBar: React.FC = () => {
  const { activeJob, setActiveJob } = useJobStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeJob) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    const ws = new WebSocket(`${wsUrl}/ws/jobs/${activeJob.id}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'queued') setProgress(10);
      else if (data.status === 'inference') setProgress(60);
      else if (data.status === 'complete') {
        setProgress(100);
        setActiveJob({ ...activeJob, status: 'complete', track_id: data.track_id });
        ws.close();
      } else if (data.status === 'failed') {
        setProgress(0);
        setActiveJob({ ...activeJob, status: 'failed' });
        ws.close();
      }
    };

    return () => ws.close();
  }, [activeJob?.id]);

  if (!activeJob || activeJob.status === 'complete' || activeJob.status === 'failed') return null;

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontWeight: 600 }}>Synthesizing Audio...</span>
        <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{progress}%</span>
      </div>
      <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--secondary), var(--primary))',
            transition: 'width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)'
          }} 
        />
      </div>
    </div>
  );
};
