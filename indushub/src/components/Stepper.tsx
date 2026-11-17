import React from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Permite decimales en el input de texto */
  decimals?: boolean;
}

/** Control numérico con − / + e input directo. Base de los parámetros del simulador. */
export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  unit,
  decimals = false,
}: StepperProps) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  const dec = () => onChange(clamp(Number((value - step).toFixed(2))));
  const inc = () => onChange(clamp(Number((value + step).toFixed(2))));

  const onText = (t: string) => {
    const cleaned = t.replace(',', '.');
    const parsed = decimals ? parseFloat(cleaned) : parseInt(cleaned, 10);
    if (Number.isNaN(parsed)) {
      onChange(min);
      return;
    }
    onChange(clamp(parsed));
  };

  return (
    <View className="mb-4">
      <Text className="text-primary font-semibold text-sm mb-2">
        {label}
        {unit ? <Text className="text-muted font-normal"> ({unit})</Text> : null}
      </Text>
      <View className="flex-row items-center">
        <Pressable
          onPress={dec}
          className="w-11 h-11 rounded-xl bg-background items-center justify-center border border-line"
        >
          <Minus size={18} color={colors.primary} />
        </Pressable>
        <TextInput
          value={String(value)}
          onChangeText={onText}
          keyboardType={decimals ? 'decimal-pad' : 'number-pad'}
          selectTextOnFocus
          className="flex-1 mx-2 h-11 rounded-xl bg-surface border border-line text-center text-primary font-bold text-base"
        />
        <Pressable
          onPress={inc}
          className="w-11 h-11 rounded-xl bg-background items-center justify-center border border-line"
        >
          <Plus size={18} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
