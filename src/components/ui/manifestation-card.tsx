import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ManifestationCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dream' | 'vision' | 'energy' | 'growth' | 'wisdom' | 'celebration';
  glowEffect?: boolean;
  floatAnimation?: boolean;
}

const variantStyles = {
  default: 'bg-card border-border',
  dream: 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950 dark:to-purple-950 dark:border-blue-800',
  vision: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:to-pink-950 dark:border-purple-800',
  energy: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800',
  growth: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800',
  wisdom: 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 dark:from-cyan-950 dark:to-blue-950 dark:border-cyan-800',
  celebration: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 dark:from-orange-950 dark:to-red-950 dark:border-orange-800',
};

export function ManifestationCard({
  children,
  className,
  variant = 'default',
  glowEffect = false,
  floatAnimation = false,
}: ManifestationCardProps) {
  return (
    <Card
      className={cn(
        variantStyles[variant],
        glowEffect && 'glow-effect',
        floatAnimation && 'animate-dream-float',
        'transition-all duration-300 hover:shadow-lg',
        className
      )}
    >
      {children}
    </Card>
  );
}

export function ManifestationCardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <CardHeader className={cn('pb-3', className)}>
      {children}
    </CardHeader>
  );
}

export function ManifestationCardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <CardTitle className={cn('text-lg font-semibold', className)}>
      {children}
    </CardTitle>
  );
}

export function ManifestationCardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <CardDescription className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </CardDescription>
  );
}

export function ManifestationCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <CardContent className={cn('pt-0', className)}>
      {children}
    </CardContent>
  );
}