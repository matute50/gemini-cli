# Documento de Proceso: Modo ReWOO (Jefe de Cocina)

**Versión:** 1.0
**Estado:** Borrador para Aprobación

## 1. Propósito

Este documento define el flujo de trabajo interno y las reglas que seguiré para ejecutar tareas utilizando la arquitectura ReWOO. El objetivo es añadir una habilidad más eficiente para tareas predecibles, complementando mi modo ReAct actual.

## 2. Criterios de Activación

Antes de iniciar una tarea, realizaré una evaluación rápida. Activaré el "Modo Jefe de Cocina" (ReWOO) si la petición del usuario cumple estas condiciones:

*   **Es Predecible:** La tarea se puede descomponer en una secuencia de pasos lógicos y conocidos desde el principio.
*   **No es Exploratoria:** No requiere adaptación constante basada en descubrimientos a mitad del proceso.

**Ejemplo Práctico:**
*   **Sí usar ReWOO para:** "¿Cuál es la población de la capital de Japón?"
*   **No usar ReWOO para:** "Investiga y dame un resumen de las últimas noticias sobre inteligencia artificial."

## 3. Los Componentes y su Lógica Interna

El proceso se divide en tres componentes que ejecutaré secuencialmente.

### Componente 1: El Planificador (Planner)

*   **Entrada:** La petición original del usuario.
*   **Proceso:** Mi primer "pensamiento" será generar un plan estructurado. Este plan listará las herramientas a usar y las preguntas a responder, usando variables como `#E1`, `#E2` para los resultados intermedios.
*   **Salida:** Un plan de acción detallado.

**Ejemplo de Planificación:**

> **Petición de Usuario:** "¿Quién dirigió la película 'Origen' y en qué año se estrenó?"
>
> **Mi Plan Generado (Salida del Planificador):**
> ```
> - step: 1
>   tool: "search"
>   query: "director de la película Origen"
>   output_variable: "#E1"
> - step: 2
>   tool: "search"
>   query: "año de estreno de la película Origen"
>   output_variable: "#E2"
> ```

### Componente 2: El Trabajador (Worker)

*   **Entrada:** El plan estructurado del Planificador.
*   **Proceso:** Ejecutaré cada paso del plan en orden. No haré ninguna llamada al LLM para "pensar" durante esta fase. Simplemente ejecutaré las herramientas con las preguntas definidas. Si un paso depende de un resultado anterior (ej. `#E1`), sustituiré la variable con el valor obtenido.
*   **Salida:** Una colección de "evidencia" con los resultados de cada paso.

**Ejemplo de Trabajo:**

> **Mi Evidencia Recopilada (Salida del Trabajador):**
> ```
> {
>   "#E1": "Christopher Nolan",
>   "#E2": "2010"
> }
> ```

### Componente 3: El Solucionador (Solver)

*   **Entrada:** La petición original del usuario, el plan y la evidencia recopilada.
*   **Proceso:** Haré una única llamada final al LLM. En esta llamada, le proporcionaré toda la información y le pediré que sintetice una respuesta final, coherente y en lenguaje natural.
*   **Salida:** La respuesta final para ti.

**Ejemplo de Solución:**

> **Mi Respuesta Final (Salida del Solucionador):**
> "La película 'Origen' fue dirigida por Christopher Nolan y se estrenó en el año 2010."

## 4. Manejo de Errores (Estrategia Híbrida)

Si un paso del Trabajador falla (por ejemplo, una herramienta da error o no devuelve un resultado), el proceso ReWOO se detendrá. En ese momento, activaré mi modo "Artesano" (ReAct) para analizar el fallo y intentar solucionar el problema de forma iterativa. Te informaré de este cambio de modo.

---

Este es el manual que guiará mi nueva habilidad. Quedo a la espera de tu revisión para considerarlo "implementado" y empezar a usarlo.
