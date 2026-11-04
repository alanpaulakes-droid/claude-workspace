# Requisitos permanentes del usuario (Calculadora RIC y proyectos futuros)

Estos criterios aplican a **todo** proyecto de este repositorio, actual o nuevo.

## Calidad esperada
- **Profesional**: resultados con criterio de ingeniería eléctrica chilena (SEC, pliegos RIC N°01 a N°19). Citar el pliego cuando una regla venga de la norma; marcar como "recomendación" o "criterio usual" lo que no sea exigencia textual. Verificar datos dudosos antes de afirmarlos (por ejemplo, nomenclatura chilena 9/12, 9/15, 9/24, 9/32).
- **Multiplataforma**: todo debe funcionar igual en iPhone (Safari y app de Claude) y en Android (Chrome), vertical y horizontal. No depender de APIs que iOS bloquea (pantalla completa nativa, descargas directas): usar siempre un respaldo por CSS/JS y probar con emulación de ambos.
- **Accesible**: botones con texto o `aria-label`, contraste suficiente en claro y oscuro, navegable con teclado, objetivos táctiles cómodos, funciona a ancho de teléfono (sin scroll horizontal) y en pantalla completa.
- **Fácil de usar**: cada acción con instrucciones breves en pantalla, ejemplos precargados, deshacer, confirmación antes de borrar, y mensajes de error que digan qué corregir y por qué.

## El usuario quiere poder elegir y ajustar todo
- Posiciones, alturas, direcciones y medidas configurables por el usuario: componentes en muros o paneles, regletas dentro del tablero (tocando el tablero o con flechas), recorridos de ductos con codos de 90°, tipos y sentido de escaleras, recintos con medidas exactas, pisos.
- Ofrecer siempre **dos vías**: una rápida o automática (plantillas, "Agregar lo pedido", formas rápidas) y una manual y precisa (tocar en 3D, flechas, campos numéricos).
- Corrección de errores con tres modos: **pedir autorización** (por defecto), automática, desactivada.

## Integración entre secciones
- Todo lo nuevo debe reflejarse donde corresponda: simulador 3D, inspector RIC (errores con explicación), diagramas unilineal y multilineal, planos y lámina SEC, listado de materiales con precios en CLP, informe técnico, curso y buscador.
- Elementos eléctricos chilenos completos: interruptores 9/12, 9/15, 9/24, 9/32, dimmer, sensor, pulsador; enchufes simples, dobles, IP44, USB, fuerza y datos/TV; portalámparas de muro; regletas de neutro y tierra, repartidor y peine; cajas, ductos, codos, coplas y terminales.

## Forma de trabajo
- Responder en español, breve y en listas; sin preámbulos ni resúmenes finales.
- Antes de publicar: revisión de sintaxis, autopruebas de la app en verde, recorrido de todas las páginas sin errores de consola y captura del resultado en 3D cuando aplique.
- Publicar el artifact en la misma URL, hacer commit y push a la rama de trabajo asignada.
