import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

/** Tarjeta base: fondo blanco, bordes redondeados y sombra suave. */
export function Card({ className = '', children, style, ...rest }: CardProps) {
  return (
    <View
      className={`bg-surface rounded-2xl p-4 ${className}`}
      style={[
        {
          shadowColor: '#0F2B48',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
          elevation: 3,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
