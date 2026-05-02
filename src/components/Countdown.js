"use client";
import { useState, useEffect } from "react";

export default function Countdown({ votingDateStr }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const votingDate = new Date(votingDateStr);
    votingDate.setHours(0, 0, 0, 0);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = votingDate - now;

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [votingDateStr]);

  if (!timeLeft) {
    return (
      <div className="card" style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <h3 style={{ color: 'var(--success)' }}>Election Complete</h3>
        <p>Voting has concluded for this election.</p>
      </div>
    );
  }

  const TimeBox = ({ value, label }) => (
    <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', minWidth: '80px' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--primary)' }}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </div>
    </div>
  );

  return (
    <div className="card mb-4">
      <h3 className="mb-4 text-center">Time Until Voting</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}
