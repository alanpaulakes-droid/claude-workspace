import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Encabezado de sección con acción opcional a la derecha. */
export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3 mt-6">
      <Text className="text-primary text-lg font-bold">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-accent font-semibold text-sm">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
