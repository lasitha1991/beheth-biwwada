import React from 'react';
import { format } from 'date-fns';

export default function MonthGrid({ days }: { days: { date: Date; hasRecord: boolean }[] }) {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Determine how many placeholder cells are needed so the 1st of the month
  // appears under the correct weekday when weeks start on Monday.
  // Assumption: `days` contains only the days for the current month in ascending order.
  let leadingBlanks = 0;
  if (days && days.length > 0) {
    const firstOfMonth = days.find(d => d.date.getDate() === 1)?.date ?? days[0].date;
    // JS: getDay() => 0 (Sun) .. 6 (Sat). Convert to Monday-first index 0..6
    const jsDay = firstOfMonth.getDay();
    leadingBlanks = (jsDay + 6) % 7; // Monday -> 0, Sunday -> 6
  }

  return (
    <div>
      {/* Weekday header starting from Monday */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
        {weekdays.map(w => (
          <div key={w} style={{ textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{w}</div>
        ))}
      </div>

      {/* Day cells: day number shown at the top of each cell; grid kept 7 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {/* leading placeholder cells so the 1st lines up under the correct weekday */}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div
            key={`pad-${i}`}
            style={{
              borderRadius: 8,
              padding: 8,
              minHeight: 56,
              background: 'transparent'
            }}
          />
        ))}

        {days.map(d => (
          <div
            key={d.date.toISOString()}
            style={{
              borderRadius: 8,
              padding: 8,
              minHeight: 56,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              background: d.hasRecord ? '#C8E6C9' : '#FFCDD2'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>{format(d.date, 'd')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
