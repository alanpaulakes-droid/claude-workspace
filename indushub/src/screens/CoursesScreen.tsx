import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, FolderOpen, ClipboardList, GraduationCap } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { courses } from '@/data/mock';

const rows = [
  { icon: FolderOpen, label: 'Módulos' },
  { icon: ClipboardList, label: 'Asignaciones' },
  { icon: GraduationCap, label: 'Examen' },
];

/** Mis Cursos: lista con progreso y sub-secciones por curso. */
export function CoursesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-primary text-2xl font-extrabold pt-3">Mis Cursos</Text>
        <Text className="text-muted text-sm mb-2">Cursos principales</Text>

        {courses.map((course) => {
          const Icon = course.icon;
          return (
            <Card key={course.id} className="mt-4">
              <View className="flex-row items-center">
                <View
                  className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: `${course.color}1A` }}
                >
                  <Icon size={22} color={course.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-primary font-semibold" numberOfLines={1}>
                    {course.name}
                  </Text>
                  <Text className="text-muted text-xs">{course.progress}% completado</Text>
                </View>
              </View>
              <View className="mt-3">
                <ProgressBar progress={course.progress} color={course.color} />
              </View>
              <View className="mt-3">
                {rows.map((r, i) => {
                  const RowIcon = r.icon;
                  return (
                    <Pressable
                      key={r.label}
                      className={`flex-row items-center py-3 ${
                        i < rows.length - 1 ? 'border-b border-line' : ''
                      }`}
                    >
                      <RowIcon size={18} color={colors.muted} />
                      <Text className="text-primary text-sm ml-3 flex-1">{r.label}</Text>
                      <ChevronRight size={18} color={colors.muted} />
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
