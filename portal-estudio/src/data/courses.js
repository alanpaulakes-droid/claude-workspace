/**
 * ============================================================================
 *  DATOS DEL PORTAL — edita este archivo para cargar tus propias materias.
 * ============================================================================
 *
 * Estructura:
 *
 *  curso  = { id, titulo, descripcion, color, emoji, temas: [tema, ...] }
 *  tema   = { id, titulo, resumen, contenido: [bloque, ...], quiz: [pregunta, ...] }
 *  curso.flashcards = [ { id, frente, reverso, tema? }, ... ]
 *
 *  bloque de contenido (apuntes):
 *    { tipo: 'h',    texto }                 -> subtítulo
 *    { tipo: 'p',    texto }                 -> párrafo
 *    { tipo: 'ul',   items: [..] }           -> lista con viñetas
 *    { tipo: 'ol',   items: [..] }           -> lista numerada
 *    { tipo: 'nota', texto }                 -> caja destacada / idea clave
 *    { tipo: 'code', texto }                 -> bloque monoespaciado
 *
 *  pregunta de quiz:
 *    { id, pregunta, opciones: [..], correcta: <índice>, explicacion }
 *
 * Los `id` deben ser únicos y estables (se usan para guardar el progreso).
 */

export const courses = [
  {
    id: 'metodo-estudio',
    titulo: 'Cómo estudiar mejor',
    descripcion: 'Técnicas de aprendizaje basadas en evidencia para entender y retener.',
    color: '#6366f1',
    emoji: '🧠',
    temas: [
      {
        id: 'recuerdo-activo',
        titulo: 'Recuerdo activo',
        resumen: 'Recuperar la información de memoria fija mejor que releer.',
        contenido: [
          { tipo: 'p', texto: 'El recuerdo activo (active recall) consiste en intentar traer a la memoria lo que estás aprendiendo, en lugar de volver a leerlo pasivamente. El esfuerzo de recuperar es justo lo que fortalece la huella de memoria.' },
          { tipo: 'h', texto: 'Por qué funciona' },
          { tipo: 'p', texto: 'Cada vez que recuperas un dato con esfuerzo, tu cerebro reconstruye y refuerza la conexión. Releer, en cambio, genera una falsa sensación de dominio: reconoces el texto pero no sabrías reproducirlo.' },
          { tipo: 'ul', items: [
            'Cierra los apuntes y explica el tema con tus palabras.',
            'Responde preguntas antes de mirar la solución.',
            'Convierte títulos y subtítulos en preguntas.',
          ] },
          { tipo: 'nota', texto: 'Idea clave: si no cuesta un poco, probablemente no estás aprendiendo mucho. La dificultad deseable es señal de que el recuerdo se está consolidando.' },
        ],
        quiz: [
          {
            id: 'q1',
            pregunta: '¿Qué caracteriza al recuerdo activo?',
            opciones: [
              'Subrayar y releer el material varias veces',
              'Intentar recuperar la información de memoria con esfuerzo',
              'Escuchar la clase de fondo mientras haces otra cosa',
              'Copiar los apuntes tal cual',
            ],
            correcta: 1,
            explicacion: 'El recuerdo activo se basa en recuperar con esfuerzo, no en re-exponerse pasivamente al material.',
          },
          {
            id: 'q2',
            pregunta: '¿Por qué releer da una "falsa sensación de dominio"?',
            opciones: [
              'Porque memorizas el índice del libro',
              'Porque reconoces el texto pero no sabrías reproducirlo sin verlo',
              'Porque cansa la vista',
              'Porque es demasiado lento',
            ],
            correcta: 1,
            explicacion: 'La familiaridad al reconocer un texto no equivale a poder recuperarlo tú solo.',
          },
        ],
      },
      {
        id: 'repaso-espaciado',
        titulo: 'Repaso espaciado',
        resumen: 'Distribuir el repaso en el tiempo vence la curva del olvido.',
        contenido: [
          { tipo: 'p', texto: 'El repaso espaciado consiste en repasar un tema en intervalos crecientes: al día siguiente, a los pocos días, a la semana, etc. Aprovecha que recordar algo justo cuando estabas por olvidarlo es lo que más consolida la memoria a largo plazo.' },
          { tipo: 'h', texto: 'La curva del olvido' },
          { tipo: 'p', texto: 'Sin repaso, olvidamos gran parte de lo aprendido en cuestión de días. Cada repaso "reinicia" la curva y hace que el olvido posterior sea más lento.' },
          { tipo: 'ol', items: [
            'Estudia el tema hoy.',
            'Repásalo mañana con recuerdo activo.',
            'Vuelve a los 3–4 días, luego a la semana, luego a las dos semanas.',
          ] },
          { tipo: 'nota', texto: 'Las flashcards de este portal usan un sistema de repaso espaciado: las tarjetas que fallas vuelven pronto y las que aciertas se espacian.' },
        ],
        quiz: [
          {
            id: 'q1',
            pregunta: 'El repaso espaciado propone repasar…',
            opciones: [
              'Todo el mismo día sin parar',
              'En intervalos crecientes a lo largo del tiempo',
              'Solo la noche antes del examen',
              'Únicamente lo que ya te sabes',
            ],
            correcta: 1,
            explicacion: 'Se reparte el repaso en intervalos que van creciendo para combatir la curva del olvido.',
          },
        ],
      },
    ],
    flashcards: [
      { id: 'f1', frente: '¿Qué es el recuerdo activo?', reverso: 'Recuperar información de memoria con esfuerzo en lugar de releer pasivamente.', tema: 'recuerdo-activo' },
      { id: 'f2', frente: '¿Qué combate el repaso espaciado?', reverso: 'La curva del olvido, al repasar en intervalos crecientes.', tema: 'repaso-espaciado' },
      { id: 'f3', frente: 'Dificultad deseable', reverso: 'Un nivel de esfuerzo que hace el aprendizaje más lento pero más duradero.', tema: 'recuerdo-activo' },
    ],
  },

  {
    id: 'fundamentos-programacion',
    titulo: 'Fundamentos de programación',
    descripcion: 'Conceptos base para empezar a programar en cualquier lenguaje.',
    color: '#10b981',
    emoji: '💻',
    temas: [
      {
        id: 'variables',
        titulo: 'Variables y tipos',
        resumen: 'Guardar datos con un nombre y conocer sus tipos básicos.',
        contenido: [
          { tipo: 'p', texto: 'Una variable es un nombre que apunta a un valor guardado en memoria. Te permite reutilizar y modificar datos sin repetirlos.' },
          { tipo: 'h', texto: 'Tipos básicos' },
          { tipo: 'ul', items: [
            'Número: 42, 3.14',
            'Texto (string): "hola"',
            'Booleano: verdadero / falso',
            'Nulo/indefinido: ausencia de valor',
          ] },
          { tipo: 'code', texto: 'let edad = 25\nlet nombre = "Ana"\nlet activo = true' },
          { tipo: 'nota', texto: 'Usa nombres descriptivos: `totalVentas` dice mucho más que `x`.' },
        ],
        quiz: [
          {
            id: 'q1',
            pregunta: '¿Qué es una variable?',
            opciones: [
              'Un tipo de bucle',
              'Un nombre que apunta a un valor en memoria',
              'Un error del programa',
              'Una función sin nombre',
            ],
            correcta: 1,
            explicacion: 'Una variable asocia un nombre a un valor almacenado, para leerlo o cambiarlo después.',
          },
          {
            id: 'q2',
            pregunta: '¿Cuál es un valor de tipo booleano?',
            opciones: ['"hola"', '42', 'true', '3.14'],
            correcta: 2,
            explicacion: 'Los booleanos solo pueden ser verdadero (true) o falso (false).',
          },
        ],
      },
      {
        id: 'condicionales',
        titulo: 'Condicionales',
        resumen: 'Tomar decisiones en el código con if / else.',
        contenido: [
          { tipo: 'p', texto: 'Los condicionales permiten que el programa ejecute distintas instrucciones según se cumpla o no una condición.' },
          { tipo: 'code', texto: 'if (edad >= 18) {\n  mostrar("Mayor de edad")\n} else {\n  mostrar("Menor de edad")\n}' },
          { tipo: 'p', texto: 'La condición se evalúa a verdadero o falso. Si es verdadera se ejecuta el primer bloque; si no, el bloque else.' },
        ],
        quiz: [
          {
            id: 'q1',
            pregunta: 'En un if/else, el bloque else se ejecuta cuando…',
            opciones: [
              'La condición es verdadera',
              'La condición es falsa',
              'Siempre, pase lo que pase',
              'Hay un error',
            ],
            correcta: 1,
            explicacion: 'El bloque else corre solo cuando la condición del if resulta falsa.',
          },
        ],
      },
    ],
    flashcards: [
      { id: 'f1', frente: 'Variable', reverso: 'Nombre que apunta a un valor guardado en memoria.', tema: 'variables' },
      { id: 'f2', frente: 'Booleano', reverso: 'Tipo de dato que solo puede ser verdadero o falso.', tema: 'variables' },
      { id: 'f3', frente: '¿Para qué sirve un condicional?', reverso: 'Ejecutar instrucciones distintas según se cumpla una condición.', tema: 'condicionales' },
    ],
  },
]

// Helpers de búsqueda -------------------------------------------------------

export function getCourse(courseId) {
  return courses.find((c) => c.id === courseId) || null
}

export function getTopic(courseId, topicId) {
  const course = getCourse(courseId)
  if (!course) return null
  return course.temas.find((t) => t.id === topicId) || null
}
