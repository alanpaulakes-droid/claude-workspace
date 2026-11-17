# INDUSHUB — MVP móvil (Expo + React Native + TypeScript)

App educativa de Ingeniería Industrial. Navegación por pestañas, dashboard,
cursos, comunidad, perfil y un **simulador de colas M/M/c** en la pestaña
Herramientas.

## Stack

- **Expo (React Native) SDK 51** + **TypeScript**
- **NativeWind 4** (TailwindCSS para RN)
- **React Navigation 6** (bottom tabs)
- **react-native-svg** (indicadores circulares y gráficos)
- **lucide-react-native** (iconografía)

## Requisitos

- Node 18 o 20 LTS (recomendado por Expo SDK 51)
- La app de **Expo Go** en tu teléfono, o un emulador Android/iOS

## Instalación y ejecución

```bash
cd indushub
npm install
npx expo start
```

Luego escanea el QR con **Expo Go** (Android/iOS) o pulsa `a` / `i` para abrir
en emulador.

> Nota: el proyecto fija versiones coherentes con Expo SDK 51 mediante el campo
> `overrides` de `package.json` (evita que dependencias con *peers* comodín
> arrastren React Native/Reanimated de una versión incompatible).

## Estructura

```
indushub/
├── App.tsx                     # Punto de entrada (providers + navegación)
├── global.css                  # Directivas de Tailwind (NativeWind)
├── tailwind.config.js          # Paleta e identidad INDUSHUB
├── babel.config.js             # Preset Expo + NativeWind + Reanimated
├── metro.config.js             # withNativeWind
├── nativewind-env.d.ts         # Tipado de `className` en RN
└── src/
    ├── navigation/
    │   └── RootNavigator.tsx    # Bottom tabs (5 pestañas)
    ├── screens/
    │   ├── HomeScreen.tsx       # Dashboard: progreso, cursos, estudio rápido, foro
    │   ├── CoursesScreen.tsx    # Mis cursos + módulos/asignaciones/examen
    │   ├── ToolsScreen.tsx      # Simulador de colas M/M/c
    │   ├── CommunityScreen.tsx  # Foro
    │   └── ProfileScreen.tsx    # Perfil / ajustes
    ├── components/              # Card, ProgressRing, CourseCard, Stepper, etc.
    ├── utils/
    │   └── queueing.ts          # Motor de cálculo M/M/c (Erlang C + Little)
    ├── theme/colors.ts          # Colores para SVG/navegación
    └── data/mock.ts             # Datos de ejemplo del MVP
```

## Paleta

| Rol | Color |
|-----|-------|
| Primario (Azul Industrial) | `#0F2B48` |
| Acento / CTA (Naranja) | `#FF6B35` |
| Fondo | `#F4F6F9` |
| Tarjetas | `#FFFFFF` |

## Simulador M/M/c

`src/utils/queueing.ts` implementa el modelo de colas con `c` servidores:

- **ρ** = λ / (c·μ) — utilización
- **P₀**, **Pw** (Erlang C) — probabilidad de sistema vacío / de esperar
- **Lq**, **L** — clientes promedio en cola / en el sistema
- **Wq**, **W** — tiempos de espera (Ley de Little: L = λ·W)

Maneja sistemas inestables (ρ ≥ 1) y casos límite. Verificado contra valores
de referencia (M/M/2 con λ=2, μ=1.5 → P₀=0.2, Lq≈1.07, L=2.4, W=1.2).

## Calidad

- `npx tsc --noEmit` → **0 errores** (modo estricto).
- `npx expo export` → **bundle generado sin errores** (2489 módulos).
