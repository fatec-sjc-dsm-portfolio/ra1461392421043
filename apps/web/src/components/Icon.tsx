// Inline SVG icons (no emoji glyphs). Stroke icons follow currentColor.

const STROKE: Record<string, string> = {
  'arrow-down': 'M12 4.5v15M5.5 13l6.5 6.5 6.5-6.5',
  'arrow-right': 'M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5',
  'arrow-left': 'M19.5 12h-15M11 5.5 4.5 12l6.5 6.5',
  'arrow-up-right': 'M7 17 17 7M8.5 7H17v8.5',
  close: 'M6 6l12 12M18 6 6 18',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
};

const FILL: Record<string, string> = {
  github:
    'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3',
  linkedin:
    'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
};

export type IconName = keyof typeof STROKE | keyof typeof FILL;

export function Icon({ name, className = 'icon' }: { name: IconName; className?: string }) {
  const fill = FILL[name];
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {fill ? (
        <path d={fill} fill="currentColor" />
      ) : (
        <path d={STROKE[name]} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
