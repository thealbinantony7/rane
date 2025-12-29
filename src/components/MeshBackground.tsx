import { memo } from 'react';

export const MeshBackground = memo(function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      {/* Subtle static gradient - no animations */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(ellipse at top left, hsl(0 0% 8%) 0%, transparent 50%), radial-gradient(ellipse at bottom right, hsl(0 0% 6%) 0%, transparent 50%)',
        }}
      />

      {/* Very subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});
