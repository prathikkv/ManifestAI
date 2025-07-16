import { cn } from "@/lib/utils";

interface EnergyOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dream' | 'vision' | 'energy' | 'growth' | 'wisdom' | 'celebration';
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const variantStyles = {
  dream: 'bg-gradient-to-br from-blue-400 to-purple-500',
  vision: 'bg-gradient-to-br from-purple-400 to-pink-500',
  energy: 'bg-gradient-to-br from-yellow-400 to-orange-500',
  growth: 'bg-gradient-to-br from-green-400 to-emerald-500',
  wisdom: 'bg-gradient-to-br from-cyan-400 to-blue-500',
  celebration: 'bg-gradient-to-br from-orange-400 to-red-500',
};

export function EnergyOrb({
  size = 'md',
  variant = 'dream',
  animated = true,
  className,
}: EnergyOrbProps) {
  return (
    <div
      className={cn(
        'rounded-full',
        sizeStyles[size],
        variantStyles[variant],
        animated && 'animate-manifestation-pulse',
        'shadow-lg opacity-80',
        className
      )}
      style={{
        boxShadow: animated ? 'var(--shadow-manifestation)' : 'var(--shadow-medium)',
      }}
    />
  );
}

export function EnergyOrbCluster({
  count = 3,
  variant = 'dream',
  className,
}: {
  count?: number;
  variant?: EnergyOrbProps['variant'];
  className?: string;
}) {
  return (
    <div className={cn('flex space-x-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <EnergyOrb
          key={i}
          size="sm"
          variant={variant}
          animated={true}
          style={{
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingEnergyOrbs({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const variants: EnergyOrbProps['variant'][] = ['dream', 'vision', 'energy', 'growth', 'wisdom'];
  
  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <EnergyOrb
          key={i}
          size={i % 2 === 0 ? 'sm' : 'md'}
          variant={variants[i % variants.length]}
          animated={true}
          className={cn(
            'absolute',
            'animate-dream-float',
            // Random positioning
            i === 0 && 'top-0 left-0',
            i === 1 && 'top-4 right-8',
            i === 2 && 'bottom-8 left-12',
            i === 3 && 'bottom-0 right-0',
            i === 4 && 'top-8 left-1/2',
          )}
          style={{
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}