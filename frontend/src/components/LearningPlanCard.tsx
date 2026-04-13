// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { BookOpen, Music, Zap, Clock, Piano, Lightbulb } from 'lucide-react';
import { apiClient } from '../api/client';

interface LearningPlan {
  genre: string;
  scale: string;
  chords: string;
  tempo: string;
  key: string;
  instruments: string;
  sound_design: string;
  tip: string;
  theory_note: string;
}

interface Props {
  genre: string;
}

export const LearningPlanCard: React.FC<Props> = ({ genre }) => {
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/generate/learning-plan?genre=${encodeURIComponent(genre)}`)
      .then(({ data }) => setPlan(data))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, [genre]);

  if (loading) return (
    <div className="glass-panel" style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading music theory plan...
    </div>
  );

  if (!plan) return null;

  const items = [
    { icon: Music, label: 'Scale / Mode', value: plan.scale },
    { icon: Music, label: 'Chords & Harmony', value: plan.chords },
    { icon: Clock, label: 'Tempo', value: plan.tempo },
    { icon: Zap, label: 'Key', value: plan.key },
    { icon: Piano, label: 'Instruments', value: plan.instruments },
    { icon: Zap, label: 'Sound Design', value: plan.sound_design },
  ];

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <BookOpen size={24} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{plan.genre} — Music Theory Plan</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Icon size={12} /> {label}
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.2)', padding: '14px', borderRadius: '10px', marginBottom: '10px' }}>
        <div style={{ color: 'var(--secondary)', fontSize: '0.8rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Lightbulb size={12} /> Pro Tip
        </div>
        <p style={{ margin: 0, fontSize: '0.95rem' }}>{plan.tip}</p>
      </div>

      <div style={{ background: 'rgba(157,78,221,0.05)', border: '1px solid rgba(157,78,221,0.2)', padding: '14px', borderRadius: '10px' }}>
        <div style={{ color: 'var(--primary)', fontSize: '0.8rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <BookOpen size={12} /> Theory Note
        </div>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>{plan.theory_note}</p>
      </div>
    </div>
  );
};
