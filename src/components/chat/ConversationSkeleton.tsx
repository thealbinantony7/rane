import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ConversationSkeleton = memo(function ConversationSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {/* Avatar skeleton */}
          <Skeleton className="w-11 h-11 rounded-lg flex-shrink-0" />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
});
