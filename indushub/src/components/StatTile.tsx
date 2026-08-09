import React from 'react';
import { Text, View } from 'react-native';

interface StatTileProps {
  symbol: string;
  label: string;
  value: string;
  accent?: boolean;
}

/** Casilla de métrica para los resultados del simulador. */
export function StatTile({ symbol, label, value, accent = false }: StatTileProps) {
  return (
    <View
      className={`rounded-2xl p-3 flex-1 ${accent ? 'bg-primary' : 'bg-background'}`}
      style={{ minWidth: 120 }}
    >
      <Text className={`text-xs font-bold ${accent ? 'text-accent' : 'text-accent'}`}>{symbol}</Text>
      <Text
        className={`text-xl font-extrabold mt-1 ${accent ? 'text-white' : 'text-primary'}`}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text className={`text-[11px] mt-0.5 ${accent ? 'text-white/70' : 'text-muted'}`}>{label}</Text>
    </View>
  );
}
