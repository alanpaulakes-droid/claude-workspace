# Portal de Estudio

Portal de estudio **genérico y reutilizable** hecho con **React + Vite**. Pensado para
aprender cualquier materia con temario estructurado, apuntes, quizzes, flashcards de
repaso espaciado y seguimiento de progreso.

## Funciones

- **Panel de inicio** con todas las materias y progreso global.
- **Temario estructurado** por materia y tema.
- **Apuntes** con párrafos, listas, ideas clave y bloques de código.
- **Quizzes** de opción múltiple con corrección, explicaciones y puntaje.
- **Flashcards** con repaso espaciado (sistema Leitner).
- **Progreso** guardado en el dispositivo (localStorage). Sin cuentas ni servidor.
- **Responsive** y accesible (móvil y escritorio).

## Desarrollo

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # compilar a /dist
npm run preview # previsualizar el build
```

## Cómo añadir tus propias materias

Edita `src/data/courses.js`. Cada materia tiene esta forma:

```js
{
  id: 'mi-materia',            // único y estable (se usa para el progreso)
  titulo: 'Mi materia',
  descripcion: 'Descripción breve.',
  color: '#6366f1',           // color de acento
  emoji: '📘',
  temas: [
    {
      id: 'tema-1',
      titulo: 'Título del tema',
      resumen: 'Resumen de una línea.',
      contenido: [
        { tipo: 'p', texto: 'Un párrafo.' },
        { tipo: 'h', texto: 'Un subtítulo' },
        { tipo: 'ul', items: ['punto 1', 'punto 2'] },
        { tipo: 'nota', texto: 'Idea clave destacada.' },
        { tipo: 'code', texto: 'let x = 1' },
      ],
      quiz: [
        {
          id: 'q1',
          pregunta: '¿...?',
          opciones: ['A', 'B', 'C', 'D'],
          correcta: 1,           // índice de la opción correcta
          explicacion: 'Por qué es la B.',
        },
      ],
    },
  ],
  flashcards: [
    { id: 'f1', frente: 'Concepto', reverso: 'Definición', tema: 'tema-1' },
  ],
}
```

## Estructura

```
src/
  data/courses.js        Contenido de las materias (edítalo)
  context/               Estado global de progreso (localStorage)
  lib/                   Utilidades: almacenamiento y repaso espaciado
  components/            Componentes reutilizables (tarjetas, barra, navbar)
  pages/                 Pantallas: inicio, curso, lección, quiz, flashcards
  styles/global.css      Estilos (tema oscuro, responsive)
```
