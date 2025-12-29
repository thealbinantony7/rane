import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LinkUpLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizes = {
  sm: { icon: 'w-8 h-8', text: 'text-lg', inner: 'w-4 h-4' },
  md: { icon: 'w-10 h-10', text: 'text-xl', inner: 'w-5 h-5' },
  lg: { icon: 'w-14 h-14', text: 'text-2xl', inner: 'w-7 h-7' },
  xl: { icon: 'w-18 h-18', text: 'text-3xl', inner: 'w-9 h-9' },
};

export function LinkUpLogo({ size = 'md', showText = true, className, animated = true }: LinkUpLogoProps) {
  const sizeConfig = sizes[size];

  const iconContent = (
    <div className={cn(
      'relative rounded-xl bg-foreground flex items-center justify-center overflow-hidden',
      sizeConfig.icon
    )}>
      {/* Link icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('text-background', sizeConfig.inner)}
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      
      {/* Glass shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/20 via-transparent to-transparent" />
    </div>
  );

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {animated ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {iconContent}
        </motion.div>
      ) : iconContent}

      {showText && (
        <span className={cn(
          'font-bold tracking-tight text-foreground uppercase',
          sizeConfig.text
        )}>
          LINKUP
        </span>
      )}
    </div>
  );
}

export function LinkUpIcon({ size = 'md', className, animated = true }: Omit<LinkUpLogoProps, 'showText'>) {
  const sizeConfig = sizes[size];

  const content = (
    <div className={cn(
      'relative rounded-xl bg-foreground flex items-center justify-center overflow-hidden',
      sizeConfig.icon,
      className
    )}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('text-background', sizeConfig.inner)}
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/20 via-transparent to-transparent" />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
