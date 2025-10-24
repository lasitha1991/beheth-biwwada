import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const userId = 'default-user';
  const [recordedToday, setRecordedToday] = useState(false);

  useEffect(() => {
    // fetch records for current month and check if there's a record for today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    // include the day param so backend can return only today's records
    fetch(`/api/records?userId=${encodeURIComponent(userId)}&year=${year}&month=${month}&day=${day}`)
      .then(r => r.json())
      .then((rows: any[]) => {
        const has = rows && rows.length > 0;
        setRecordedToday(has);
        if (has) setMsg('Recorded ✅');
      })
      .catch(console.error);
  }, []);

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
        // mark recorded today so UI updates immediately
        setRecordedToday(true);
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
        disabled={loading || recordedToday}
        style={{
          fontSize: 22,
          padding: '14px 28px',
          borderRadius: 12,
          background: '#1976d2',
          color: 'white',
          border: 'none'
        }}
      >
        {recordedToday ? 'Recorded ✅' : (loading ? 'Saving...' : 'Yes')}
      </button>
      {msg && <div style={{marginTop:10}}>{msg}</div>}
    </main>
  );
}
