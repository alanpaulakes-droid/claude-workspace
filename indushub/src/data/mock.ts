// Datos de ejemplo para el MVP (se reemplazarán por API/estado real).
import type { LucideIcon } from 'lucide-react-native';
import {
  TrendingUp,
  ShieldCheck,
  Truck,
  Factory,
  Layers,
  FileText,
  BrainCircuit,
} from 'lucide-react-native';

export interface Course {
  id: string;
  name: string;
  progress: number; // 0–100
  icon: LucideIcon;
  color: string;
}

export const user = {
  name: 'Alejandro',
  completion: 75,
  coursesDone: 12,
  coursesTotal: 16,
  studyHours: 245,
  notifications: 4,
};

export const courses: Course[] = [
  { id: 'io', name: 'Investigación de Operaciones I', progress: 85, icon: TrendingUp, color: '#FF6B35' },
  { id: 'calidad', name: 'Gestión de Calidad', progress: 60, icon: ShieldCheck, color: '#1C4670' },
  { id: 'scm', name: 'Logística y SCM', progress: 45, icon: Truck, color: '#16A34A' },
  { id: 'sim', name: 'Simulación de Procesos', progress: 70, icon: Factory, color: '#8B5CF6' },
];

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const quickActions: QuickAction[] = [
  { id: 'flash', label: 'Flashcards', icon: Layers },
  { id: 'resumen', label: 'Resumen Semanal', icon: FileText },
  { id: 'quiz', label: 'Quizzes', icon: BrainCircuit },
];

export interface Thread {
  id: string;
  title: string;
  author: string;
  time: string;
  replies: number;
}

export const threads: Thread[] = [
  { id: 't1', title: '¿Cómo interpreto la utilización ρ en un sistema M/M/c?', author: 'María P.', time: '15 min', replies: 8 },
  { id: 't2', title: 'Diferencia entre EOQ y punto de reorden', author: 'Diego R.', time: '1 h', replies: 12 },
  { id: 't3', title: 'Recursos para gráficos de control (Calidad)', author: 'Sofía L.', time: '3 h', replies: 5 },
];
