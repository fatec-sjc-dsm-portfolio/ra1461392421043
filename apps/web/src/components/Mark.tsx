import type { CSSProperties } from 'react';

/** FH monogram drawn as a constellation. Uses currentColor. */
export function Mark({ className = 'mark', ...rest }: { className?: string; x?: number; y?: number; width?: number; height?: number; style?: CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 38 24" aria-hidden="true" {...rest}>
      <g className="mark-lines">
        <line x1="3" y1="3" x2="3" y2="21" />
        <line x1="3" y1="3" x2="13" y2="3" />
        <line x1="3" y1="12" x2="11" y2="12" />
        <line x1="21" y1="3" x2="21" y2="21" />
        <line x1="35" y1="3" x2="35" y2="21" />
        <line x1="21" y1="12" x2="35" y2="12" />
        <line x1="13" y1="3" x2="21" y2="3" strokeDasharray="1 2.5" />
      </g>
      <g className="mark-stars">
        <circle cx="3" cy="3" r="1.7" />
        <circle cx="3" cy="12" r="1.2" />
        <circle cx="3" cy="21" r="1.4" />
        <circle cx="13" cy="3" r="1.2" />
        <circle cx="11" cy="12" r="1" />
        <circle cx="21" cy="3" r="1.2" />
        <circle cx="21" cy="21" r="1.2" />
        <circle cx="35" cy="3" r="1.7" />
        <circle cx="35" cy="21" r="1.4" />
        <circle cx="21" cy="12" r="1" />
        <circle cx="35" cy="12" r="1" />
      </g>
    </svg>
  );
}
