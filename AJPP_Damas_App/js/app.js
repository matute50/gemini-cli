document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const splashScreen = document.getElementById('splash-screen');
    const appContent = document.getElementById('app-content');
    const headerTitle = document.querySelector('#main-header h1');
    const tabBar = document.getElementById('tab-bar');
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');

    // --- LÓGICA DEL SPLASH SCREEN ---
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.style.opacity = '0';
            setTimeout(() => splashScreen.style.display = 'none', 500);
        }
    }, 1500);

    // --- RENDERIZADO DE SECCIONES ---
    const renderInicio = () => {
        // 1. Proximo Torneo
        const proximoTorneo = db.torneos.find(t => t.estado === 'Programado');
        const proximoTorneoHTML = proximoTorneo ? `
            <div class="card">
                <h3>${proximoTorneo.nombre}</h3>
                <p><strong>Fecha:</strong> ${proximoTorneo.fechas}</p>
                <p><strong>Sede:</strong> ${proximoTorneo.sede}</p>
                <p><strong>Puntos:</strong> ${proximoTorneo.puntos}</p>
            </div>
        ` : '<p>No hay torneos programados.</p>';

        // 2. Top 5 Ranking
        const top5Jugadoras = db.ranking.slice(0, 5);
        const top5HTML = top5Jugadoras.map(jugadora => {
            const jugadoraData = db.jugadoras.find(j => j.nombreCompleto === jugadora.nombre);
            return `
                <div class="player-card">
                    <img src="${jugadoraData ? jugadoraData.fotoPerfil : 'assets/images/placeholder.png'}" alt="${jugadora.nombre}">
                    <p>${jugadora.nombre}</p>
                </div>
            `;
        }).join('');

        // 3. Noticias Recientes
        const noticiasHTML = db.noticias.map(noticia => `
            <div class="card news-item">
                <img src="${noticia.imagen}" alt="${noticia.titulo}">
                <div>
                    <h4>${noticia.titulo}</h4>
                    <p>${noticia.resumen}</p>
                </div>
            </div>
        `).join('');

        // 4. Banner En Vivo
        const enVivoHTML = `
            <div class="live-banner">
                <i class="fas fa-broadcast-tower"></i>
                <span>PARTIDOS EN VIVO AHORA</span>
            </div>
        `;

        appContent.innerHTML = `
            <div class="home-section">
                <h2>AJPP en Vivo</h2>
                ${enVivoHTML}
            </div>
            <div class="home-section">
                <h2>Próximo Torneo</h2>
                ${proximoTorneoHTML}
            </div>
            <div class="home-section">
                <h2>Top 5 Ranking</h2>
                <div class="top-players-grid">${top5HTML}</div>
            </div>
            <div class="home-section">
                <h2>Noticias Recientes</h2>
                ${noticiasHTML}
            </div>
        `;
    };

    const renderJugadoras = (jugadoras = db.jugadoras) => {
        const listHTML = jugadoras.map(jugadora => `
            <div class="player-list-item" data-id="${jugadora.id}">
                <img src="${jugadora.fotoPerfil}" alt="${jugadora.nombreCompleto}">
                <div class="player-list-item-info">
                    <h3>${jugadora.nombreCompleto}</h3>
                    <p>Ranking: ${jugadora.rankingActual}</p>
                </div>
            </div>
        `).join('');

        appContent.innerHTML = `
            <input type="text" id="search-jugadoras" class="search-bar" placeholder="Buscar jugadora por nombre...">
            <div class="player-list">${listHTML}</div>
        `;
    };

    const renderJugadoraDetail = (playerId) => {
        const jugadora = db.jugadoras.find(j => j.id === playerId);
        if (!jugadora) {
            renderJugadoras(); // Volver a la lista si no se encuentra
            return;
        }

        headerTitle.textContent = jugadora.nombreCompleto;

        const stats = jugadora.estadisticas;
        const statsHTML = `
            <div class="stat-grid">
                <div class="stat-item"><h4>${stats.partidosJugados}</h4><p>Jugados</p></div>
                <div class="stat-item"><h4>${stats.victorias}</h4><p>Victorias</p></div>
                <div class="stat-item"><h4>${stats.derrotas}</h4><p>Derrotas</p></div>
                <div class="stat-item"><h4>${stats.titulosTemporada}</h4><p>Títulos 2025</p></div>
            </div>
        `;

        appContent.innerHTML = `
            <a href="#" class="back-btn" data-action="back-to-players"><i class="fas fa-arrow-left"></i> Volver a la lista</a>
            <div class="player-detail-header">
                <img src="${jugadora.fotoPerfil}" alt="${jugadora.nombreCompleto}">
                <h2>${jugadora.nombreCompleto}</h2>
                <p>#${jugadora.rankingActual} | ${jugadora.edad} años | ${jugadora.posicion}</p>
            </div>
            <div class="card">
                <h3>Biografía</h3>
                <p>${jugadora.biografia}</p>
            </div>
            <div class="card">
                <h3>Estadísticas de Temporada</h3>
                ${statsHTML}
            </div>
            <div class="card">
                <h3>Equipamiento</h3>
                <p><strong>Paleta:</strong> ${jugadora.paletaActual}</p>
            </div>
        `;
    };

    const renderCalendario = () => {
        const torneosHTML = db.torneos.map(torneo => `
            <div class="tournament-card">
                <div class="tournament-card-header">
                    <h3>${torneo.nombre}</h3>
                    <span class="tournament-status ${torneo.estado.toLowerCase()}">${torneo.estado}</span>
                </div>
                <div class="tournament-card-body">
                    <p><strong><i class="fas fa-calendar-alt"></i> Fecha:</strong> ${torneo.fechas}</p>
                    <p><strong><i class="fas fa-map-marker-alt"></i> Sede:</strong> ${torneo.sede}</p>
                    <p><strong><i class="fas fa-trophy"></i> Puntos:</strong> ${torneo.puntos}</p>
                </div>
            </div>
        `).join('');

        appContent.innerHTML = `
            <div class="tournament-list">
                ${torneosHTML}
            </div>
        `;
    };

    const renderRankings = () => {
        const tableRowsHTML = db.ranking.map(r => `
            <tr>
                <td>${r.posicion}</td>
                <td>${r.nombre}</td>
                <td>${r.provincia}</td>
                <td><strong>${r.puntos}</strong></td>
            </tr>
        `).join('');

        appContent.innerHTML = `
            <div class="sub-nav">
                <button class="sub-nav-item active">Individual</button>
                <button class="sub-nav-item">Parejas</button>
            </div>
            <input type="text" id="search-rankings" class="search-bar" placeholder="Buscar por nombre...">
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Provincia</th>
                        <th>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRowsHTML}
                </tbody>
            </table>
            <a href="#" class="download-pdf-btn"><i class="fas fa-file-pdf"></i> Descargar Ranking PDF</a>
        `;
    };

    const renderEnVivo = () => {
        const liveMatch = db.liveMatches[0]; // Asumimos que hay un partido en vivo

        if (!liveMatch) {
            appContent.innerHTML = '<div class="card"><p>No hay partidos en vivo en este momento.</p></div>';
            return;
        }

        const scoreHTML = `
            <div class="scoreboard-team">
                <div class="team-names">
                    ${liveMatch.jugadoras1.join(' / ')}
                </div>
                <div class="scoreboard-sets">
                    <span>${liveMatch.score[0] ? liveMatch.score[0].j1 : ''}</span>
                    <span>${liveMatch.score[1] ? liveMatch.score[1].j1 : ''}</span>
                </div>
                <div class="scoreboard-current-game ${liveMatch.score[1] && liveMatch.score[1].puntoDeOro ? 'punto-de-oro' : ''}">
                    ${liveMatch.score[1] ? '40' : ''} 
                </div>
            </div>
            <div class="scoreboard-team">
                <div class="team-names">
                    ${liveMatch.jugadoras2.join(' / ')}
                </div>
                <div class="scoreboard-sets">
                    <span>${liveMatch.score[0] ? liveMatch.score[0].j2 : ''}</span>
                    <span>${liveMatch.score[1] ? liveMatch.score[1].j2 : ''}</span>
                </div>
                <div class="scoreboard-current-game">
                     ${liveMatch.score[1] ? '40' : ''} 
                </div>
            </div>
        `;

        appContent.innerHTML = `
            <div class="video-container">
                <iframe src="${liveMatch.streamUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="scoreboard">
                <div class="scoreboard-header">
                    <h4>${liveMatch.torneo} - ${liveMatch.ronda}</h4>
                </div>
                ${scoreHTML}
            </div>
        `;
    };
    
    const renderQueEsAjpp = () => {
        appContent.innerHTML = `
            <div class="static-page">
                <h2>¿Qué es la AJPP?</h2>
                <div class="card">
                    <h3>Misión y Fundamentos</h3>
                    <p>La AJPP es una asociación que busca la defensa y representación de los intereses comunes de las jugadoras. Sus pilares son la profesionalización de la jugadora, el crecimiento de la competitividad y la mejora en la organización del circuito.</p>
                </div>
                <div class="card">
                    <h3>Historia</h3>
                    <p>La idea surgió entre los propios jugadores en el año 2000 y fue reconocida legalmente en 2001.</p>
                </div>
                <div class="card">
                    <h3>Acuerdo con APA</h3>
                    <p>Informa sobre el convenio con la Asociación Pádel Argentino (APA), donde APA se encarga del ranking nacional de la AJPP y la organización de torneos oficiales para fortalecer el deporte en el país.</p>
                </div>
            </div>
        `;
    };

    const renderEstadisticas = () => {
        appContent.innerHTML = `
            <div class="static-page">
                <h2>Estadísticas</h2>
                <div class="card">
                    <h3>Datos Fisiológicos en el Pádel</h3>
                    <p>La frecuencia cardíaca media en partidos femeninos amateur es de 150±8.6 ppm.</p>
                    <p>Las jugadoras pasan la mayor parte del tiempo de juego entre el 80-90% de su frecuencia cardíaca máxima teórica.</p>
                </div>
                 <div class="card">
                    <h3>Estadísticas de Jugadoras y Torneos</h3>
                    <p>Próximamente se añadirán gráficos interactivos con comparativas de rendimiento, efectividad, datos de participación y más.</p>
                </div>
            </div>
        `;
    };

    const renderReglamentos = () => {
        appContent.innerHTML = `
            <div class="static-page">
                <h2>Reglamentos</h2>
                <div class="card">
                    <h3>Reglamento de Juego (FIP/FEP)</h3>
                    <ul>
                        <li><strong>Puntuación:</strong> Se utiliza el sistema de "Punto de Oro" en 40-40.</li>
                        <li><strong>Saque:</strong> El saque debe realizarse por debajo de la cintura.</li>
                        <li><strong>Descansos:</strong> Tiempos de descanso limitados entre juegos y sets.</li>
                    </ul>
                </div>
                 <div class="card">
                    <h3>Código de Conducta</h3>
                    <p>Se espera el máximo respeto entre jugadoras, hacia los árbitros y el público.</p>
                </div>
            </div>
        `;
    };
    
    const renderArchivo = () => {
        appContent.innerHTML = '<h1>Archivo AJPP (Próximamente)</h1>';
    };

    const renderAmamosElPadel = () => {
        appContent.innerHTML = '<h1>Amamos el Pádel (Próximamente)</h1>';
    };

    const renderContactos = () => {
        appContent.innerHTML = `
            <div class="static-page">
                <h2>Contacto</h2>
                <div class="card">
                    <h3>Correos Electrónicos</h3>
                    <p><strong>General:</strong> padelajppdamas@gmail.com</p>
                    <p><strong>Comunicación:</strong> redes.ajppdamas@gmail.com</p>
                </div>
            </div>
        `;
    };

    const renderSideMenu = () => {
        const menuItems = [
            { name: '¿Qué es la AJPP?', section: 'que-es-ajpp', icon: 'fa-info-circle' },
            { name: 'Estadísticas', section: 'estadisticas', icon: 'fa-chart-bar' },
            { name: 'Reglamentos', section: 'reglamentos', icon: 'fa-gavel' },
            { name: 'Archivo AJPP', section: 'archivo', icon: 'fa-archive' },
            { name: 'Amamos el Pádel', section: 'comunidad', icon: 'fa-heart' },
            { name: 'Contactos', section: 'contactos', icon: 'fa-envelope' }
        ];

        const menuHTML = menuItems.map(item => `
            <li class="side-menu-item">
                <a href="#" data-section="${item.section}">
                    <i class="fas ${item.icon}"></i>
                    ${item.name}
                </a>
            </li>
        `).join('');

        sideMenu.innerHTML = `
            <div class="side-menu-header"><h2>AJPP Damas</h2></div>
            <ul class="side-menu-list">${menuHTML}</ul>
        `;
    };

    const sections = {
        inicio: renderInicio,
        jugadoras: renderJugadoras,
        calendario: renderCalendario,
        rankings: renderRankings,
        'en-vivo': renderEnVivo,
        'que-es-ajpp': renderQueEsAjpp,
        'estadisticas': renderEstadisticas,
        'reglamentos': renderReglamentos,
        'archivo': renderArchivo,
        'comunidad': renderAmamosElPadel,
        'contactos': renderContactos
    };

    function renderSection(sectionName) {
        // Actualiza el título del header
        const title = sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/-/g, ' ');
        headerTitle.textContent = title;

        // Limpia el contenido actual
        appContent.innerHTML = '';

        // Renderiza la nueva sección
        const renderFunction = sections[sectionName];
        if (renderFunction) {
            renderFunction();
        } else {
            appContent.innerHTML = '<h1>Sección no encontrada</h1>';
        }
    }

    // --- LÓGICA DE NAVEGACIÓN (ROUTER) ---
    tabBar.addEventListener('click', (e) => {
        const tabItem = e.target.closest('.tab-item');
        if (!tabItem) return;

        e.preventDefault();

        // Actualizar clase activa
        document.querySelector('.tab-item.active').classList.remove('active');
        tabItem.classList.add('active');

        const sectionName = tabItem.dataset.section;
        renderSection(sectionName);
    });

    // --- LÓGICA DE INTERACCIÓN EN CONTENIDO ---
    appContent.addEventListener('click', (e) => {
        // Ver detalle de jugadora
        const playerItem = e.target.closest('.player-list-item');
        if (playerItem) {
            const playerId = parseInt(playerItem.dataset.id);
            renderJugadoraDetail(playerId);
            return;
        }

        // Volver a la lista de jugadoras
        const backBtn = e.target.closest('.back-btn');
        if (backBtn) {
            e.preventDefault();
            renderSection('jugadoras');
            return;
        }
    });

    appContent.addEventListener('input', (e) => {
        // Filtrar jugadoras en la búsqueda
        if (e.target.id === 'search-jugadoras') {
            const searchTerm = e.target.value.toLowerCase();
            const filteredJugadoras = db.jugadoras.filter(j => j.nombreCompleto.toLowerCase().includes(searchTerm));
            renderJugadoras(filteredJugadoras);
        }
    });

    // --- LÓGICA DEL MENÚ LATERAL ---
    const toggleMenu = () => {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('show');
    };

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    sideMenu.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.dataset.section) {
            e.preventDefault();
            const sectionName = link.dataset.section;
            renderSection(sectionName);
            // Opcional: quitar la clase activa de la tab-bar si se navega desde el menú
            const activeTab = document.querySelector('.tab-item.active');
            if(activeTab) activeTab.classList.remove('active');
            toggleMenu(); // Cierra el menú después de la navegación
        }
    });

    // --- INICIALIZACIÓN ---
    renderSideMenu();
    renderSection('inicio');
});
