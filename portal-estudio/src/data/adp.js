/**
 * Materia: ANÁLISIS DESCRIPTIVO DE PROCESOS (ATDF... aiin001)
 * Ingeniería Industrial.
 *
 * Contenido construido a partir del material oficial del ramo (apuntes por
 * sesión), ampliado y con sus figuras y diagramas reales extraídos de los PDF.
 * Las imágenes viven en /public/img/adp/<sesion>/ y se referencian de forma
 * relativa (img/adp/...).
 *
 * Se irá completando sesión por sesión.
 */

export const analisisDescriptivoProcesos = {
  id: 'analisis-descriptivo-procesos',
  titulo: 'Análisis Descriptivo de Procesos',
  descripcion: 'Gestión y modelamiento de procesos de negocio (BPM), calidad y análisis descriptivo con R.',
  color: '#0f766e',
  icon: 'BarChart3',
  temas: [
    // ===================== SESIÓN 1 =====================
    {
      id: 's01-introduccion',
      titulo: 'Introducción a la gestión de procesos',
      resumen: 'La empresa, la gestión empresarial, el sistema productivo y las herramientas de la calidad.',
      contenido: [
        { tipo: 'p', texto: 'Esta primera unidad sienta las bases del ramo: qué es una organización, cómo se planifica y gestiona, cómo funciona un sistema productivo y qué herramientas usamos para asegurar y mejorar la calidad de sus procesos. Todo esto es el punto de partida para, más adelante, descubrir, modelar, analizar y mejorar procesos de negocio.' },

        { tipo: 'h', texto: '1. La empresa' },
        { tipo: 'p', texto: 'Una organización es una estructura de funciones o puestos intencional y formalizada: consiste en identificar las actividades requeridas, agruparlas en áreas y puestos de trabajo, y jerarquizar tanto los puestos como las funciones. Ejemplos cotidianos de "procesos" organizacionales son solicitar un crédito hipotecario, comprar en una web o preparar un almuerzo.' },
        { tipo: 'h', texto: 'Planificación estratégica' },
        { tipo: 'p', texto: 'Sus etapas son: (1) análisis y diagnóstico de la situación (interno y externo, fortalezas y debilidades); (2) decisiones estratégicas (misión, visión, valores y objetivos); (3) decisiones operativas (plan de acción); y (4) elaboración del plan estratégico. Sus elementos se ordenan así:' },
        { tipo: 'img', src: 'img/adp/s01/fig01-planificacion.png', alt: 'Pirámide de elementos de la planificación estratégica', pie: 'Figura 1. Elementos de la planificación estratégica: visión, misión, valores, lineamientos, objetivos, servicios/productos, proyectos y líneas de acción.' },
        { tipo: 'ul', items: [
          'Visión: qué aspiramos ser en el mediano y largo plazo.',
          'Misión: propósito o razón de ser; qué nos caracteriza y nos diferencia.',
          'Valores: principios que inspiran la gestión y no cambian con el tiempo.',
          'Objetivos estratégicos: logros a alcanzar en plazos determinados, coherentes con la misión.',
          'Líneas e iniciativas estratégicas: cómo llegar a cumplir esos objetivos.',
        ] },

        { tipo: 'h', texto: 'Métricas e indicadores (KPI)' },
        { tipo: 'nota', texto: '"Lo que no se mide, no se puede mejorar" (Peter Drucker). Una métrica es una forma cuantitativa y periódica de evaluar el cumplimiento de un requerimiento; una meta es una declaración de mejoramiento de una métrica: proposición + métrica + benchmark + objetivo + plazo.' },
        { tipo: 'p', texto: 'Las métricas tienen cuatro dimensiones —tiempo, costo, capacidad y calidad— y distintos niveles (de satisfacción, del producto/servicio e internas del proceso). De las métricas surgen los indicadores: los PI (indicadores de rendimiento) miden el desempeño operacional, y los KPI (indicadores clave) están ligados directamente al cumplimiento de un objetivo estratégico. Un KPI puede componerse de varios PI.' },
        { tipo: 'img', src: 'img/adp/s01/fig04-kpi.png', alt: 'Analogía de la cebolla para KPIs y PIs', pie: 'Figura 4. Analogía de la cebolla: al "pelar capas" (PIs) nos acercamos al núcleo, donde están los objetivos estratégicos (KPIs).' },
        { tipo: 'p', texto: 'Las empresas se clasifican por tamaño (micro, pequeña, mediana, grande), sector (primario, secundario, terciario), propiedad del capital (privada, pública, mixta), destino de utilidades (con o sin fines de lucro) y forma jurídica. Sus estructuras pueden ser lineal, funcional o matricial, y suelen tener al menos cinco áreas funcionales: dirección, gestión de personas, producción, finanzas/contabilidad y marketing/ventas.' },

        { tipo: 'h', texto: '2. Gestión empresarial' },
        { tipo: 'p', texto: 'Gestión es la administración de los recursos de una organización para lograr sus objetivos. Sus técnicas incorporan el ciclo de vida de los procesos: documentación (descubrir y modelar), optimización (analizar y encontrar mejoras), implementación (aplicar el rediseño) y ejecución y control (poner en marcha y monitorear).' },
        { tipo: 'p', texto: 'Entre los modelos de gestión destacan el modelo de Dupont, el cuadro de mando y, sobre todo, el Cuadro de Mando Integral (Balanced Scorecard), con cuatro perspectivas: finanzas, clientes, procesos internos y formación/crecimiento.' },
        { tipo: 'img', src: 'img/adp/s01/fig05-dupont.png', alt: 'Modelo de Dupont: descomposición del ROI', pie: 'Figura 5. Modelo de Dupont: descompone el ROI en margen de utilidad y rotación de activos.' },
        { tipo: 'h', texto: 'El ciclo administrativo' },
        { tipo: 'p', texto: 'Conjunto de actividades que generan valor, en cuatro fases interrelacionadas: Planeación (definir metas y estrategia), Organización (diseñar la estructura y asignar tareas), Dirección (liderar, comunicar y motivar a las personas) y Control (verificar el avance con indicadores y corregir desviaciones).' },

        { tipo: 'h', texto: '3. El sistema productivo' },
        { tipo: 'p', texto: 'Un sistema productivo transforma insumos (entradas) en bienes o servicios (salidas) con valor agregado. Puede ser de producción continua (24x7), por órdenes de trabajo (según pedidos), modular (celdas independientes) o por proyectos (secuencia de tareas).' },
        { tipo: 'h', texto: 'Administración de la calidad' },
        { tipo: 'p', texto: 'El bucle de calidad representa la relación entre las actividades que influyen en la calidad de un producto/servicio, desde las necesidades del cliente hasta el resultado final.' },
        { tipo: 'img', src: 'img/adp/s01/fig08-bucle-calidad.png', alt: 'Bucle de calidad', pie: 'Figura 8. Bucle de calidad: necesidades del cliente → calidad en las compras → en el diseño → en la producción → las personas.' },
        { tipo: 'h', texto: 'Mejora continua: el ciclo de Deming (PDCA)' },
        { tipo: 'p', texto: 'El ciclo de Deming habilita la mejora continua en cuatro etapas: Planificar (objetivos y procesos), Hacer (implementar, si es posible a pequeña escala), Verificar (recopilar datos y comparar con lo esperado) y Actuar (documentar y decidir si se estandariza o se inicia un nuevo ciclo).' },
        { tipo: 'img', src: 'img/adp/s01/fig11-deming.png', alt: 'Ciclo de Deming PDCA', pie: 'Figura 11. Ciclo o círculo de Deming: Planificar, Hacer, Verificar, Actuar.' },

        { tipo: 'h', texto: '4. Herramientas genéricas de la calidad' },
        { tipo: 'p', texto: 'Para representar los procesos se usa la notación estándar BPMN 2.x, pensada para que cualquier persona de la organización entienda el proceso. Su simbología básica distingue objetos de flujo (eventos, actividades, decisiones), conexiones (flujos de secuencia y mensaje), artefactos y "carriles" (pool y lanes).' },
        { tipo: 'img', src: 'img/adp/s01/fig12-bpmn-simbologia.png', alt: 'Simbología básica de BPMN', pie: 'Figura 12. Simbología básica de BPMN: eventos, actividades, decisiones, flujos, artefactos y carriles.' },
        { tipo: 'img', src: 'img/adp/s01/fig13-bpmn-modelo.png', alt: 'Modelo de proceso en notación BPMN con carriles', pie: 'Figura 13. Ejemplo de modelo de proceso (orden de compra) bajo notación BPMN con pool y lanes.' },
        { tipo: 'p', texto: 'Otras herramientas clásicas de la calidad:' },
        { tipo: 'ul', items: [
          'Brainstorming (tormenta de ideas): saca a la luz el conocimiento de un grupo y genera ideas ante un problema.',
          'Análisis de Pareto: el 80% de los problemas proviene del 20% de las causas; prioriza las causas de mayor a menor.',
          'Diagrama de Ishikawa (causa-efecto): identifica las causas potenciales de un problema.',
          'Diagrama de dispersión: mide la intensidad de la relación entre dos variables numéricas.',
          'Histograma: gráfico de barras que agrupa datos numéricos en clases.',
        ] },
        { tipo: 'img', src: 'img/adp/s01/fig14-pareto.png', alt: 'Gráfica de Pareto', pie: 'Figura 14. Gráfica de Pareto: pocas causas (20%) explican la mayoría de los problemas (80%).' },
        { tipo: 'img', src: 'img/adp/s01/fig15-ishikawa.png', alt: 'Diagrama de Ishikawa causa-efecto', pie: 'Figura 15. Estructura del diagrama de Ishikawa (causa-efecto o "espina de pescado").' },
        { tipo: 'img', src: 'img/adp/s01/fig16-dispersion.png', alt: 'Tipos de relaciones en un diagrama de dispersión', pie: 'Figura 16. Diagrama de dispersión: relación fuerte creciente, fuerte decreciente, débil o inexistente.' },
        { tipo: 'img', src: 'img/adp/s01/fig17-histograma.png', alt: 'Ejemplo de histograma', pie: 'Figura 17. Ejemplo de histograma: frecuencia por clases.' },
      ],
      quiz: [
        {
          id: 'q1',
          pregunta: 'Según la planificación estratégica, ¿qué define el propósito o razón de ser de una organización?',
          opciones: ['La visión', 'La misión', 'Los valores', 'Los KPI'],
          correcta: 1,
          explicacion: 'La misión declara el propósito o razón de ser; la visión es lo que aspiramos ser a futuro.',
        },
        {
          id: 'q2',
          pregunta: 'Un KPI se diferencia de un PI (indicador de rendimiento) en que…',
          opciones: [
            'Se mide una vez al año',
            'Está ligado directamente al cumplimiento de un objetivo estratégico',
            'Solo mide costos',
            'No se puede cuantificar',
          ],
          correcta: 1,
          explicacion: 'El KPI (indicador clave) se relaciona directamente con un objetivo estratégico y puede componerse de varios PI.',
        },
        {
          id: 'q3',
          pregunta: '¿Cuáles son las cuatro fases del ciclo administrativo?',
          opciones: [
            'Planear, Organizar, Dirigir y Controlar',
            'Analizar, Diseñar, Construir y Probar',
            'Definir, Medir, Analizar y Mejorar',
            'Planificar, Hacer, Verificar y Actuar',
          ],
          correcta: 0,
          explicacion: 'El ciclo administrativo es Planeación, Organización, Dirección y Control. (PHVA es el ciclo de Deming, que es distinto.)',
        },
        {
          id: 'q4',
          pregunta: '¿Qué etapas componen el ciclo de Deming (PDCA)?',
          opciones: [
            'Planear, Organizar, Dirigir, Controlar',
            'Planificar, Hacer, Verificar, Actuar',
            'Descubrir, Modelar, Analizar, Mejorar',
            'Entrada, Proceso, Salida, Retroalimentación',
          ],
          correcta: 1,
          explicacion: 'PDCA: Planificar, Hacer, Verificar y Actuar; es la base de la mejora continua.',
        },
        {
          id: 'q5',
          pregunta: 'El principio del análisis de Pareto establece que…',
          opciones: [
            'El 50% de los problemas viene del 50% de las causas',
            'El 80% de los problemas se origina por el 20% de las causas',
            'Todas las causas pesan igual',
            'El 20% de los problemas viene del 80% de las causas',
          ],
          correcta: 1,
          explicacion: 'La regla 80/20: la mayoría de los problemas (80%) proviene de pocas causas (20%).',
        },
        {
          id: 'q6',
          pregunta: '¿Para qué sirve el diagrama de Ishikawa?',
          opciones: [
            'Medir la relación entre dos variables numéricas',
            'Identificar las causas potenciales de un problema',
            'Agrupar datos en clases de frecuencia',
            'Representar un proceso con carriles',
          ],
          correcta: 1,
          explicacion: 'El diagrama causa-efecto (Ishikawa) identifica y organiza las causas probables de un problema.',
        },
        {
          id: 'q7',
          pregunta: '¿Cuál es el objetivo principal de la notación BPMN?',
          opciones: [
            'Calcular la rentabilidad financiera',
            'Proporcionar una notación de procesos entendible por todos los usuarios de la organización',
            'Medir la satisfacción del cliente',
            'Clasificar los tipos de empresa',
          ],
          correcta: 1,
          explicacion: 'BPMN es un estándar de notación pensado para que cualquiera en la organización entienda el proceso.',
        },
        {
          id: 'q8',
          pregunta: 'Un sistema productivo se define como aquel que…',
          opciones: [
            'Solo vende productos terminados',
            'Transforma insumos (entradas) en bienes o servicios (salidas) con valor agregado',
            'Administra únicamente las finanzas',
            'Contrata al personal',
          ],
          correcta: 1,
          explicacion: 'Un sistema productivo transforma entradas en salidas con valor agregado mediante operaciones de transformación.',
        },
      ],
    },
  ],
  flashcards: [
    { id: 'f1', frente: 'Misión', reverso: 'Declaración que define el propósito o razón de ser de una organización.', tema: 's01-introduccion' },
    { id: 'f2', frente: 'Visión', reverso: 'Conjunto de características que la organización quiere alcanzar en el mediano y largo plazo.', tema: 's01-introduccion' },
    { id: 'f3', frente: 'Métrica', reverso: 'Forma cuantitativa y periódica de evaluar el cumplimiento de un requerimiento.', tema: 's01-introduccion' },
    { id: 'f4', frente: 'KPI', reverso: 'Indicador clave de rendimiento, ligado directamente al cumplimiento de un objetivo estratégico.', tema: 's01-introduccion' },
    { id: 'f5', frente: 'Ciclo administrativo', reverso: 'Planeación, Organización, Dirección y Control.', tema: 's01-introduccion' },
    { id: 'f6', frente: 'Ciclo de Deming (PDCA)', reverso: 'Planificar, Hacer, Verificar y Actuar: base de la mejora continua.', tema: 's01-introduccion' },
    { id: 'f7', frente: 'Principio de Pareto', reverso: 'El 80% de los problemas se origina por el 20% de las causas.', tema: 's01-introduccion' },
    { id: 'f8', frente: 'Diagrama de Ishikawa', reverso: 'Herramienta causa-efecto para identificar las causas potenciales de un problema.', tema: 's01-introduccion' },
    { id: 'f9', frente: 'BPMN', reverso: 'Estándar de notación de procesos, entendible por todos, con eventos, actividades, decisiones, flujos y carriles.', tema: 's01-introduccion' },
    { id: 'f10', frente: 'Sistema productivo', reverso: 'Conjunto que transforma insumos (entradas) en bienes o servicios (salidas) con valor agregado.', tema: 's01-introduccion' },
  ],
}
