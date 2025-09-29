import React from 'react';
import { format } from 'date-fns';

export default function MonthGrid({ days }: { days: { date: Date; hasRecord: boolean }[] }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6}}>
      {days.map(d => (
        <div key={d.date.toISOString()} style={{
          borderRadius:8,
          padding:8,
          minHeight:56,
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          background: d.hasRecord ? '#C8E6C9' : '#FFCDD2'
        }}>
          <div style={{fontSize:14}}>{format(d.date, 'd')}</div>
        </div>
      ))}
    </div>
  );
}
