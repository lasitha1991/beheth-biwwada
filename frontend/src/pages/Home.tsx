import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const userId = 'default-user';

  // selected date in YYYY-MM-DD format for the date picker
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [recorded, setRecorded] = useState(false);

  // whenever the selectedDate changes, query whether that date already has a record
  useEffect(() => {
    const parts = selectedDate.split('-');
    if (parts.length !== 3) return;
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    fetch(`/api/records?userId=${encodeURIComponent(userId)}&year=${year}&month=${month}&day=${day}`)
      .then(r => r.json())
      .then((rows: any[]) => {
        const has = rows && rows.length > 0;
        setRecorded(has);
        if (has) setMsg('Recorded ✅');
        else setMsg(null);
      })
      .catch(console.error);
  }, [selectedDate]);

  async function onYes() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date: selectedDate })
      });
      if (!res.ok) throw new Error('network');
      setMsg('Recorded ✅');
      // mark selected date as recorded so UI updates immediately
      setRecorded(true);
    } catch (err) {
      setMsg('Failed to record');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 18, marginBottom: 8 }}>{format(new Date(), 'EEEE, MMM d, yyyy')}</div>

      <label style={{ marginBottom: 10 }}>
        Date: {' '}
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{ padding: 6, borderRadius: 6 }}
        />
      </label>

      <button
        onClick={onYes}
        disabled={loading || recorded}
        style={{
          fontSize: 22,
          padding: '14px 28px',
          borderRadius: 12,
          background: '#1976d2',
          color: 'white',
          border: 'none'
        }}
      >
        {recorded ? 'Recorded ✅' : (loading ? 'Saving...' : 'Yes')}
      </button>
      {msg && <div style={{ marginTop: 10 }}>{msg}</div>}
    </main>
  );
}
