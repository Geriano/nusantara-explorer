import { LAMPORTS_PER_NUSA, getProgramName } from './constants';

export function lamportsToNusa(lamports: number): string {
  const nusa = lamports / LAMPORTS_PER_NUSA;
  return nusa.toLocaleString('en-US', {
    minimumFractionDigits: 9,
    maximumFractionDigits: 9,
  });
}

export function truncateHash(hash: string | undefined | null, start = 8, end = 6): string {
  if (!hash) return '\u2014';
  if (hash.length <= start + end + 3) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  if (seconds < 0) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatSlot(slot: number | undefined | null): string {
  if (slot == null) return '\u2014';
  return slot.toLocaleString('en-US');
}

export function programName(id: string): string {
  return getProgramName(id) ?? truncateHash(id);
}

export type SearchType = 'slot' | 'hash' | 'named' | 'unknown';

export function detectSearchType(input: string): SearchType {
  const trimmed = input.trim();
  if (!trimmed) return 'unknown';
  if (/^\d+$/.test(trimmed)) return 'slot';
  if (trimmed.endsWith('.nusantara')) return 'named';
  // Base64 URL-safe pattern (hashes are ~86 chars, but any length is valid search)
  if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed)) return 'hash';
  return 'unknown';
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
