import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RaneLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizes = {
  sm: { icon: 'w-9 h-9', text: 'text-lg', inner: 'w-5 h-5' },
  md: { icon: 'w-11 h-11', text: 'text-xl', inner: 'w-6 h-6' },
  lg: { icon: 'w-16 h-16', text: 'text-2xl', inner: 'w-8 h-8' },
  xl: { icon: 'w-20 h-20', text: 'text-3xl', inner: 'w-10 h-10' },
};

export function RaneLogo({ size = 'md', showText = true, className, animated = false }: RaneLogoProps) {
  const sizeConfig = sizes[size];

  const iconContent = (
    <div className={cn(
      'relative rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center glow-primary',
      sizeConfig.icon
    )}>
      {/* Inner icon - clean speech bubble */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn('text-primary-foreground drop-shadow-sm', sizeConfig.inner)}
      >
        <path
          d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.19 4.47 3 5.74V21l4-3h2c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
          fill="currentColor"
        />
      </svg>
      
      {/* Premium glass shine */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/5 to-transparent" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {animated ? (
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {iconContent}
        </motion.div>
      ) : iconContent}

      {showText && (
        <span className={cn(
          'font-display tracking-tight text-foreground',
          sizeConfig.text
        )}>
          Rane
        </span>
      )}
    </div>
  );
}

export function RaneIcon({ size = 'md', className, animated = false }: Omit<RaneLogoProps, 'showText'>) {
  const sizeConfig = sizes[size];

  const content = (
    <div className={cn(
      'relative rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center glow-primary',
      sizeConfig.icon,
      className
    )}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn('text-primary-foreground drop-shadow-sm', sizeConfig.inner)}
      >
        <path
          d="M12 3C7.03 3 3 6.58 3 11c0 2.38 1.19 4.47 3 5.74V21l4-3h2c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
          fill="currentColor"
        />
      </svg>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/5 to-transparent" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
