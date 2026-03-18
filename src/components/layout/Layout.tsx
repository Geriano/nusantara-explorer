import { Outlet, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import Header from './Header';
import Footer from './Footer';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/validators', label: 'Validators' },
  { to: '/faucet', label: 'Faucet' },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-dark dark:bg-bg-dark bg-slate-50 text-white dark:text-white text-slate-900">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Navigation bar */}
      <nav
        className={clsx(
          'border-b',
          'border-border-dark dark:border-border-dark border-slate-200',
          'bg-bg-dark/80 dark:bg-bg-dark/80 bg-white/80 backdrop-blur-sm',
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 -mb-px overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    isActive
                      ? 'border-accent text-accent'
                      : 'border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 hover:text-slate-700',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
