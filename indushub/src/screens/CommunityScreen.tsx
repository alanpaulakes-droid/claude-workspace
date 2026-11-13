import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Card } from '@/components/Card';
import { ThreadItem } from '@/components/ThreadItem';
import { threads } from '@/data/mock';

/** Comunidad & Foro. */
export function CommunityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center pt-3 mb-3">
          <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center mr-3">
            <Users size={20} color={colors.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-primary text-lg font-extrabold">Comunidad</Text>
            <Text className="text-muted text-xs">Preguntas y discusiones recientes</Text>
          </View>
        </View>

        <Card>
          {threads.map((t) => (
            <ThreadItem key={t.id} thread={t} />
          ))}
          {threads.map((t) => (
            <ThreadItem key={`${t.id}-b`} thread={{ ...t, id: `${t.id}-b` }} />
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
