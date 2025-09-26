# Arquitectura de Agente: ReAct (Reasoning and Acting)

Fuente: Usuario via NotebookLM

## Resumen

ReAct es un patrón de diseño fundamental para agentes de IA que les permite resolver tareas complejas de manera más robusta. El patrón consiste en un ciclo donde el Gran Modelo de Lenguaje (LLM) alterna entre tres pasos:

1.  **Thought (Pensamiento):** El LLM razona sobre el estado actual del problema y decide qué acción necesita realizar para avanzar hacia la solución.

2.  **Action (Acción):** El LLM elige y ejecuta una herramienta externa (ej. una búsqueda web, leer un archivo) para obtener nueva información.

3.  **Observation (Observación):** El LLM recibe el resultado de la acción (la nueva información) y la utiliza como entrada para el siguiente ciclo de pensamiento.

## Beneficios Clave

*   **Mitiga la "alucinación":** Al poder consultar fuentes de información en tiempo real, el agente puede basar su razonamiento en hechos verificables en lugar de conocimiento interno potencialmente desactualizado.
*   **Robustez:** Permite al agente corregir su curso si una acción no produce el resultado esperado.

## Evolución

ReAct es un componente clave en frameworks como LangChain. Representa un paso fundamental en la evolución de los agentes, con arquitecturas más avanzadas como LATS (Language Agent Tree Search) construyendo sobre estos principios.
