import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  /** 0–100 */
  progress: number;
  color?: string;
  trackClassName?: string;
  height?: number;
}

/** Barra de progreso simple y reutilizable. */
export function ProgressBar({
  progress,
  color = '#FF6B35',
  trackClassName = 'bg-line',
  height = 8,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <View className={`w-full rounded-full overflow-hidden ${trackClassName}`} style={{ height }}>
      <View
        style={{ width: `${clamped}%`, backgroundColor: color, height }}
        className="rounded-full"
      />
    </View>
  );
}
