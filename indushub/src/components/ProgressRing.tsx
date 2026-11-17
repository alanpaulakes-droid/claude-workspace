import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme/colors';

interface ProgressRingProps {
  /** Progreso 0–100 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  /** Etiqueta central; por defecto muestra el porcentaje */
  label?: string;
}

/** Indicador circular de progreso (SVG). Reutilizable en Home/Progreso. */
export function ProgressRing({
  progress,
  size = 96,
  strokeWidth = 10,
  color = colors.accent,
  trackColor = colors.line,
  label,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          // arranca en las 12 en punto
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text className="text-primary font-extrabold" style={{ fontSize: size * 0.24 }}>
          {label ?? `${Math.round(clamped)}%`}
        </Text>
      </View>
    </View>
  );
}
