import {
  BookOpen, Brain, Wrench, Compass, Lightbulb, BarChart3, Calculator,
  FlaskConical, Code2, Palette, Globe2, Rocket, GraduationCap, PenTool,
  Atom, HeartPulse, Scale, Landmark, Languages, Music,
  // UI
  Search, Check, ChevronRight, ArrowRight, ArrowLeft, RotateCcw,
  Layers, Trophy, Target, Sparkles, Plus, Pencil, Trash2, X, Save,
} from 'lucide-react'

// Iconos disponibles para las materias (usados también por el editor).
export const COURSE_ICONS = {
  BookOpen, Brain, Wrench, Compass, Lightbulb, BarChart3, Calculator,
  FlaskConical, Code2, Palette, Globe2, Rocket, GraduationCap, PenTool,
  Atom, HeartPulse, Scale, Landmark, Languages, Music,
}

const UI_ICONS = {
  Search, Check, ChevronRight, ArrowRight, ArrowLeft, RotateCcw,
  Layers, Trophy, Target, Sparkles, Plus, Pencil, Trash2, X, Save,
}

const ALL = { ...COURSE_ICONS, ...UI_ICONS }

// <Icon name="Brain" size={22} />
export default function Icon({ name, size = 20, strokeWidth = 2, className, ...rest }) {
  const Cmp = ALL[name] || BookOpen
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} {...rest} />
}
