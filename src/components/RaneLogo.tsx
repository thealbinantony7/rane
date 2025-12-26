import { cn } from '@/lib/utils';

interface RaneLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 'w-9 h-9', text: 'text-lg', inner: 'w-5 h-5' },
  md: { icon: 'w-11 h-11', text: 'text-xl', inner: 'w-6 h-6' },
  lg: { icon: 'w-16 h-16', text: 'text-2xl', inner: 'w-8 h-8' },
  xl: { icon: 'w-20 h-20', text: 'text-3xl', inner: 'w-10 h-10' },
};

export function RaneLogo({ size = 'md', showText = true, className }: RaneLogoProps) {
  const sizeConfig = sizes[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logo Icon - Apple-style clean design */}
      <div className={cn(
        'relative rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-apple',
        sizeConfig.icon
      )}>
        {/* Inner icon - clean speech bubble */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn('text-primary-foreground', sizeConfig.inner)}
        >
          <path
            d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.19 4.47 3 5.74V21l4-3h2c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
            fill="currentColor"
          />
        </svg>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/25 via-transparent to-transparent" />
      </div>

      {/* Text */}
      {showText && (
        <span className={cn(
          'font-display font-semibold tracking-tight text-foreground',
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
      'relative rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-apple',
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
        />
      </svg>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/25 via-transparent to-transparent" />
    </div>
  );
}
