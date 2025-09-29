import React, { useState } from 'react';
import { format } from 'date-fns';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const userId = 'default-user';

  async function onYes() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error('network');
      setMsg('Recorded ✅');
    } catch (err) {
      setMsg('Failed to record');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div style={{fontSize:18, marginBottom:8}}>{format(new Date(), 'EEEE, MMM d, yyyy')}</div>
      <button
        onClick={onYes}
        disabled={loading}
        style={{
          fontSize: 22,
          padding: '14px 28px',
          borderRadius: 12,
          background: '#1976d2',
          color: 'white',
          border: 'none'
        }}
      >
        {loading ? 'Saving...' : 'Yes'}
      </button>
      {msg && <div style={{marginTop:10}}>{msg}</div>}
    </main>
  );
}
