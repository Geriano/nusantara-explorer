import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, Code, FileText } from 'lucide-react';
import clsx from 'clsx';
import { copyToClipboard } from '@/utils/format';

interface AccountDataProps {
  data: string;
}

function base64ToHex(base64: string): string {
  try {
    const raw = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return Array.from(raw)
      .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  } catch {
    return '(invalid Base64)';
  }
}

export default function AccountData({ data }: AccountDataProps) {
  const [viewMode, setViewMode] = useState<'base64' | 'hex'>('base64');
  const [copied, setCopied] = useState(false);

  const isEmpty = !data || data.length === 0;

  const hexData = useMemo(() => {
    if (viewMode !== 'hex' || isEmpty) return '';
    return base64ToHex(data);
  }, [data, viewMode, isEmpty]);

  const displayData = viewMode === 'base64' ? data : hexData;

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(displayData);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [displayData]);

  return (
    <div
      className={clsx(
        'rounded-xl border p-5',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-300 text-slate-700">
            Account Data
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border-dark dark:border-border-dark border-slate-200 overflow-hidden">
            <button
              onClick={() => setViewMode('base64')}
              className={clsx(
                'px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1',
                viewMode === 'base64'
                  ? 'bg-accent/20 text-accent'
                  : 'text-slate-400 hover:text-white dark:hover:text-white hover:text-slate-900',
              )}
            >
              <FileText className="w-3 h-3" />
              Base64
            </button>
            <button
              onClick={() => setViewMode('hex')}
              className={clsx(
                'px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1',
                viewMode === 'hex'
                  ? 'bg-accent/20 text-accent'
                  : 'text-slate-400 hover:text-white dark:hover:text-white hover:text-slate-900',
              )}
            >
              <Code className="w-3 h-3" />
              Hex
            </button>
          </div>

          {/* Copy button */}
          {!isEmpty && (
            <button
              onClick={handleCopy}
              className={clsx(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium',
                'border border-border-dark dark:border-border-dark border-slate-200',
                'text-slate-400 hover:text-accent transition-colors',
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-accent" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No data associated with this account
        </div>
      ) : (
        <div
          className={clsx(
            'rounded-lg p-4 overflow-x-auto',
            'bg-bg-dark dark:bg-bg-dark bg-slate-50',
            'border border-border-dark/50 dark:border-border-dark/50 border-slate-200',
          )}
        >
          <pre className="font-mono text-xs text-slate-300 dark:text-slate-300 text-slate-700 whitespace-pre-wrap break-all leading-relaxed">
            {displayData}
          </pre>
        </div>
      )}
    </div>
  );
}
