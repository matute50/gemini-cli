# Arquitectura de Agentes ReWOO (Reasoning WithOut Observation)

Este documento resume el conocimiento sobre la arquitectura de agentes ReWOO, una alternativa eficiente al patrón iterativo ReAct.

## 1. Concepto Fundamental: Plan-Work-Solve

ReWOO es un paradigma de agente de IA que desvincula el proceso de razonamiento de las llamadas a herramientas externas. A diferencia de ReAct, que intercala los pasos de pensamiento, acción y observación, ReWOO sigue un flujo de tres etapas distintas:

1.  **Plan (Planificar):** El agente primero analiza la solicitud del usuario y genera un plan de ejecución completo y estructurado. Este plan consiste en una secuencia de sub-tareas o preguntas, a menudo con marcadores de posición para la evidencia que se recogerá más tarde.
2.  **Work (Trabajar):** El agente ejecuta las herramientas necesarias para cada sub-tarea definida en el plan (por ejemplo, realizar búsquedas web, consultar una base de datos). Esta fase se centra únicamente en la recopilación de "evidencia" para responder a las sub-preguntas del plan.
3.  **Solve (Resolver):** Una vez que toda la evidencia ha sido recopilada por los trabajadores, un "Solucionador" sintetiza toda esta información junto con el plan original para generar la respuesta final y coherente.

## 2. Componentes de la Arquitectura

*   **Planificador (Planner):** Un LLM responsable de descomponer la tarea principal en un plan lógico y ejecutable. No interactúa con herramientas.
*   **Trabajador (Worker):** Un componente que ejecuta herramientas específicas para recopilar datos. Puede haber múltiples trabajadores, aunque la arquitectura base es secuencial.
*   **Solucionador (Solver):** Un LLM que recibe el plan y la evidencia de los trabajadores para formular la respuesta final.

## 3. Ventajas sobre ReAct

*   **Mayor Eficiencia de Tokens:** Al planificar todo por adelantado, ReWOO reduce drásticamente el número de llamadas iterativas al LLM para los pasos de "pensamiento", lo que se traduce en un menor consumo de tokens y, por tanto, un menor costo.
*   **Menor Latencia:** Menos llamadas secuenciales al LLM resultan en un tiempo de respuesta general más rápido.
*   **Razonamiento Estructurado:** El plan inicial proporciona una estructura lógica y fácil de seguir, lo que hace que el proceso de razonamiento del agente sea más predecible y depurable.

## 4. Limitaciones y Casos de Uso

*   **Principal Limitación:** La principal desventaja es su rigidez. Si un paso del plan falla o devuelve información inesperada, el agente no puede adaptarse dinámicamente como lo haría un agente ReAct. El plan se ejecuta de forma secuencial y no hay un bucle de retroalimentación para corregir el rumbo.
*   **Caso de Uso Ideal:** Tareas complejas pero predecibles, donde los pasos para llegar a la solución pueden ser anticipados con un alto grado de certeza.
