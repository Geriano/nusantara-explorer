import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <FileQuestion className="w-16 h-16 text-slate-500 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-3">404</h1>
      <h2 className="text-xl font-semibold text-slate-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-slate-400 max-w-md mb-8">
        The page you are looking for does not exist or may have been moved.
        Please check the URL or navigate back to the dashboard.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
          bg-accent text-bg-dark hover:bg-accent-hover transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
