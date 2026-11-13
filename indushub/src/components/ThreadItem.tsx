import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import type { Thread } from '@/data/mock';

interface ThreadItemProps {
  thread: Thread;
  onPress?: () => void;
}

/** Fila de discusión para la vista previa de Comunidad. */
export function ThreadItem({ thread, onPress }: ThreadItemProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3 border-b border-line">
      <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center mr-3">
        <MessageCircle size={18} color={colors.primary} />
      </View>
      <View className="flex-1 pr-2">
        <Text className="text-primary font-semibold text-[13px]" numberOfLines={1}>
          {thread.title}
        </Text>
        <Text className="text-muted text-xs mt-0.5">
          {thread.author} · hace {thread.time} · {thread.replies} respuestas
        </Text>
      </View>
    </Pressable>
  );
}
