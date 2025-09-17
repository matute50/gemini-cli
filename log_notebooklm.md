## Conversación con NotebookLM - 16 de septiembre de 2025

### Prompt Inicial para la App Móvil AJPP Damas

**Rol:** Actúa como un desarrollador experto en UI/UX y un programador full-stack especializado en la creación de aplicaciones móviles modernas, responsivas y de alto rendimiento utilizando exclusivamente HTML5, CSS3 (con Flexbox y Grid) y JavaScript (ES6+) puro, sin frameworks.

**Objetivo:** Genera el código completo (HTML, CSS y JavaScript) para una aplicación móvil oficial de la Asociación de Jugadores Profesionales de Pádel (AJPP), con un enfoque principal en el circuito femenino de damas. La aplicación debe ser moderna, intuitiva, fácil de navegar y respetar la identidad visual de la AJPP.

**Instrucciones Generales de Diseño:**
1.  **Estilo y Estética:** La app debe tener un diseño limpio, profesional y enérgico, reflejando la naturaleza del pádel profesional.
    *   **Colores:** Utiliza una paleta de colores basada en el logo de la AJPP y la Asociación Pádel Argentino (APA), predominando los azules, blancos y acentos en colores vibrantes.
    *   **Tipografía:** Emplea fuentes sans-serif modernas y legibles (ej. Montserrat, Lato, Roboto) para títulos y cuerpo de texto.
    *   **Logo:** El logo de AJPP debe estar presente en la pantalla de carga (splash screen) y de forma sutil en la cabecera o barra de navegación.
2.  **Navegación:** Implementa una barra de navegación inferior (tab bar) con iconos para las 5 secciones principales: Inicio, Jugadoras, Calendario, Rankings y En Vivo. Un menú lateral (hamburguesa) contendrá el resto de las secciones.
3.  **Interactividad:** La aplicación debe ser fluida, con transiciones suaves entre pantallas y tiempos de carga optimizados.

--------------------------------------------------------------------------------

### Estructura y Contenido Detallado de la App:

1.  **Pantalla de Inicio (Home):**
    *   **Diseño:** Un dashboard dinámico.
    *   **Contenido:**
        *   **Próximo Torneo:** Un carrusel o tarjeta destacada con la información del próximo torneo del calendario.
        *   **Top 5 Ranking:** Una sección que muestre las fotos y nombres de las 5 mejores jugadoras del ranking actual.
        *   **Noticias Recientes:** Un feed de noticias con titulares e imágenes sobre el circuito, como resultados de torneos recientes o anuncios importantes.
        *   **Acceso a "AJPP en Vivo":** Un banner prominente que indique si hay un partido en directo y que lleve a la sección correspondiente.

2.  **¿Qué es la AJPP?:**
    *   **Diseño:** Una página informativa estática.
    *   **Contenido:**
        *   **Misión y Fundamentos:** Explica que la AJPP es una asociación que busca la defensa y representación de los intereses comunes de las jugadoras. Sus pilares son la profesionalización de la jugadora, el crecimiento de la competitividad y la mejora en la organización del circuito.
        *   **Historia:** Menciona que la idea surgió entre los propios jugadores en el año 2000 y fue reconocida legalmente en 2001.
        *   **Acuerdo con APA:** Informa sobre el convenio con la Asociación Pádel Argentino (APA), donde APA se encarga del ranking nacional de la AJPP y la organización de torneos oficiales para fortalecer el deporte en el país.

3.  **Perfil de Jugadoras:**
    *   **Diseño:** Una pantalla con un buscador y una lista de jugadoras. Cada jugadora tendrá su perfil detallado.
    *   **Estructura de Datos (por jugadora):**
        *   `nombreCompleto`: String
        *   `fotoPerfil`: URL
        *   `rankingActual`: Number
        *   `edad`: Number
        *   `posicion`: String ('Revés' o 'Drive')
        *   `biografia`: Texto corto sobre su carrera, inicios y logros.
        *   `paletaActual`: String (marca y modelo, ej. "Odea Control").
        *   `patrocinadores`: Array de logos/nombres.
        *   `estadisticas`: Objeto con `partidosJugados`, `victorias`, `derrotas`, `titulosTemporada`.
    *   **Funcionalidad Especial: Canal de Fans (dentro de cada perfil):**
        *   Una sección tipo "muro" o "feed" donde la jugadora (o su equipo) puede publicar breves actualizaciones, fotos o videos.
        *   Los fans (usuarios de la app) pueden dejar comentarios y "me gusta" en estas publicaciones, creando un canal de contacto directo y fomentando la comunidad.
        *   Incluir enlaces a sus redes sociales oficiales (Instagram, Facebook, etc.).

4.  **Calendario:**
    *   **Diseño:** Una vista de lista o calendario mensual.
    *   **Contenido (por torneo):**
        *   Nombre del torneo (ej. "AJPP Damas - Chivilcoy 1100").
        *   Fechas.
        *   Sede y localidad.
        *   Puntos que otorga.
        *   Estado (Programado, Confirmado, En Curso, Finalizado).
        *   Al tocar un torneo, se debe poder ver el cuadro de juego y los resultados.

5.  **Rankings:**
    *   **Diseño:** Dos pestañas: "Individual" y "Parejas".
    *   **Contenido:**
        *   Listado de jugadoras con su posición, nombre, provincia y puntos totales.
        *   Debe ser posible buscar a una jugadora por nombre.
        *   Incluir un enlace para descargar el ranking oficial completo en formato PDF.

6.  **Estadísticas:**
    *   **Diseño:** Gráficos y tablas interactivas.
    *   **Contenido:**
        *   **Estadísticas de Jugadoras:** Comparativas de rendimiento (ej. porcentaje de victorias, efectividad en puntos de quiebre, promedio de aces). Inspirado en las métricas de herramientas de análisis.
        *   **Estadísticas de Torneos:** Datos de participación, duración promedio de partidos, sets jugados, etc.
        *   **Datos Fisiológicos:** Información general sobre las demandas del pádel, como que la frecuencia cardíaca media en partidos femeninos amateur es de 150±8.6 ppm y que las jugadoras pasan la mayor parte del tiempo entre el 80-90% de su FC máxima teórica.

7.  **Reglamentos:**
    *   **Diseño:** Un visor de documentos con secciones colapsables y un buscador.
    *   **Contenido:**
        *   **Reglamento de Juego de la FIP/FEP.** Incluir reglas clave como puntuación (con "Punto de Oro"), saque, tiempos de descanso, y dimensiones de la pista.
        *   **Reglamento Deportivo Amateur de la APA,** que se aplica de forma subsidiaria.
        *   **Código de conducta y disciplina en la pista.**

8.  **AJPP en Vivo (Live Score):**
    *   **Diseño:** Una pantalla que muestre los partidos que se están jugando en ese momento.
    *   **Contenido:**
        *   Marcador en tiempo real para el partido seleccionado.
        *   Nombres de las jugadoras, estadísticas básicas del partido (ej. duración, aces).
        *   Si hay streaming disponible, incrustar el reproductor de YouTube o la plataforma correspondiente.

9.  **Archivo AJPP:**
    *   **Diseño:** Una sección con filtros por año y torneo.
    *   **Contenido:**
        *   Resultados históricos de torneos pasados (campeonas, finalistas).
        *   Rankings finales de temporadas anteriores.
        *   Galería de fotos y videos de momentos destacados.

10. **"Amamos el Pádel":**
    *   **Diseño:** Una sección comunitaria tipo red social (muro social o galería).
    *   **Funcionalidad:**
        *   Permitir a los usuarios registrados subir sus propias fotos y videos jugando al pádel o asistiendo a torneos.
        *   Los usuarios pueden dejar comentarios y reacciones en las publicaciones de otros.
        *   Requiere un sistema simple de registro/login (puede usar localStorage para simular sesión) y pautas comunitarias claras.

11. **Contactos:**
    *   **Diseño:** Una página simple de contacto.
    *   **Contenido:**
        *   Correos electrónicos oficiales: padelajppdamas@gmail.com (Contacto) y redes.ajppdamas@gmail.com (Comunicación).
        *   Iconos con enlaces directos a las redes sociales oficiales: Facebook, Instagram y YouTube.
        *   Formulario de contacto para enviar consultas directamente desde la app.


---

**Respuesta de Gemini CLI:**

(Aquí iría la respuesta de Gemini CLI, que es la conversación que estamos teniendo ahora.)
