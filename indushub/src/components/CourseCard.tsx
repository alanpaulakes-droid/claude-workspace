import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { Course } from '@/data/mock';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

/** Tarjeta de curso con ícono, progreso individual y CTA. */
export function CourseCard({ course, onPress }: CourseCardProps) {
  const Icon = course.icon;
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface rounded-2xl p-4 flex-1"
      style={{
        shadowColor: '#0F2B48',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 3,
      }}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View
          className="w-11 h-11 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${course.color}1A` }}
        >
          <Icon size={22} color={course.color} />
        </View>
        <ChevronRight size={18} color="#6B7A90" />
      </View>
      <Text className="text-primary font-semibold text-[13px] leading-4 mb-3" numberOfLines={2}>
        {course.name}
      </Text>
      <ProgressBar progress={course.progress} color={course.color} />
      <Text className="text-muted text-xs font-semibold mt-2">{course.progress}% completado</Text>
    </Pressable>
  );
}
