/// <reference types="nativewind/types" />

// NativeWind habilita `className` en tiempo de ejecución para los componentes
// de React Native. Declaramos aquí los tipos contra la copia de `react-native`
// que usa la app, para que TypeScript reconozca `className` sin errores.
import type {} from 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
    placeholderClassName?: string;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface SwitchProps {
    className?: string;
  }
}
