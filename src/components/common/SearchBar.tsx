import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { detectSearchType } from '@/utils/format';
import type { SearchType } from '@/utils/format';

interface SearchBarProps {
  className?: string;
}

const searchTypeLabels: Record<SearchType, string> = {
  slot: 'Slot',
  hash: 'Hash',
  named: 'Name',
  unknown: '',
};

const searchTypeColors: Record<SearchType, string> = {
  slot: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  hash: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  named: 'bg-accent/20 text-accent border-accent/30',
  unknown: '',
};

export default function SearchBar({ className }: SearchBarProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const searchType = query.trim() ? detectSearchType(query.trim()) : 'unknown';

  // Ctrl/Cmd+K to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      setLoading(true);
      try {
        const type = detectSearchType(trimmed);

        switch (type) {
          case 'slot':
            navigate(`/block/${trimmed}`);
            break;
          case 'named':
            navigate(`/account/${trimmed}`);
            break;
          case 'hash':
            navigate(`/tx/${trimmed}`);
            break;
          default:
            // Try as a hash anyway
            navigate(`/tx/${trimmed}`);
            break;
        }
        setQuery('');
      } finally {
        setLoading(false);
      }
    },
    [query, navigate],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('relative flex items-center', className)}
    >
      <div
        className={clsx(
          'flex items-center w-full rounded-lg border',
          'border-border-dark dark:border-border-dark border-slate-300',
          'bg-bg-dark/50 dark:bg-bg-dark/50 bg-slate-100',
          'focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/30',
          'transition-all',
        )}
      >
        <Search className="w-4 h-4 ml-3 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by slot, hash, or account..."
          className={clsx(
            'flex-1 bg-transparent px-3 py-2 text-sm',
            'text-white dark:text-white text-slate-900',
            'placeholder:text-slate-500',
            'focus:outline-none',
          )}
        />

        {searchType !== 'unknown' && (
          <span
            className={clsx(
              'inline-flex items-center px-2 py-0.5 mr-1 rounded text-xs font-medium border',
              searchTypeColors[searchType],
            )}
          >
            {searchTypeLabels[searchType]}
          </span>
        )}

        {loading && (
          <Loader2 className="w-4 h-4 mr-3 shrink-0 text-accent animate-spin" />
        )}

        <kbd className="hidden sm:inline-flex items-center mr-2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 border border-border-dark dark:border-border-dark border-slate-300">
          {/Mac|iPhone/.test(navigator.userAgent) ? '\u2318' : 'Ctrl'}K
        </kbd>
      </div>
    </form>
  );
}
