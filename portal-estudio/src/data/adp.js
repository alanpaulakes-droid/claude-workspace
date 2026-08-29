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

    // ===================== SESIÓN 2 =====================
    {
      id: 's02-ciclo-vida',
      titulo: 'Ciclo de vida de los procesos',
      resumen: 'Qué es un proceso de negocio, sus categorías y jerarquía, el mapa de procesos y su ciclo de vida.',
      contenido: [
        { tipo: 'p', texto: 'Esta sesión conecta las directrices estratégicas con lo operacional: qué es un proceso de negocio, cómo se clasifican, cómo se ordenan jerárquicamente, cómo se representan en un mapa de procesos y qué etapas componen su ciclo de vida.' },

        { tipo: 'h', texto: '¿Qué es un proceso de negocio?' },
        { tipo: 'p', texto: 'Es un conjunto de actividades interrelacionadas y realizadas en una secuencia específica para producir un producto o servicio de características definidas. Utiliza insumos que agregan valor para satisfacer al usuario, y suele involucrar distintas áreas y perfiles trabajando de forma colaborativa. Ejemplos: solicitar un crédito, comprar en una web o preparar un almuerzo.' },
        { tipo: 'p', texto: 'Todo proceso se describe con cuatro elementos: entradas, salidas, secuencia de actividades y sistema de control.' },
        { tipo: 'img', src: 'img/adp/s02/fig01-elementos.png', alt: 'Elementos de un proceso: entradas, salidas, secuencia y control', pie: 'Figura 1. Elementos de un proceso: entradas, salidas, secuencia de actividades y sistema de control.' },

        { tipo: 'h', texto: 'Categorías de los procesos de negocio' },
        { tipo: 'ul', items: [
          'Estratégicos: miden, monitorean y coordinan; buscan eficiencia y eficacia; no entregan valor directo al usuario (ej. planificación estratégica).',
          'Operativos: ligados al giro y a la cadena de valor; generan y entregan el valor al usuario (ej. atención comercial, elaboración del producto).',
          'De apoyo: dan soporte a los operativos y son necesarios para el servicio, pero no generan valor directo (ej. mesa de ayuda, contabilidad, mantención).',
          'De seguimiento y evaluación: continuos y periódicos; evalúan el cumplimiento de la operación (ej. monitoreo de niveles de servicio, indicadores).',
        ] },

        { tipo: 'h', texto: 'Jerarquía de procesos' },
        { tipo: 'p', texto: 'Los procesos se ordenan en niveles, de lo más general a lo más concreto: macroprocesos → procesos → subprocesos → actividades → tareas.' },
        { tipo: 'img', src: 'img/adp/s02/fig02-jerarquia.png', alt: 'Pirámide de niveles de la jerarquía de procesos', pie: 'Figura 2. Niveles de la jerarquía de procesos.' },
        { tipo: 'img', src: 'img/adp/s02/fig03-jerarquia-compras.png', alt: 'Ejemplo de jerarquía en un proceso de compras', pie: 'Figura 3. Ejemplo de jerarquía aplicado a la gestión de compras.' },

        { tipo: 'h', texto: 'Mapa de procesos' },
        { tipo: 'p', texto: 'Es la representación gráfica de la organización clasificada según su misión y visión; describe cómo funciona la empresa, desde la necesidad del cliente hasta su satisfacción, agrupando los procesos estratégicos, operativos, de apoyo y de evaluación.' },
        { tipo: 'img', src: 'img/adp/s02/fig04-mapa-procesos.png', alt: 'Estructura general de un mapa de procesos', pie: 'Figura 4. Estructura general de un mapa de procesos.' },
        { tipo: 'p', texto: 'Ventajas: potencia a toda la organización (identifica brechas), aumenta la visibilidad y el control, favorece el cumplimiento y alineamiento con la estrategia, y mejora la comunicación entre áreas.' },

        { tipo: 'h', texto: 'Ciclo de vida de los procesos' },
        { tipo: 'p', texto: 'La gestión de procesos cumple un ciclo continuo de cinco etapas:' },
        { tipo: 'ul', items: [
          'Modelar: generar los modelos en notación BPMN y el mapa de procesos.',
          'Simular: analizar brechas, cuellos de botella, uso de recursos y costos para validar el diseño.',
          'Implementar: llevar el proceso a la práctica con tecnologías, reglas de negocio y servicios web.',
          'Monitorear: seguir el comportamiento con KPIs sobre datos reales.',
          'Optimizar: reducir o eliminar falencias y materializar la mejora continua.',
        ] },
        { tipo: 'img', src: 'img/adp/s02/fig05-ciclo-vida.png', alt: 'Ciclo de vida de los procesos', pie: 'Figura 5. Ciclo de vida de los procesos: modelar, simular, implementar, monitorear y optimizar.' },

        { tipo: 'h', texto: 'Diseño e introducción a la mejora de procesos' },
        { tipo: 'p', texto: 'La mejora se apoya en el ciclo PDCA (Planificar, Hacer, Verificar, Actuar) y en un conjunto de herramientas: tormenta de ideas (brainstorming), diagrama de Pareto (80/20), diagrama de causa-efecto (Ishikawa), los 5 porqués y los modelos de referencia (buenas prácticas para comparar y estandarizar).' },
        { tipo: 'nota', texto: 'Los 5 porqués: preguntar "¿por qué?" sucesivamente (unas cinco veces) para explorar las relaciones causa-efecto y llegar a la causa raíz de un problema.' },
        { tipo: 'img', src: 'img/adp/s02/fig06-infografia-mejora.png', alt: 'Infografía: diseño e introducción a la mejora de procesos', pie: 'Figura 6. Infografía: el ciclo PDCA y las herramientas para la mejora de procesos.' },
      ],
      quiz: [
        {
          id: 'q1',
          pregunta: '¿Cuáles son los cuatro elementos que describen un proceso?',
          opciones: [
            'Misión, visión, valores y objetivos',
            'Entradas, salidas, secuencia de actividades y sistema de control',
            'Planear, hacer, verificar y actuar',
            'Personas, máquinas, métodos y materiales',
          ],
          correcta: 1,
          explicacion: 'Un proceso se describe por sus entradas, salidas, secuencia de actividades y sistema de control.',
        },
        {
          id: 'q2',
          pregunta: '¿Qué caracteriza a los procesos operativos?',
          opciones: [
            'No entregan valor directo al usuario',
            'Están ligados al giro y a la cadena de valor, generando el valor al usuario',
            'Solo dan soporte a otros procesos',
            'Se limitan a monitorear indicadores',
          ],
          correcta: 1,
          explicacion: 'Los procesos operativos se relacionan con la cadena de valor y entregan el producto o servicio al usuario.',
        },
        {
          id: 'q3',
          pregunta: 'Ordena la jerarquía de procesos de mayor a menor nivel:',
          opciones: [
            'Tareas → actividades → subprocesos → procesos → macroprocesos',
            'Macroprocesos → procesos → subprocesos → actividades → tareas',
            'Procesos → macroprocesos → tareas → actividades → subprocesos',
            'Actividades → tareas → procesos → subprocesos → macroprocesos',
          ],
          correcta: 1,
          explicacion: 'De lo más general a lo más concreto: macroprocesos, procesos, subprocesos, actividades y tareas.',
        },
        {
          id: 'q4',
          pregunta: '¿Qué es un mapa de procesos?',
          opciones: [
            'Un organigrama de cargos',
            'La representación gráfica de la organización según su misión y visión, mostrando sus procesos',
            'Un cronograma de tareas',
            'Un estado financiero',
          ],
          correcta: 1,
          explicacion: 'El mapa de procesos representa gráficamente cómo funciona la empresa, agrupando sus procesos desde la necesidad hasta la satisfacción del cliente.',
        },
        {
          id: 'q5',
          pregunta: '¿Cuál es el orden correcto del ciclo de vida de los procesos?',
          opciones: [
            'Implementar → modelar → optimizar → simular → monitorear',
            'Modelar → simular → implementar → monitorear → optimizar',
            'Simular → modelar → monitorear → implementar → optimizar',
            'Monitorear → optimizar → modelar → simular → implementar',
          ],
          correcta: 1,
          explicacion: 'El ciclo es: modelar, simular, implementar, monitorear y optimizar.',
        },
        {
          id: 'q6',
          pregunta: 'La técnica de "los 5 porqués" sirve para…',
          opciones: [
            'Priorizar causas con la regla 80/20',
            'Llegar a la causa raíz preguntando "¿por qué?" sucesivamente',
            'Representar el proceso con carriles',
            'Medir la satisfacción del cliente',
          ],
          correcta: 1,
          explicacion: 'Los 5 porqués exploran la relación causa-efecto preguntando "¿por qué?" varias veces hasta la causa raíz.',
        },
      ],
    },

    // ===================== SESIÓN 3 =====================
    {
      id: 's03-bpm-diseno',
      titulo: 'BPM, diseño y análisis de procesos',
      resumen: 'La disciplina BPM, el diseño y la mejora de procesos, y el análisis y diagnóstico.',
      contenido: [
        { tipo: 'p', texto: 'Esta sesión introduce el BPM (Business Process Management) como disciplina de gestión, el diseño y la mejora continua de los procesos, y las etapas del análisis y diagnóstico, además de los conceptos clave del área.' },

        { tipo: 'h', texto: '¿Qué es el BPM?' },
        { tipo: 'p', texto: 'BPM (Business Process Management, "gestión de procesos de negocio") es una disciplina de gestión compuesta de metodologías, herramientas y tecnologías que busca mejorar los procesos de negocio y administrar todos los recursos de la organización para alcanzar sus objetivos. Bajo este enfoque, la organización se concibe como un universo de procesos interrelacionados, rompiendo con la visión tradicional basada solo en áreas funcionales y departamentos.' },
        { tipo: 'p', texto: 'El BPM articula tres dimensiones (negocio, procesos y gestión):' },
        { tipo: 'ul', items: [
          'Negocio: grupo de personas, recursos, sistemas y actividades con un fin común; posee una propuesta de valor, se relaciona con clientes y un entorno, y declara su estrategia.',
          'Procesos: conjuntos de actividades en secuencia lógica, con inicio y fin, que articulan recursos y producen un servicio o producto.',
          'Gestión: acción de administrar los recursos para alcanzar un propósito, alineando todo a la estrategia.',
        ] },

        { tipo: 'h', texto: 'Objetivos del BPM' },
        { tipo: 'p', texto: 'Busca la mejora continua a través de procesos alineados con la estrategia. Como la estrategia y los procesos son dinámicos, exige agilidad para responder al entorno (usuarios, leyes, normativas). Debe promover excelencia, eficacia, eficiencia, alineación estratégica, integración, agilidad, escalabilidad y sustentabilidad.' },

        { tipo: 'h', texto: '¿Por qué implementar BPM?' },
        { tipo: 'p', texto: 'Porque permite operar de manera conjunta sobre tres pilares —los procesos, las personas y la tecnología de la información— alineados por la estrategia. Su correcta implementación hace que cada persona comprenda lo que hace y cómo aporta valor.' },
        { tipo: 'img', src: 'img/adp/s03/fig03-bpm-triangulo.png', alt: 'Triángulo del BPM: procesos, personas y tecnología alrededor de la estrategia', pie: 'Figura 1. El BPM opera sobre procesos, personas y tecnología, articulados por la estrategia.' },

        { tipo: 'h', texto: 'Diseño de procesos' },
        { tipo: 'p', texto: 'El diseño de procesos es el acto de transformar la visión, los objetivos y los recursos de la organización en un medio comprensible y medible para lograr sus metas. Se apoya en el análisis de procesos, en buenas prácticas de organizaciones similares y en modelos de referencia.' },
        { tipo: 'p', texto: 'Para especificar un diseño de proceso hay que definir: metas y objetivos, métricas e indicadores (KPI), reglas de negocio, el modelo en notación BPMN, plataformas y tecnologías, fuentes de datos, controles operativos y financieros, e integración con otros procesos.' },

        { tipo: 'h', texto: 'Mejora continua de los procesos' },
        { tipo: 'p', texto: 'La mejora busca descubrir los problemas más relevantes y resolverlos, permitiendo: eliminar errores o duplicidades, minimizar tiempos y demoras, eliminar cuellos de botella, maximizar el uso de activos, optimizar recursos, promover el entendimiento y generar ventajas competitivas. El ciclo de Deming (PDCA) y las herramientas de calidad (brainstorming, Pareto, Ishikawa, 5 porqués, modelos de referencia) son sus instrumentos.' },
        { tipo: 'h', texto: 'Modelos de referencia' },
        { tipo: 'p', texto: 'Un modelo de referencia es un marco para estructurar y descomponer los procesos, que permite compararse con estándares e incorporar buenas prácticas. Un ejemplo es el Process Classification Framework (PCF), que ordena los procesos en operativos (1–5) y de administración/soporte (6–12).' },
        { tipo: 'img', src: 'img/adp/s03/fig02-pcf.png', alt: 'Modelo de referencia de procesos PCF', pie: 'Figura 2. Ejemplo de modelo de referencia (PCF): procesos de operación y de administración y soporte.' },

        { tipo: 'h', texto: 'Análisis y diagnóstico de procesos' },
        { tipo: 'p', texto: 'El análisis y diagnóstico sirve para conocer en detalle cada proceso: su motivación (el "para qué"), qué se realiza (el "qué"), quiénes participan (el "quién"), cómo se desarrolla (el "cómo") y cuándo ocurren las tareas (el "cuándo"). Se recomienda ir de lo general a lo específico para definir bien el alcance.' },
        { tipo: 'p', texto: 'Las etapas para especificar y analizar los procesos son: levantamiento, documentación y caracterización, validación, análisis y diagnóstico. Para identificar las actividades críticas se siguen cinco pasos: (1) nombrar y describir el proceso, (2) determinar responsables y actores, (3) establecer el objetivo o finalidad, (4) identificar y diagramar las actividades (BPMN) y (5) determinar los factores/procesos críticos.' },
        { tipo: 'img', src: 'img/adp/s03/fig01-analisis-diagnostico.png', alt: 'Infografía de definiciones y alcances del análisis y diagnóstico', pie: 'Figura 3. Definiciones y alcances del análisis y diagnóstico, y los pasos para identificar actividades críticas.' },

        { tipo: 'h', texto: 'Conceptos clave del diseño de procesos' },
        { tipo: 'ul', items: [
          'Cadena de valor: actividades principales con impacto directo en la estrategia y en la entrega del producto/servicio.',
          'Propuesta de valor: atributos por los que el cliente valora un producto o servicio.',
          'Levantamiento de procesos: obtener la información de cómo operan hoy los procesos y tareas.',
          'Diagnóstico de procesos: detectar los focos de error para formular una propuesta de mejora.',
          'Actividades críticas: aquellas cuyos resultados impactan directamente el objetivo de la organización.',
          'Reglas de negocio: atienden una necesidad del negocio; controlan o influyen en su comportamiento.',
          'Análisis de distribución / de tiempos / calidad y costos: variables de eficiencia (frecuencias, operaciones por unidad de tiempo, costo de la mala calidad).',
        ] },
        { tipo: 'nota', texto: 'BPMN es el acrónimo de Business Process Model and Notation: el lenguaje estándar de modelado de procesos.' },
      ],
      quiz: [
        {
          id: 'q1',
          pregunta: '¿Qué significa BPM?',
          opciones: [
            'Business Process Metrics',
            'Business Process Management (gestión de procesos de negocio)',
            'Best Practice Model',
            'Business Plan Manager',
          ],
          correcta: 1,
          explicacion: 'BPM es Business Process Management: la disciplina de gestión de procesos de negocio.',
        },
        {
          id: 'q2',
          pregunta: 'Bajo el enfoque BPM, la organización se concibe como…',
          opciones: [
            'Un conjunto de áreas funcionales independientes',
            'Un universo de procesos interrelacionados',
            'Una jerarquía de cargos',
            'Un balance financiero',
          ],
          correcta: 1,
          explicacion: 'El BPM ve la organización como un sistema de procesos interrelacionados, rompiendo con la visión por departamentos aislados.',
        },
        {
          id: 'q3',
          pregunta: 'BPM permite operar de manera conjunta sobre tres pilares. ¿Cuáles?',
          opciones: [
            'Finanzas, marketing y ventas',
            'Procesos, personas y tecnología de la información',
            'Misión, visión y valores',
            'Entradas, salidas y control',
          ],
          correcta: 1,
          explicacion: 'El BPM articula procesos, personas y tecnología, alineados por la estrategia.',
        },
        {
          id: 'q4',
          pregunta: 'El diseño de procesos consiste en…',
          opciones: [
            'Contratar personal',
            'Transformar la visión, objetivos y recursos en un medio comprensible y medible para lograr las metas',
            'Calcular los impuestos',
            'Solo dibujar un organigrama',
          ],
          correcta: 1,
          explicacion: 'Diseñar un proceso es trasladar visión, objetivos y recursos a algo comprensible y medible que permita concretarlos.',
        },
        {
          id: 'q5',
          pregunta: '¿Cuáles son las etapas del análisis y diagnóstico de procesos?',
          opciones: [
            'Planear, hacer, verificar y actuar',
            'Levantamiento, documentación y caracterización, validación, análisis y diagnóstico',
            'Modelar, simular, implementar y monitorear',
            'Entradas, salidas, secuencia y control',
          ],
          correcta: 1,
          explicacion: 'Son: levantamiento, documentación y caracterización, validación, y análisis y diagnóstico.',
        },
        {
          id: 'q6',
          pregunta: 'El análisis de un proceso busca responder varias preguntas. ¿Cuál NO es una de ellas?',
          opciones: [
            'El "para qué" (motivación)',
            'El "quién" (participantes)',
            'El "cuánto cuesta la acción de la competencia"',
            'El "cómo" (forma en que se desarrolla)',
          ],
          correcta: 2,
          explicacion: 'El análisis indaga el para qué, qué, quién, cómo y cuándo del propio proceso; no el costo de la competencia.',
        },
        {
          id: 'q7',
          pregunta: 'Un modelo de referencia como el PCF sirve para…',
          opciones: [
            'Medir la satisfacción del cliente',
            'Estructurar y comparar los procesos con un estándar de buenas prácticas',
            'Registrar la contabilidad',
            'Reemplazar la estrategia',
          ],
          correcta: 1,
          explicacion: 'Los modelos de referencia (p. ej. PCF) ofrecen un marco para estructurar procesos y compararse con estándares.',
        },
      ],
    },

    // ===================== SESIÓN 4 =====================
    {
      id: 's04-modelamiento',
      titulo: 'Modelamiento de procesos e información estadística',
      resumen: 'Notación BPMN, fuentes de información, data warehouse y presentación de datos.',
      contenido: [
        { tipo: 'p', texto: 'Esta sesión aborda cómo modelar procesos con BPMN y cómo obtener, almacenar y presentar la información estadística que alimenta ese análisis.' },

        { tipo: 'h', texto: 'Modelamiento de procesos' },
        { tipo: 'p', texto: 'Para representar gráficamente los procesos se usa la notación estándar BPMN 2.x, entendible por toda la organización. La caracterización de un proceso sigue estos pasos: nombrar y describir el proceso; determinar responsables y actores; establecer el objetivo; identificar y diagramar las actividades (BPMN); determinar los factores críticos; detallar la lógica de negocio (nodos de decisión) y definir la visión del destinatario.' },
        { tipo: 'img', src: 'img/adp/s04/fig01-bpmn-simbologia.png', alt: 'Resumen de elementos BPMN', pie: 'Figura 1. Resumen de elementos BPMN: objetos de flujo, conexión, artefactos y carriles.' },

        { tipo: 'h', texto: 'Uso de fuentes de información estadística' },
        { tipo: 'p', texto: 'Una fuente de información es un recurso que satisface una necesidad informativa. Se clasifican en tres tipos:' },
        { tipo: 'ul', items: [
          'Primarias: información nueva y original, directa de la fuente (documentos originales, entrevistas, cartas, discursos, apuntes de investigación). Sus datos se obtienen por observación, experimentación, simulación o entrevista.',
          'Secundarias: documentos derivados de fuentes primarias (libros, informes, tesis, revistas, bases de datos, periódicos). Se obtienen por revisión bibliográfica y recopilación.',
          'Terciarias: recursos que resumen y remiten a las secundarias (bibliografías, índices, catálogos, guías). Se obtienen por búsqueda en internet.',
        ] },
        { tipo: 'nota', texto: 'Una fuente es confiable si la aporta un experto o institución reconocida, y se sabe de dónde viene, qué dice y por qué. Verifica siempre su actualidad (fecha) y objetividad (sin juicios de valor).' },

        { tipo: 'h', texto: 'Data warehouse (DW)' },
        { tipo: 'p', texto: 'Un data warehouse es una arquitectura de almacenamiento diseñada para respaldar datos extraídos de sistemas transaccionales y fuentes externas, combinándolos de forma resumida para facilitar el análisis. Es una pieza central del Business Intelligence (BI): concentra la información con un diseño definido por los stakeholders para explotarla.' },
        { tipo: 'p', texto: 'El DW se compone de fragmentos llamados datamarts, con modelos de almacenamiento estrella o snowflake, que permiten reportería, cubos OLAP, dashboards, minería de datos y más. La herramienta ETL (Extract, Transform, Load) extrae los datos de las fuentes, los transforma al modelo y los carga en el DW.' },
        { tipo: 'img', src: 'img/adp/s04/fig05-dw-arquitectura.png', alt: 'Arquitectura general de un data warehouse', pie: 'Figura 2. Arquitectura general de un data warehouse: de los datos al conocimiento (orígenes → DW → acceso) vía ETL.' },
        { tipo: 'p', texto: 'Funcionalidades del DW: orientado a objetos (atiende distintas áreas), integrado (unifica fuentes), no volátil (la información no varía), variante en el tiempo (guarda histórico para trazabilidad) y orientado a la toma de decisiones. A diferencia de una base de datos transaccional (muy normalizada, para altas/bajas/consultas), el DW tiende a no estar normalizado y se organiza por datamarts; conviene separarlo del entorno transaccional para no degradar el rendimiento.' },
        { tipo: 'img', src: 'img/adp/s04/fig06-transaccional-dw.png', alt: 'Sistema transaccional en convivencia con un data warehouse', pie: 'Figura 3. Convivencia de una arquitectura transaccional con un data warehouse.' },

        { tipo: 'h', texto: 'Presentación de datos' },
        { tipo: 'p', texto: 'Tan importante como obtener los datos es presentarlos de forma comprensible. Cada tipo de gráfico cumple una función según lo que se quiera mostrar: comparación, relación, distribución o composición.' },
        { tipo: 'img', src: 'img/adp/s04/fig07-funciones-graficos.png', alt: 'Infografía de funciones de los gráficos: cuál elegir', pie: 'Figura 4. Funciones de los gráficos: ¿cuál elegir según comparación, relación, distribución o composición?' },

        { tipo: 'h', texto: 'Definiciones básicas del modelamiento' },
        { tipo: 'ul', items: [
          'Pool: contenedor que agrupa elementos de un proceso. Lane (carril): representa a un actor o rol.',
          'Evento: suceso de inicio, intermedio o término. Actividad: trabajo o conjunto de tareas ejecutados por los actores.',
          'Compuerta de convergencia: varias entradas y una salida. Compuerta de divergencia: una entrada y varias salidas.',
          'Factores críticos: elementos que impactan positiva o negativamente el objetivo del proceso.',
          'Lógica de negocio: la toma de decisión en un nodo del proceso.',
          'Simulación / BPSim: técnica para evaluar escenarios a partir de los modelos BPMN.',
        ] },
        { tipo: 'nota', texto: 'Caso Volkswagen (cómic de la sesión): pese a un 2014 difícil, el grupo superó los 10 millones de entregas y alcanzó ventas récord, ilustrando fuerza y resiliencia con foco en el largo plazo.' },
        { tipo: 'img', src: 'img/adp/s04/fig08-comic-vw.png', alt: 'Cómic del caso Volkswagen: fuerza y resiliencia', pie: 'Figura 5. Caso Volkswagen: fuerza y resiliencia (cómic de la sesión).' },
      ],
      quiz: [
        {
          id: 'q1',
          pregunta: '¿Qué tipo de fuente de información es una entrevista o un documento original?',
          opciones: ['Secundaria', 'Terciaria', 'Primaria', 'Ninguna'],
          correcta: 2,
          explicacion: 'Las fuentes primarias son directas y originales: documentos originales, entrevistas, discursos, etc.',
        },
        {
          id: 'q2',
          pregunta: 'Un libro o una tesis se consideran fuentes…',
          opciones: ['Primarias', 'Secundarias', 'Terciarias', 'No son fuentes'],
          correcta: 1,
          explicacion: 'Las secundarias son documentos derivados de las primarias: libros, informes, tesis, revistas, etc.',
        },
        {
          id: 'q3',
          pregunta: '¿Qué significan las siglas ETL en un data warehouse?',
          opciones: [
            'Enter, Test, Load',
            'Extract, Transform, Load (extraer, transformar y cargar)',
            'Evaluate, Track, Learn',
            'Export, Transfer, Link',
          ],
          correcta: 1,
          explicacion: 'ETL: extraer los datos de las fuentes, transformarlos al modelo y cargarlos en el DW.',
        },
        {
          id: 'q4',
          pregunta: '¿Cuál NO es una característica de un data warehouse?',
          opciones: [
            'Integrado (unifica fuentes)',
            'No volátil (la información no varía)',
            'Variante en el tiempo (guarda histórico)',
            'Altamente normalizado como una base transaccional',
          ],
          correcta: 3,
          explicacion: 'A diferencia de las bases transaccionales (muy normalizadas), el DW tiende a NO estar normalizado y se organiza por datamarts.',
        },
        {
          id: 'q5',
          pregunta: 'En BPMN, ¿qué representa un "lane" (carril)?',
          opciones: [
            'Un contenedor de todo el proceso',
            'Un actor o rol dentro del proceso',
            'Una decisión',
            'Un objeto de datos',
          ],
          correcta: 1,
          explicacion: 'El lane representa a un actor o rol; el pool es el contenedor que agrupa el proceso.',
        },
        {
          id: 'q6',
          pregunta: 'Una compuerta de divergencia se caracteriza por…',
          opciones: [
            'Varias entradas y una sola salida',
            'Una entrada y varias salidas',
            'No tener conexiones',
            'Ser un evento de inicio',
          ],
          correcta: 1,
          explicacion: 'La divergencia recibe un conector de entrada y genera múltiples salidas; la convergencia es al revés.',
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
    { id: 's2f1', frente: 'Proceso de negocio', reverso: 'Conjunto de actividades interrelacionadas en secuencia que producen un producto o servicio con valor.', tema: 's02-ciclo-vida' },
    { id: 's2f2', frente: 'Elementos de un proceso', reverso: 'Entradas, salidas, secuencia de actividades y sistema de control.', tema: 's02-ciclo-vida' },
    { id: 's2f3', frente: 'Procesos estratégicos vs. operativos', reverso: 'Los estratégicos coordinan y no dan valor directo; los operativos generan y entregan el valor al usuario.', tema: 's02-ciclo-vida' },
    { id: 's2f4', frente: 'Jerarquía de procesos', reverso: 'Macroprocesos → procesos → subprocesos → actividades → tareas.', tema: 's02-ciclo-vida' },
    { id: 's2f5', frente: 'Mapa de procesos', reverso: 'Representación gráfica de la organización según misión y visión, mostrando sus procesos.', tema: 's02-ciclo-vida' },
    { id: 's2f6', frente: 'Ciclo de vida de los procesos', reverso: 'Modelar, simular, implementar, monitorear y optimizar.', tema: 's02-ciclo-vida' },
    { id: 's2f7', frente: 'Los 5 porqués', reverso: 'Preguntar "¿por qué?" sucesivamente para llegar a la causa raíz de un problema.', tema: 's02-ciclo-vida' },
    { id: 's2f8', frente: 'Modelos de referencia', reverso: 'Marco de buenas prácticas para comparar y mejorar procesos hacia un estándar.', tema: 's02-ciclo-vida' },
    { id: 's3f1', frente: 'BPM', reverso: 'Business Process Management: disciplina de gestión que mejora los procesos de negocio con metodologías, herramientas y tecnologías.', tema: 's03-bpm-diseno' },
    { id: 's3f2', frente: 'Pilares del BPM', reverso: 'Procesos, personas y tecnología de la información, alineados por la estrategia.', tema: 's03-bpm-diseno' },
    { id: 's3f3', frente: 'Visión BPM de la organización', reverso: 'Un universo de procesos interrelacionados, no áreas funcionales aisladas.', tema: 's03-bpm-diseno' },
    { id: 's3f4', frente: 'Diseño de procesos', reverso: 'Transformar visión, objetivos y recursos en un medio comprensible y medible para lograr las metas.', tema: 's03-bpm-diseno' },
    { id: 's3f5', frente: 'Etapas del análisis y diagnóstico', reverso: 'Levantamiento, documentación y caracterización, validación, análisis y diagnóstico.', tema: 's03-bpm-diseno' },
    { id: 's3f6', frente: 'Las 5 preguntas del análisis', reverso: 'Para qué, qué, quién, cómo y cuándo de un proceso.', tema: 's03-bpm-diseno' },
    { id: 's3f7', frente: 'Levantamiento de procesos', reverso: 'Obtener la información de cómo operan hoy los procesos, tareas y procedimientos.', tema: 's03-bpm-diseno' },
    { id: 's3f8', frente: 'Cadena de valor', reverso: 'Actividades principales con impacto directo en la estrategia y en la entrega del producto/servicio.', tema: 's03-bpm-diseno' },
    { id: 's3f9', frente: 'Modelo de referencia (PCF)', reverso: 'Marco para estructurar y comparar procesos con un estándar de buenas prácticas.', tema: 's03-bpm-diseno' },
    { id: 's4f1', frente: 'Fuentes primarias', reverso: 'Información nueva y original: documentos originales, entrevistas, discursos, apuntes.', tema: 's04-modelamiento' },
    { id: 's4f2', frente: 'Fuentes secundarias', reverso: 'Documentos derivados de las primarias: libros, informes, tesis, revistas, bases de datos.', tema: 's04-modelamiento' },
    { id: 's4f3', frente: 'Fuentes terciarias', reverso: 'Recursos que resumen y remiten a las secundarias: bibliografías, índices, catálogos.', tema: 's04-modelamiento' },
    { id: 's4f4', frente: 'Data warehouse', reverso: 'Arquitectura de almacenamiento para análisis, base del Business Intelligence.', tema: 's04-modelamiento' },
    { id: 's4f5', frente: 'ETL', reverso: 'Extract, Transform, Load: extraer, transformar y cargar datos en el data warehouse.', tema: 's04-modelamiento' },
    { id: 's4f6', frente: 'Datamart', reverso: 'Fragmento del DW con modelo estrella o snowflake para un propósito específico.', tema: 's04-modelamiento' },
    { id: 's4f7', frente: 'Pool vs. Lane (BPMN)', reverso: 'Pool: contenedor del proceso. Lane: actor o rol dentro del proceso.', tema: 's04-modelamiento' },
    { id: 's4f8', frente: 'Compuerta de convergencia / divergencia', reverso: 'Convergencia: varias entradas, una salida. Divergencia: una entrada, varias salidas.', tema: 's04-modelamiento' },
  ],
}
