import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Lock, Bell, Settings, ChevronRight, LogOut } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { user } from '@/data/mock';

const items = [
  { icon: User, label: 'Cuenta' },
  { icon: Lock, label: 'Privacidad' },
  { icon: Bell, label: 'Notificaciones' },
  { icon: Settings, label: 'Preferencias' },
];

/** Perfil / Ajustes. */
export function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-primary text-2xl font-extrabold pt-3 mb-4">Perfil</Text>

        <Card className="items-center py-6">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
            <Text className="text-white text-2xl font-extrabold">{user.name.charAt(0)}</Text>
          </View>
          <Text className="text-primary font-bold text-lg">{user.name}</Text>
          <Text className="text-muted text-sm mb-4">Estudiante · Ingeniería Industrial</Text>
          <View className="flex-row items-center">
            <ProgressRing progress={user.completion} size={64} strokeWidth={7} />
            <View className="ml-4">
              <Text className="text-primary font-bold">{user.completion}% del plan</Text>
              <Text className="text-muted text-xs">
                {user.coursesDone}/{user.coursesTotal} cursos · {user.studyHours}h
              </Text>
            </View>
          </View>
        </Card>

        <Card className="mt-4 py-1">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Pressable
                key={it.label}
                className={`flex-row items-center py-3.5 ${
                  i < items.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <Icon size={19} color={colors.primary} />
                <Text className="text-primary text-sm ml-3 flex-1">{it.label}</Text>
                <ChevronRight size={18} color={colors.muted} />
              </Pressable>
            );
          })}
        </Card>

        <Pressable className="flex-row items-center justify-center mt-6">
          <LogOut size={18} color={colors.danger} />
          <Text className="text-danger font-semibold ml-2">Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
