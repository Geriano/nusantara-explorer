import { useState, useEffect, useMemo } from 'react';
import { timeAgo } from '@/utils/format';

interface TimeAgoProps {
  timestamp: number;
}

export default function TimeAgo({ timestamp }: TimeAgoProps) {
  const [, setTick] = useState(0);

  const ageSeconds = useMemo(
    () => Math.floor((Date.now() - timestamp * 1000) / 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timestamp],
  );

  useEffect(() => {
    const interval = ageSeconds < 60 ? 1000 : 60_000;
    const timer = setInterval(() => setTick((t) => t + 1), interval);
    return () => clearInterval(timer);
  }, [ageSeconds]);

  const absoluteTime = useMemo(() => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }, [timestamp]);

  return (
    <time
      dateTime={new Date(timestamp * 1000).toISOString()}
      title={absoluteTime}
      className="text-slate-400 dark:text-slate-400 text-sm whitespace-nowrap"
    >
      {timeAgo(timestamp)}
    </time>
  );
}
