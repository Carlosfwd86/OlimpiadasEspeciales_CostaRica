import React from 'react';

export type A11yIconName =
  | 'text-size'
  | 'contrast'
  | 'grayscale'
  | 'link-underline'
  | 'cursor'
  | 'pause'
  | 'reading-guide'
  | 'dyslexia'
  | 'reset'
  | 'close';

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const icons: Record<A11yIconName, React.ReactNode> = {
  'text-size': (
    <svg {...iconProps}>
      <path d="M4 7h16M9 15h6M12 7v12" />
      <path d="M7 4h2M15 4h2" strokeWidth={2.5} />
    </svg>
  ),
  contrast: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none" opacity={0.35} />
    </svg>
  ),
  grayscale: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18" fill="currentColor" stroke="none" opacity={0.25} />
      <path d="M12 3v18" />
    </svg>
  ),
  'link-underline': (
    <svg {...iconProps}>
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.5 5.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13.5 18.5" />
      <path d="M8 20h8" strokeWidth={2.5} />
    </svg>
  ),
  cursor: (
    <svg {...iconProps}>
      <path d="M5 4l7 16 2.5-6.5L21 11 5 4z" fill="currentColor" stroke="none" />
    </svg>
  ),
  pause: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6M14 9v6" strokeWidth={2.5} />
    </svg>
  ),
  'reading-guide': (
    <svg {...iconProps}>
      <path d="M4 19h16" strokeWidth={2.5} />
      <path d="M4 12h16" strokeWidth={3} />
      <path d="M4 5h16" opacity={0.4} />
    </svg>
  ),
  dyslexia: (
    <svg {...iconProps}>
      <path d="M4 7h6l2 10 2-10h6" />
      <path d="M6 12h4" strokeWidth={2.5} />
    </svg>
  ),
  reset: (
    <svg {...iconProps}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  ),
  close: (
    <svg {...iconProps}>
      <path d="M6 6l12 12M18 6L6 18" strokeWidth={2.5} />
    </svg>
  ),
};

export function A11yIcon({ name }: { name: A11yIconName }): React.JSX.Element {
  return <span className="a11y-icon-svg">{icons[name]}</span>;
}
