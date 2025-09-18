const db = {
    jugadoras: [
        {
            id: 1,
            nombreCompleto: "Valeria Almada",
            fotoPerfil: "assets/images/jugadora1_placeholder.png",
            rankingActual: 1,
            edad: 28,
            posicion: 'Revés',
            biografia: "Jugadora con una defensa sólida y una visión de juego excepcional. Comenzó a jugar a los 12 años y ha ganado múltiples torneos nacionales.",
            paletaActual: "Odea Control",
            patrocinadores: ["Odea", "PadelPro Shop"],
            estadisticas: { partidosJugados: 25, victorias: 22, derrotas: 3, titulosTemporada: 4 }
        },
        {
            id: 2,
            nombreCompleto: "Julieta Pérez",
            fotoPerfil: "assets/images/jugadora2_placeholder.png",
            rankingActual: 2,
            edad: 24,
            posicion: 'Drive',
            biografia: "Conocida por su potente remate y agresividad en la red. Una de las jugadoras más prometedoras del circuito.",
            paletaActual: "Power Padel 3000",
            patrocinadores: ["Power Padel", "Energy Drink Co."],
            estadisticas: { partidosJugados: 28, victorias: 23, derrotas: 5, titulosTemporada: 3 }
        },
        {
            id: 3,
            nombreCompleto: "Martina González",
            fotoPerfil: "assets/images/jugadora3_placeholder.png",
            rankingActual: 3,
            edad: 31,
            posicion: 'Revés',
            biografia: "La experiencia y la inteligencia táctica son sus mayores virtudes. Maestra del punto de oro.",
            paletaActual: "Pro Kennex Legend",
            patrocinadores: ["Pro Kennex"],
            estadisticas: { partidosJugados: 22, victorias: 18, derrotas: 4, titulosTemporada: 2 }
        },
        {
            id: 4,
            nombreCompleto: "Sofía Rodríguez",
            fotoPerfil: "assets/images/jugadora4_placeholder.png",
            rankingActual: 4,
            edad: 22,
            posicion: 'Drive',
            biografia: "Rápida y ágil, cubre toda la pista con una facilidad asombrosa. Su especialidad es la bandeja.",
            paletaActual: "StarVie Raptor",
            patrocinadores: ["StarVie", "Ropa Deportiva Sol"],
            estadisticas: { partidosJugados: 30, victorias: 20, derrotas: 10, titulosTemporada: 1 }
        },
        {
            id: 5,
            nombreCompleto: "Camila Fernández",
            fotoPerfil: "assets/images/jugadora5_placeholder.png",
            rankingActual: 5,
            edad: 29,
            posicion: 'Revés',
            biografia: "Una jugadora muy completa, con un gran control desde el fondo de la pista y una volea precisa.",
            paletaActual: "Bullpadel Vertex 03W",
            patrocinadores: ["Bullpadel"],
            estadisticas: { partidosJugados: 26, victorias: 19, derrotas: 7, titulosTemporada: 1 }
        }
    ],
    torneos: [
        {
            id: 1,
            nombre: "AJPP Damas - Chivilcoy 1100",
            fechas: "15-17 de Noviembre",
            sede: "Club La Razón, Chivilcoy",
            puntos: 1100,
            estado: "Programado"
        },
        {
            id: 2,
            nombre: "AJPP Damas - Mar del Plata 1500",
            fechas: "29 Nov - 01 Dic",
            sede: "Los Naranjos Padel, Mar del Plata",
            puntos: 1500,
            estado: "Programado"
        },
        {
            id: 3,
            nombre: "AJPP Damas - Rosario 1000",
            fechas: "08-10 de Noviembre",
            sede: "Club Funes, Rosario",
            puntos: 1000,
            estado: "Finalizado"
        }
    ],
    noticias: [
        {
            id: 1,
            titulo: "Almada y Pérez se coronan en Rosario",
            resumen: "La pareja número 1 del ranking se impuso en una final apasionante a tres sets...",
            imagen: "assets/images/noticia1_placeholder.png"
        },
        {
            id: 2,
            titulo: "El circuito AJPP anuncia nuevas sedes para 2026",
            resumen: "La asociación confirmó que se sumarán torneos en las provincias de Salta y Misiones...",
            imagen: "assets/images/noticia2_placeholder.png"
        }
    ],
    ranking: [
        { posicion: 1, nombre: "Valeria Almada", provincia: "Buenos Aires", puntos: 10500 },
        { posicion: 2, nombre: "Julieta Pérez", provincia: "Córdoba", puntos: 9800 },
        { posicion: 3, nombre: "Martina González", provincia: "Santa Fe", puntos: 8950 },
        { posicion: 4, nombre: "Sofía Rodríguez", provincia: "Mendoza", puntos: 8100 },
        { posicion: 5, nombre: "Camila Fernández", provincia: "Buenos Aires", puntos: 7600 },
        { posicion: 6, nombre: "Lucía Martínez", provincia: "Entre Ríos", puntos: 7150 }
    ],
    liveMatches: [
        {
            id: 1,
            torneo: "AJPP Damas - Mar del Plata 1500",
            ronda: "Semifinal",
            jugadoras1: ["Valeria Almada", "Julieta Pérez"],
            jugadoras2: ["Martina González", "Sofía Rodríguez"],
            score: [
                { set: 1, j1: 6, j2: 4 },
                { set: 2, j1: 5, j2: 5, puntoDeOro: true }
            ],
            streamUrl: "https://www.youtube.com/embed/live_stream?channel=ajpp-damas-tv"
        }
    ]
};