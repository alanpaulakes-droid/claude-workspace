import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, BookOpenCheck, Clock } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { SectionHeader } from '@/components/SectionHeader';
import { CourseCard } from '@/components/CourseCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { ThreadItem } from '@/components/ThreadItem';
import { user, courses, quickActions, threads } from '@/data/mock';

/** Pantalla de Inicio de INDUSHUB. */
export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado / marca */}
        <View className="flex-row items-center justify-between pt-2">
          <View>
            <Text className="text-accent text-xl font-extrabold tracking-tight">INDUSHUB</Text>
            <Text className="text-muted text-[11px] font-semibold tracking-widest">
              INGENIERÍA INDUSTRIAL
            </Text>
          </View>
          <View className="flex-row items-center">
            <Pressable className="w-11 h-11 rounded-full bg-surface items-center justify-center mr-2 border border-line">
              <Bell size={20} color={colors.primary} />
              {user.notifications > 0 ? (
                <View className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">{user.notifications}</Text>
                </View>
              ) : null}
            </Pressable>
            <View className="w-11 h-11 rounded-full bg-primary items-center justify-center">
              <Text className="text-white font-bold">{user.name.charAt(0)}</Text>
            </View>
          </View>
        </View>

        {/* Saludo */}
        <Text className="text-primary text-2xl font-extrabold mt-4">
          ¡Hola, {user.name}! <Text>👋</Text>
        </Text>
        <Text className="text-muted text-sm mt-0.5">Bienvenido a tu portal de estudio.</Text>

        {/* Buscador */}
        <View className="flex-row items-center bg-surface rounded-2xl px-4 mt-4 border border-line h-12">
          <Search size={18} color={colors.muted} />
          <TextInput
            placeholder="Buscar cursos, conceptos, herramientas..."
            placeholderTextColor={colors.muted}
            className="flex-1 ml-2 text-primary"
          />
        </View>

        {/* Progreso general */}
        <Card className="mt-4 flex-row items-center">
          <ProgressRing progress={user.completion} size={92} strokeWidth={9} />
          <View className="flex-1 ml-4">
            <Text className="text-primary font-bold text-base mb-1">Mi Progreso General</Text>
            <View className="flex-row items-center mb-1">
              <BookOpenCheck size={15} color={colors.muted} />
              <Text className="text-muted text-sm ml-2">
                Cursos completados: {user.coursesDone}/{user.coursesTotal}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={15} color={colors.muted} />
              <Text className="text-muted text-sm ml-2">Horas de estudio: {user.studyHours}h</Text>
            </View>
          </View>
        </Card>

        {/* Cursos principales */}
        <SectionHeader title="Cursos Principales" actionLabel="Ver todos" />
        <View className="flex-row" style={{ gap: 12 }}>
          <CourseCard course={courses[0]} />
          <CourseCard course={courses[1]} />
        </View>
        <View className="flex-row mt-3" style={{ gap: 12 }}>
          <CourseCard course={courses[2]} />
          <CourseCard course={courses[3]} />
        </View>

        {/* Estudio rápido */}
        <SectionHeader title="Estudio Rápido" />
        <View className="flex-row" style={{ gap: 12 }}>
          {quickActions.map((a) => (
            <QuickActionCard key={a.id} label={a.label} icon={a.icon} />
          ))}
        </View>

        {/* Comunidad */}
        <SectionHeader title="Comunidad & Foro" actionLabel="Ir al foro" />
        <Card>
          {threads.map((t) => (
            <ThreadItem key={t.id} thread={t} />
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
