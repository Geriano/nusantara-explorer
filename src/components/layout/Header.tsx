import { useState } from 'react';
import { Sun, Moon, ChevronDown, Wifi, WifiOff, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '@/hooks/useTheme';
import { useNetwork } from '@/hooks/useNetwork';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NETWORKS } from '@/utils/constants';
import { formatSlot } from '@/utils/format';
import SearchBar from '@/components/common/SearchBar';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { network, setNetwork } = useNetwork();
  const { latestSlot, isConnected } = useWebSocket();
  const [networkOpen, setNetworkOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50',
        'border-b border-border-dark dark:border-border-dark border-slate-200',
        'bg-bg-dark/95 dark:bg-bg-dark/95 bg-white/95 backdrop-blur-md',
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <a
            href="/"
            className="shrink-0 flex items-center gap-2 text-white dark:text-white text-slate-900 font-semibold text-lg"
          >
            <span className="text-accent font-bold">N</span>
            <span className="hidden sm:inline">Nusantara Explorer</span>
          </a>

          {/* Search - desktop */}
          <SearchBar className="hidden md:flex flex-1 max-w-xl" />

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Live slot indicator */}
            {latestSlot !== null && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-mono">
                <span
                  className={clsx(
                    'w-1.5 h-1.5 rounded-full',
                    isConnected ? 'bg-accent animate-pulse' : 'bg-red-400',
                  )}
                />
                Slot {formatSlot(latestSlot)}
              </div>
            )}

            {/* Connection indicator (small screens) */}
            <div className="lg:hidden">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-accent" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </div>

            {/* Network selector */}
            <div className="relative">
              <button
                onClick={() => setNetworkOpen(!networkOpen)}
                className={clsx(
                  'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium',
                  'border border-border-dark dark:border-border-dark border-slate-300',
                  'text-slate-300 dark:text-slate-300 text-slate-700',
                  'hover:bg-surface-dark dark:hover:bg-surface-dark hover:bg-slate-100',
                  'transition-colors',
                )}
              >
                {network.label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {networkOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNetworkOpen(false)}
                  />
                  <div
                    className={clsx(
                      'absolute right-0 top-full mt-1 z-20 w-40',
                      'rounded-lg border shadow-xl',
                      'border-border-dark dark:border-border-dark border-slate-200',
                      'bg-surface-dark dark:bg-surface-dark bg-white',
                    )}
                  >
                    {NETWORKS.map((n) => (
                      <button
                        key={n.name}
                        onClick={() => {
                          setNetwork(n.name);
                          setNetworkOpen(false);
                        }}
                        className={clsx(
                          'w-full text-left px-3 py-2 text-sm first:rounded-t-lg last:rounded-b-lg',
                          'transition-colors',
                          n.name === network.name
                            ? 'text-accent bg-accent/10'
                            : 'text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-accent/5',
                        )}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                'text-slate-400 hover:text-accent',
                'hover:bg-surface-dark dark:hover:bg-surface-dark hover:bg-slate-100',
              )}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-accent"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search + slot */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 space-y-2">
            <SearchBar className="w-full" />
            {latestSlot !== null && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-mono w-fit">
                <span
                  className={clsx(
                    'w-1.5 h-1.5 rounded-full',
                    isConnected ? 'bg-accent animate-pulse' : 'bg-red-400',
                  )}
                />
                Slot {formatSlot(latestSlot)}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
