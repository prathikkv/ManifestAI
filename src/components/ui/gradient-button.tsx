import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

interface GradientButtonProps extends ButtonProps {
  gradient?: 'primary' | 'manifestation' | 'aurora' | 'dream' | 'vision' | 'energy' | 'growth';
  glowEffect?: boolean;
  pulseAnimation?: boolean;
}

const gradientStyles = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
  manifestation: 'manifestation-gradient hover:opacity-90',
  aurora: 'aurora-gradient hover:opacity-90',
  dream: 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600',
  vision: 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600',
  energy: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600',
  growth: 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600',
};

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradient = 'primary', glowEffect = false, pulseAnimation = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'text-white border-0 font-medium shadow-md transition-all duration-300',
          gradientStyles[gradient],
          glowEffect && 'glow-effect',
          pulseAnimation && 'animate-manifestation-pulse',
          'hover:shadow-lg hover:scale-105',
          className
        )}
        {...props}
      />
    );
  }
);

GradientButton.displayName = 'GradientButton';