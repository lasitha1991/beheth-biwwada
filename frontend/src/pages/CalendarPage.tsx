import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import MonthGrid from '../components/MonthGrid';

type Record = { id: number; user_id: string; ts: string };

export default function CalendarPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const userId = 'default-user';

  useEffect(() => {
    fetch(`/api/records?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(setRecords)
      .catch(console.error);
  }, []);

  const setOfDays = new Set(records.map(r => r.ts.slice(0,10)));

  const today = new Date();
  const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });

  const dayStatus = days.map(d => ({ date: d, hasRecord: setOfDays.has(format(d, 'yyyy-MM-dd')) }));

  return (
    <div>
      <h3>{format(today, 'MMMM yyyy')}</h3>
      <MonthGrid days={dayStatus} />
    </div>
  );
}
