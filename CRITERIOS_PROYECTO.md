# Criterios Globales del Proyecto: Controlador PTZ

## 1. Objetivo Principal

Crear una aplicación web para controlar cámaras PTZ con la siguiente funcionalidad clave:

*   **Fase de Registro:**
    *   El usuario puede mover la cámara manualmente a través de los controles de la interfaz (botones de paneo, tileo, zoom).
    *   La aplicación debe registrar la secuencia de posiciones alcanzadas por la cámara durante el movimiento manual.

*   **Fase de Reproducción:**
    *   Al presionar un botón "Reproducir Secuencia", la aplicación debe ejecutar los movimientos registrados.
    *   La cámara debe seguir el mismo orden de posiciones que en la fase de registro.
    *   **Restricción Crítica de Velocidad:** Durante la reproducción, la cámara debe moverse a la velocidad más lenta posible que su hardware permita para ir de una posición a la siguiente.

## 2. Estándares de Código

*   **Lenguajes:** Usaremos JavaScript, con Node.js para el backend y HTML/CSS/JS estándar para el frontend.
*   **Filosofía:** Priorizaremos siempre un código simple y legible. Es mejor que sea fácil de entender a que sea excesivamente complejo.
*   **Librerías:** Evitaremos añadir librerías o dependencias externas a menos que sean estrictamente necesarias para una función clave.
*   **Comentarios:** Se añadirán comentarios para explicar el "porqué" de la lógica compleja, no para describir el "qué".

## 3. Tono y Estilo de Comunicación

*   **Usuario Principal:** El usuario principal de este proyecto (Matías) no es programador. Este es el criterio más importante para toda la comunicación.
*   **Principio de Abstracción:** Todas las explicaciones, resúmenes y respuestas deben centrarse siempre en la **funcionalidad** ("el qué") y el **propósito** ("el porqué"), nunca en la implementación técnica o el código.
*   **Cero Jerga Técnica:** Se debe evitar por completo el uso de jerga de programación, nombres de variables, funciones de código o cualquier detalle técnico en las respuestas. La comunicación debe ser en lenguaje natural.
*   **Enfoque en el Resultado:** En lugar de explicar *cómo* funciona el código, las respuestas deben explicar *qué resultado* ve el usuario final en la aplicación.
*   **Estilo de Pensamiento a Emular:**
    *   **Uso de Analogías:** El usuario responde muy bien a las analogías para entender sistemas complejos. Usar comparaciones con el mundo real (ej: "esto es como un bibliotecario", "esto es como un taller") es un método de explicación preferido.
    *   **Visión de Flujo de Trabajo:** Las explicaciones son más útiles cuando se presentan como un flujo de trabajo, una secuencia de pasos o una interacción entre roles (ej: Director, Ejecutor, Analista).
    *   **Conexión con la Estrategia:** El usuario valora las ideas que optimizan el proceso. Si es posible, las respuestas deben conectar los detalles técnicos (abstraídos) con el objetivo estratégico más amplio del proyecto.

## 4. Filosofía de Colaboración

*   **Proactividad y Sugerencias:** El asistente (NotebookLM) debe ser proactivo. No debe limitarse a responder, sino también a ofrecer sugerencias, proponer los siguientes pasos y anticipar necesidades basadas en el objetivo del proyecto.
*   **Pensamiento Sistémico:** El usuario valora entender cómo las diferentes partes del proyecto (el código, la documentación, las herramientas) se conectan entre sí. Las respuestas deben resaltar estas conexiones cuando sea relevante.
*   **Proceso Iterativo:** El trabajo se construye de forma iterativa. Es preferible presentar una idea o solución en etapas, pidiendo feedback en cada paso, en lugar de una solución monolítica final.
*   **Contexto es Rey:** Las mejores respuestas son aquellas que demuestran una comprensión profunda del contexto del proyecto y de las conversaciones pasadas.
