import { cn } from '@/lib/utils';

interface RaneLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 'w-8 h-8', text: 'text-lg', inner: 'w-4 h-4' },
  md: { icon: 'w-10 h-10', text: 'text-xl', inner: 'w-5 h-5' },
  lg: { icon: 'w-14 h-14', text: 'text-2xl', inner: 'w-7 h-7' },
  xl: { icon: 'w-20 h-20', text: 'text-3xl', inner: 'w-10 h-10' },
};

export function RaneLogo({ size = 'md', showText = true, className }: RaneLogoProps) {
  const sizeConfig = sizes[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logo Icon */}
      <div className={cn(
        'relative rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg',
        sizeConfig.icon
      )}>
        {/* Inner icon - stylized "R" shape */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn('text-primary-foreground', sizeConfig.inner)}
        >
          {/* Stylized R that looks like a speech bubble / connection */}
          <path
            d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.19 4.47 3 5.74V21l4-3h2c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M8 9h5a2 2 0 012 2v0a2 2 0 01-2 2h-3v3"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
      </div>

      {/* Text */}
      {showText && (
        <span className={cn(
          'font-bold tracking-tight text-gradient',
          sizeConfig.text
        )}>
          Rane
        </span>
      )}
    </div>
  );
}

export function RaneIcon({ size = 'md', className }: Omit<RaneLogoProps, 'showText'>) {
  const sizeConfig = sizes[size];

  return (
    <div className={cn(
      'relative rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg',
      sizeConfig.icon,
      className
    )}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn('text-primary-foreground', sizeConfig.inner)}
      >
        <path
          d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.19 4.47 3 5.74V21l4-3h2c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M8 9h5a2 2 0 012 2v0a2 2 0 01-2 2h-3v3"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
    </div>
  );
}
