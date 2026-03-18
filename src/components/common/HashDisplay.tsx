import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import { truncateHash, copyToClipboard } from '@/utils/format';

interface HashDisplayProps {
  hash: string | undefined | null;
  type?: 'account' | 'tx' | 'block';
  truncate?: boolean;
  className?: string;
}

export default function HashDisplay({
  hash,
  type,
  truncate = true,
  className,
}: HashDisplayProps) {
  const [copied, setCopied] = useState(false);

  const safeHash = hash ?? '';

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!safeHash) return;
      const ok = await copyToClipboard(safeHash);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    [safeHash],
  );

  if (!safeHash) {
    return <span className="font-mono text-sm text-slate-500">{'\u2014'}</span>;
  }

  const displayText = truncate ? truncateHash(safeHash) : safeHash;

  const linkPath =
    type === 'account'
      ? `/account/${safeHash}`
      : type === 'tx'
        ? `/tx/${safeHash}`
        : type === 'block'
          ? `/block/${safeHash}`
          : undefined;

  const content = (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-mono text-sm',
        className,
      )}
    >
      <span
        className={clsx(
          'break-all',
          linkPath &&
            'text-accent hover:text-accent-hover transition-colors cursor-pointer',
          !linkPath && 'text-slate-300 dark:text-slate-300',
        )}
        title={safeHash}
      >
        {displayText}
      </span>
      <button
        onClick={handleCopy}
        className={clsx(
          'inline-flex items-center justify-center shrink-0 rounded p-0.5',
          'text-slate-400 hover:text-accent transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-accent/50',
        )}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        aria-label="Copy hash"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-accent" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
      {copied && (
        <span className="text-xs text-accent font-sans animate-in fade-in">
          Copied!
        </span>
      )}
    </span>
  );

  if (linkPath) {
    return <Link to={linkPath}>{content}</Link>;
  }

  return content;
}
