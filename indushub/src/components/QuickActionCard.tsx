import React from 'react';
import { Text, View, Pressable } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface QuickActionCardProps {
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
}

/** Acceso directo compacto (Estudio Rápido). */
export function QuickActionCard({ label, icon: Icon, onPress }: QuickActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface rounded-2xl p-3 flex-1 items-center"
      style={{
        shadowColor: '#0F2B48',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="w-10 h-10 rounded-xl items-center justify-center mb-2 bg-background">
        <Icon size={20} color={colors.accent} />
      </View>
      <Text className="text-primary text-xs font-semibold text-center" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
