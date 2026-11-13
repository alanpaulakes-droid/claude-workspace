import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Waypoints } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Card } from '@/components/Card';
import { Stepper } from '@/components/Stepper';
import { StatTile } from '@/components/StatTile';
import { QueueVisualizer } from '@/components/QueueVisualizer';
import { solveMMc, fmt, formatDuration } from '@/utils/queueing';

/** Herramientas → Simulador de eventos discretos (colas M/M/c). */
export function ToolsScreen() {
  const [lambda, setLambda] = useState(18); // λ clientes/hora
  const [mu, setMu] = useState(8); // μ clientes/hora por servidor
  const [servers, setServers] = useState(3); // c

  // Cálculo reactivo en cada cambio de parámetro.
  const result = useMemo(
    () => solveMMc({ lambda, mu, servers }),
    [lambda, mu, servers],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Título */}
        <View className="flex-row items-center pt-3 mb-1">
          <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center mr-3">
            <Waypoints size={20} color={colors.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-primary text-lg font-extrabold">Simulador de Colas</Text>
            <Text className="text-muted text-xs">Arena Lite · Modelo M/M/c</Text>
          </View>
        </View>

        {/* Parámetros */}
        <Card className="mt-4">
          <View className="flex-row items-center mb-3">
            <Activity size={16} color={colors.accent} />
            <Text className="text-primary font-bold ml-2">Parámetros de entrada</Text>
          </View>
          <Stepper
            label="Tasa de llegada (λ)"
            unit="clientes/hora"
            value={lambda}
            onChange={setLambda}
            min={0}
            max={500}
            step={1}
            decimals
          />
          <Stepper
            label="Tasa de servicio (μ)"
            unit="clientes/hora · servidor"
            value={mu}
            onChange={setMu}
            min={1}
            max={500}
            step={1}
            decimals
          />
          <Stepper
            label="Número de servidores (c)"
            value={servers}
            onChange={setServers}
            min={1}
            max={20}
            step={1}
          />
        </Card>

        {/* Visualización */}
        <Card className="mt-4">
          <QueueVisualizer servers={servers} result={result} />
        </Card>

        {/* Métricas */}
        <Text className="text-primary font-bold text-base mt-6 mb-3">Resultados</Text>
        <View className="flex-row" style={{ gap: 10 }}>
          <StatTile
            symbol="ρ"
            label="Utilización"
            value={result.stable ? `${(result.rho * 100).toFixed(0)}%` : '≥100%'}
            accent
          />
          <StatTile symbol="Pw" label="Prob. de esperar" value={fmt(result.probWait, 2)} />
        </View>
        <View className="flex-row mt-2.5" style={{ gap: 10 }}>
          <StatTile symbol="Lq" label="En cola (prom.)" value={fmt(result.lq, 2)} />
          <StatTile symbol="L" label="En el sistema" value={fmt(result.l, 2)} />
        </View>
        <View className="flex-row mt-2.5" style={{ gap: 10 }}>
          <StatTile symbol="Wq" label="Espera en cola" value={formatDuration(result.wq)} />
          <StatTile symbol="W" label="Tiempo total" value={formatDuration(result.w)} />
        </View>

        {/* Nota didáctica */}
        <Card className="mt-4">
          <Text className="text-muted text-xs leading-5">
            <Text className="font-bold text-primary">¿Cómo leerlo? </Text>
            ρ es la fracción de tiempo que los servidores están ocupados. Si ρ ≥ 1 la demanda supera
            la capacidad y la cola crece sin control. <Text className="font-bold text-primary">Lq/L </Text>
            son clientes promedio en cola / en el sistema, y <Text className="font-bold text-primary">Wq/W </Text>
            los tiempos de espera correspondientes (Ley de Little: L = λ·W).
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
