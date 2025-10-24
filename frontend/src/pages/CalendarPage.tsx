import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths } from 'date-fns';
import MonthGrid from '../components/MonthGrid';

type Record = { id: number; user_id: string; ts: string };

export default function CalendarPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const userId = 'default-user';

  // currentMonth holds a Date representing the active month (kept at startOfMonth)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));

  useEffect(() => {
    // fetch records for the visible month (year and month as params)
    const year = currentMonth.getFullYear();
    // month as 1-12 (zero pad to 2 digits)
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');

    fetch(`/api/records?userId=${encodeURIComponent(userId)}&year=${year}&month=${month}`)
      .then(r => r.json())
      .then(setRecords)
      .catch(console.error);
  }, [currentMonth]);

  const setOfDays = new Set(records.map(r => r.ts.slice(0,10)));

  // compute days for the current selected month
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const dayStatus = days.map(d => ({ date: d, hasRecord: setOfDays.has(format(d, 'yyyy-MM-dd')) }));

  function goPrevMonth() {
    setCurrentMonth(m => addMonths(m, -1));
  }

  function goNextMonth() {
    setCurrentMonth(m => addMonths(m, 1));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={goPrevMonth} style={{ padding: '6px 10px' }} aria-label="Previous month">◀</button>
        <h3 style={{ margin: 0 }}>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={goNextMonth} style={{ padding: '6px 10px' }} aria-label="Next month">▶</button>
      </div>

      <MonthGrid days={dayStatus} />
    </div>
  );
}
