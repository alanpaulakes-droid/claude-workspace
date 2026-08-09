import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookOpen, Wrench, MessageCircle, User } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { HomeScreen } from '@/screens/HomeScreen';
import { CoursesScreen } from '@/screens/CoursesScreen';
import { ToolsScreen } from '@/screens/ToolsScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

export type RootTabParamList = {
  Inicio: undefined;
  Cursos: undefined;
  Herramientas: undefined;
  Comunidad: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background },
};

/** Navegación principal: barra inferior de 5 pestañas. */
export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.line,
            height: Platform.OS === 'ios' ? 84 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ color, size }) => {
            const s = size ?? 22;
            switch (route.name) {
              case 'Inicio':
                return <Home size={s} color={color} />;
              case 'Cursos':
                return <BookOpen size={s} color={color} />;
              case 'Herramientas':
                return <Wrench size={s} color={color} />;
              case 'Comunidad':
                return <MessageCircle size={s} color={color} />;
              case 'Perfil':
                return <User size={s} color={color} />;
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Cursos" component={CoursesScreen} />
        <Tab.Screen name="Herramientas" component={ToolsScreen} />
        <Tab.Screen name="Comunidad" component={CommunityScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
