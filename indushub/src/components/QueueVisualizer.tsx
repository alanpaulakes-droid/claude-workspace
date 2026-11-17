import React from 'react';
import { Text, View } from 'react-native';
import { User, Server, AlertTriangle } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import type { MMcResult } from '@/utils/queueing';

interface QueueVisualizerProps {
  servers: number;
  result: MMcResult;
}

const MAX_QUEUE_DOTS = 12;

/**
 * Representación gráfica simple del sistema de colas:
 *  · fila de clientes en espera (≈ Lq)
 *  · banco de servidores (ocupados vs. libres, según la utilización)
 *  · aviso de cuello de botella cuando ρ es alto o el sistema es inestable.
 */
export function QueueVisualizer({ servers, result }: QueueVisualizerProps) {
  const unstable = !result.stable;
  const queueLen = unstable ? MAX_QUEUE_DOTS : Math.round(result.lq);
  const dots = Math.min(queueLen, MAX_QUEUE_DOTS);
  const overflow = queueLen - dots;

  // Servidores ocupados en promedio (redondeado para el gráfico).
  const busy = unstable ? servers : Math.min(servers, Math.round(result.busyServers));

  const bottleneck = unstable || result.rho >= 0.85;
  const barColor = unstable
    ? colors.danger
    : result.rho >= 0.85
    ? colors.warning
    : colors.success;

  return (
    <View>
      {/* Utilización */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-primary font-semibold text-sm">Utilización del sistema (ρ)</Text>
        <Text className="font-extrabold" style={{ color: barColor }}>
          {unstable ? '≥ 100%' : `${Math.round(result.rho * 100)}%`}
        </Text>
      </View>
      <View className="w-full h-3 rounded-full bg-line overflow-hidden mb-4">
        <View
          style={{
            width: `${Math.min(100, result.rho * 100)}%`,
            backgroundColor: barColor,
          }}
          className="h-3 rounded-full"
        />
      </View>

      {/* Diagrama: cola → servidores */}
      <View className="flex-row items-center">
        {/* Cola */}
        <View className="flex-1">
          <Text className="text-muted text-[11px] font-semibold mb-1">EN COLA</Text>
          <View className="flex-row flex-wrap" style={{ minHeight: 40 }}>
            {dots === 0 ? (
              <Text className="text-muted text-xs italic">sin espera</Text>
            ) : (
              Array.from({ length: dots }).map((_, i) => (
                <View key={i} className="mr-1 mb-1">
                  <User size={18} color={colors.accent} />
                </View>
              ))
            )}
            {overflow > 0 ? (
              <Text className="text-accent font-bold text-xs self-center ml-1">+{overflow}</Text>
            ) : null}
          </View>
        </View>

        {/* Flecha */}
        <Text className="text-muted mx-2 text-lg">→</Text>

        {/* Servidores */}
        <View>
          <Text className="text-muted text-[11px] font-semibold mb-1 text-right">SERVIDORES</Text>
          <View className="flex-row">
            {Array.from({ length: servers }).map((_, i) => {
              const isBusy = i < busy;
              return (
                <View
                  key={i}
                  className="w-9 h-9 rounded-lg items-center justify-center ml-1"
                  style={{ backgroundColor: isBusy ? colors.primary : colors.line }}
                >
                  <Server size={16} color={isBusy ? colors.white : colors.muted} />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Cuello de botella */}
      {bottleneck ? (
        <View
          className="flex-row items-center mt-4 rounded-xl p-3"
          style={{ backgroundColor: `${unstable ? colors.danger : colors.warning}1A` }}
        >
          <AlertTriangle size={18} color={unstable ? colors.danger : colors.warning} />
          <Text
            className="ml-2 text-xs font-semibold flex-1"
            style={{ color: unstable ? colors.danger : colors.warning }}
          >
            {unstable
              ? 'Sistema inestable: la demanda supera la capacidad (ρ ≥ 1). La cola crece sin límite. Agrega servidores o acelera el servicio.'
              : 'Cuello de botella: utilización alta. El sistema es sensible a picos de demanda.'}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
