// @ts-nocheck
import React from 'react';
import { BookOpen, Music } from 'lucide-react';

interface LearningPlanProps {
  genre: string;
}

export const LearningPlanCard: React.FC<LearningPlanProps> = ({ genre }) => {
  // Mock logic based on the user's genre selection
  const getTheory = () => {
    switch(genre) {
      case 'Lo-Fi':
        return {
          chords: 'Major 7ths and Minor 9ths (e.g., Cmaj7 - Am9)',
          tempo: '70-90 BPM',
          instruments: 'Detuned piano, vinyl crackle, saturated bass',
          tip: 'Use slight swing/groove on the hi-hats to humanize the beat.'
        };
      case 'Cinematic':
        return {
          chords: 'Minor chords with added 6ths or 9ths, suspended chords',
          tempo: '60-80 BPM (often free rhythm)',
          instruments: 'Heavy strings, brass stabs, deep sub bass',
          tip: 'Build tension by holding root notes while shifting chords above them.'
        };
      default:
        return {
          chords: 'Four-on-the-floor, Minor and Major triads',
          tempo: '120-128 BPM',
          instruments: 'Synthesizers, tight electronic drums, saw waves',
          tip: 'Focus on the buildup and release (the drop) to create energy.'
        };
    }
  };

  const theory = getTheory();

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <BookOpen size={24} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{genre} Music Theory Plan</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Music size={14} /> Chords & Harmony
          </h4>
          <p style={{ margin: 0 }}>{theory.chords}</p>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Music size={14} /> Traditional Tempo
          </h4>
          <p style={{ margin: 0 }}>{theory.tempo}</p>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Music size={14} /> Key Instruments
          </h4>
          <p style={{ margin: 0 }}>{theory.instruments}</p>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', borderLeft: '3px solid var(--secondary)' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Music size={14} /> Pro Tip
          </h4>
          <p style={{ margin: 0 }}>{theory.tip}</p>
        </div>
      </div>
    </div>
  );
};
