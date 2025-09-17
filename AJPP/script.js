document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');
    const bottomNav = document.getElementById('bottom-nav');
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.getElementById('main-content');
    const sections = document.querySelectorAll('#main-content section');
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const sideMenuLinks = document.querySelectorAll('#side-menu a');

    // 1. Splash Screen Fade Out
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.remove();
            appContainer.classList.remove('hidden');
        });
    }, 2000); // Show splash screen for 2 seconds

    // 2. Bottom Navigation Logic
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSectionId = item.dataset.section;

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked nav item
            item.classList.add('active');

            // Hide all sections and show the target section
            sections.forEach(section => {
                section.classList.add('hidden-section');
            });
            document.getElementById(targetSectionId).classList.remove('hidden-section');

            // Close side menu if open
            sideMenu.classList.remove('open');
        });
    });

    // 3. Side Menu Toggle
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });

    // 4. Side Menu Navigation Logic
    sideMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSectionId = link.dataset.section;

            // Hide all sections and show the target section
            sections.forEach(section => {
                section.classList.add('hidden-section');
            });
            document.getElementById(targetSectionId).classList.remove('hidden-section');

            // Close side menu
            sideMenu.classList.remove('open');

            // Deactivate all bottom nav items
            navItems.forEach(nav => nav.classList.remove('active'));
        });
    });

    // Initial state: ensure Home is active and others are hidden
    document.getElementById('home').classList.remove('hidden-section');
    navItems[0].classList.add('active'); // Assuming Home is the first item

    // Sample Player Data (replace with actual data later)
    const playersData = [
        {
            nombreCompleto: 'María Sánchez',
            fotoPerfil: 'https://via.placeholder.com/150x150?text=Maria+S',
            rankingActual: 1,
            edad: 28,
            posicion: 'Revés',
            biografia: 'Jugadora destacada con múltiples títulos nacionales e internacionales. Conocida por su potente remate y su visión de juego.',
            paletaActual: 'Bullpadel Vertex 03',
            patrocinadores: [
                { name: 'Bullpadel', logo: 'https://via.placeholder.com/50x30?text=Bullpadel' },
                { name: 'Adidas', logo: 'https://via.placeholder.com/50x30?text=Adidas' }
            ],
            estadisticas: {
                partidosJugados: 150,
                victorias: 120,
                derrotas: 30,
                titulosTemporada: 5
            },
            socialMedia: {
                instagram: 'https://instagram.com/mariasanz_padel',
                facebook: 'https://facebook.com/mariasanzpadel',
                youtube: 'https://youtube.com/mariasanzpadel'
            },
            fanChannelPosts: [
                { id: 1, author: 'María Sánchez', text: '¡Gran victoria hoy en el torneo de Buenos Aires! Gracias a todos por el apoyo.', imageUrl: 'https://via.placeholder.com/300x200?text=Victoria', date: '2023-09-15', likes: 250, comments: [{ user: 'Fan1', text: '¡Felicidades, campeona!' }] },
                { id: 2, author: 'María Sánchez', text: 'Entrenando duro para el próximo desafío. 💪 #PadelLife', imageUrl: '', date: '2023-09-12', likes: 180, comments: [{ user: 'Fan2', text: '¡Vamos María!' }] }
            ]
        },
        {
            nombreCompleto: 'Laura Gómez',
            fotoPerfil: 'https://via.placeholder.com/150x150?text=Laura+G',
            rankingActual: 2,
            edad: 26,
            posicion: 'Drive',
            biografia: 'Especialista en la defensa y el control de la bola. Su agilidad en la pista la convierte en una rival formidable.',
            paletaActual: 'Nox AT10 Luxury Genius',
            patrocinadores: [
                { name: 'Nox', logo: 'https://via.placeholder.com/50x30?text=Nox' },
                { name: 'Head', logo: 'https://via.placeholder.com/50x30?text=Head' }
            ],
            estadisticas: {
                partidosJugados: 130,
                victorias: 100,
                derrotas: 30,
                titulosTemporada: 3
            },
            socialMedia: {
                instagram: 'https://instagram.com/lauragomez_padel',
                facebook: 'https://facebook.com/lauragomezpadel',
                youtube: ''
            },
            fanChannelPosts: [
                { id: 1, author: 'Laura Gómez', text: 'Lista para el próximo partido. ¡A darlo todo!', imageUrl: 'https://via.placeholder.com/300x200?text=Entrenamiento', date: '2023-09-14', likes: 190, comments: [{ user: 'Fan3', text: '¡Mucha suerte!' }] }
            ]
        },
        {
            nombreCompleto: 'Ana Fernández',
            fotoPerfil: 'https://via.placeholder.com/150x150?text=Ana+F',
            rankingActual: 3,
            edad: 29,
            posicion: 'Revés',
            biografia: 'Conocida por su juego agresivo y su capacidad para definir puntos desde cualquier posición de la pista.',
            paletaActual: 'Adidas Metalbone HRD 3.2',
            patrocinadores: [
                { name: 'Adidas', logo: 'https://via.placeholder.com/50x30?text=Adidas' },
                { name: 'Wilson', logo: 'https://via.placeholder.com/50x30?text=Wilson' }
            ],
            estadisticas: {
                partidosJugados: 160,
                victorias: 115,
                derrotas: 45,
                titulosTemporada: 4
            },
            socialMedia: {
                instagram: 'https://instagram.com/anafernandez_padel',
                facebook: '',
                youtube: ''
            },
            fanChannelPosts: [
                { id: 1, author: 'Ana Fernández', text: '¡Qué semana tan intensa! A seguir trabajando.', imageUrl: '', date: '2023-09-13', likes: 150, comments: [] }
            ]
        },
        {
            nombreCompleto: 'Sofía Pérez',
            fotoPerfil: 'https://via.placeholder.com/150x150?text=Sofia+P',
            rankingActual: 4,
            edad: 25,
            posicion: 'Drive',
            biografia: 'Joven promesa con un futuro brillante. Su velocidad y reflejos la hacen imparable en la red.',
            paletaActual: 'StarVie Triton Pro',
            patrocinadores: [
                { name: 'StarVie', logo: 'https://via.placeholder.com/50x30?text=StarVie' }
            ],
            estadisticas: {
                partidosJugados: 110,
                victorias: 85,
                derrotas: 25,
                titulosTemporada: 2
            },
            socialMedia: {
                instagram: 'https://instagram.com/sofiaperez_padel',
                facebook: '',
                youtube: ''
            },
            fanChannelPosts: [
                { id: 1, author: 'Sofía Pérez', text: '¡Disfrutando cada momento en la pista!', imageUrl: 'https://via.placeholder.com/300x200?text=PadelFun', date: '2023-09-11', likes: 170, comments: [] }
            ]
        },
        {
            nombreCompleto: 'Elena Ruiz',
            fotoPerfil: 'https://via.placeholder.com/150x150?text=Elena+R',
            rankingActual: 5,
            edad: 30,
            posicion: 'Revés',
            biografia: 'Veterana del circuito con una gran experiencia. Su inteligencia táctica es su mayor arma.',
            paletaActual: 'Varlion Bourne Summum',
            patrocinadores: [
                { name: 'Varlion', logo: 'https://via.placeholder.com/50x30?text=Varlion' },
                { name: 'Joma', logo: 'https://via.placeholder.com/50x30?text=Joma' }
            ],
            estadisticas: {
                partidosJugados: 180,
                victorias: 130,
                derrotas: 50,
                titulosTemporada: 1
            },
            socialMedia: {
                instagram: 'https://instagram.com/elenaruiz_padel',
                facebook: '',
                youtube: ''
            },
            fanChannelPosts: [
                { id: 1, author: 'Elena Ruiz', text: 'Un día más, un paso más. Siempre aprendiendo.', imageUrl: '', date: '2023-09-10', likes: 120, comments: [] }
            ]
        }
    ];

    const playerListContainer = document.getElementById('player-list-container');
    const playerSearchInput = document.getElementById('player-search');
    const playerProfileDetailSection = document.getElementById('player-profile-detail');
    const playerProfileContent = document.getElementById('player-profile-content');
    const backButton = document.querySelector('#player-profile-detail .back-button');

    function renderPlayerList(players) {
        playerListContainer.innerHTML = '';
        players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            playerCard.dataset.player = player.nombreCompleto; // Store player name for easy lookup
            playerCard.innerHTML = `
                <img src="${player.fotoPerfil}" alt="${player.nombreCompleto}">
                <div>
                    <h3>${player.nombreCompleto}</h3>
                    <p>Ranking: #${player.rankingActual}</p>
                </div>
            `;
            playerListContainer.appendChild(playerCard);

            playerCard.addEventListener('click', () => {
                renderPlayerProfile(player);
                document.getElementById('jugadoras').classList.add('hidden-section');
                playerProfileDetailSection.classList.remove('hidden-section');
            });
        });
    }

    function renderPlayerProfile(player) {
        playerProfileContent.innerHTML = `
            <div class="player-profile-header">
                <img src="${player.fotoPerfil}" alt="${player.nombreCompleto}">
                <h2>${player.nombreCompleto}</h2>
                <p>Ranking Actual: #${player.rankingActual}</p>
                <p>${player.edad} años | Posición: ${player.posicion}</p>
            </div>

            <h3 class="profile-section-title">Biografía</h3>
            <p>${player.biografia}</p>

            <h3 class="profile-section-title">Detalles</h3>
            <div class="profile-info-grid">
                <div class="profile-info-item">
                    <strong>Paleta Actual</strong>
                    <span>${player.paletaActual}</span>
                </div>
                <div class="profile-info-item">
                    <strong>Partidos Jugados</strong>
                    <span>${player.estadisticas.partidosJugados}</span>
                </div>
                <div class="profile-info-item">
                    <strong>Victorias</strong>
                    <span>${player.estadisticas.victorias}</span>
                </div>
                <div class="profile-info-item">
                    <strong>Títulos Temporada</strong>
                    <span>${player.estadisticas.titulosTemporada}</span>
                </div>
            </div>

            ${player.patrocinadores.length > 0 ? `
            <h3 class="profile-section-title">Patrocinadores</h3>
            <div class="patrocinadores-list">
                ${player.patrocinadores.map(sponsor => `
                    <div class="patrocinador-item">
                        <img src="${sponsor.logo}" alt="${sponsor.name}">
                        <span>${sponsor.name}</span>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <h3 class="profile-section-title">Canal de Fans</h3>
            <div class="fan-channel">
                <div class="post-input">
                    <textarea placeholder="Escribe un mensaje para tus fans..."></textarea>
                    <button>Publicar</button>
                </div>
                ${player.fanChannelPosts.map(post => `
                    <div class="fan-channel-post">
                        <p class="post-meta">${post.author} - ${new Date(post.date).toLocaleDateString()}</p>
                        <p>${post.text}</p>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image">` : ''}
                        <div class="post-actions">
                            <button><i class="fas fa-heart"></i> ${post.likes}</button>
                            <button><i class="fas fa-comment"></i> ${post.comments.length}</button>
                        </div>
                        ${post.comments.length > 0 ? `
                        <div class="post-comments">
                            ${post.comments.map(comment => `<p class="post-comment"><strong>${comment.user}:</strong> ${comment.text}</p>`).join('')}
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            <h3 class="profile-section-title">Redes Sociales</h3>
            <div class="social-media-links">
                ${player.socialMedia.instagram ? `<a href="${player.socialMedia.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                ${player.socialMedia.facebook ? `<a href="${player.socialMedia.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>` : ''}
                ${player.socialMedia.youtube ? `<a href="${player.socialMedia.youtube}" target="_blank"><i class="fab fa-youtube"></i></a>` : ''}
            </div>
        `;
    }

    // Search functionality
    playerSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPlayers = playersData.filter(player => 
            player.nombreCompleto.toLowerCase().includes(searchTerm)
        );
        renderPlayerList(filteredPlayers);
    });

    // Back button for player profile
    backButton.addEventListener('click', () => {
        playerProfileDetailSection.classList.add('hidden-section');
        document.getElementById('jugadoras').classList.remove('hidden-section');
    });

    // Initial render of player list
    renderPlayerList(playersData);

    // Sample Tournament Data
    const tournamentsData = [
        {
            id: 1,
            nombre: 'AJPP Damas - Chivilcoy 1100',
            fechas: '20-25 Septiembre',
            sede: 'Chivilcoy',
            localidad: 'Buenos Aires',
            puntos: 1100,
            estado: 'Confirmado',
            cuadroJuego: 'https://via.placeholder.com/400x300?text=Cuadro+Chivilcoy',
            resultados: 'https://via.placeholder.com/400x300?text=Resultados+Chivilcoy'
        },
        {
            id: 2,
            nombre: 'AJPP Damas - Rosario 800',
            fechas: '05-10 Octubre',
            sede: 'Rosario',
            localidad: 'Santa Fe',
            puntos: 800,
            estado: 'Programado',
            cuadroJuego: 'https://via.placeholder.com/400x300?text=Cuadro+Rosario',
            resultados: 'https://via.placeholder.com/400x300?text=Resultados+Rosario'
        },
        {
            id: 3,
            nombre: 'AJPP Damas - Córdoba Master',
            fechas: '20-26 Octubre',
            sede: 'Córdoba',
            localidad: 'Córdoba',
            puntos: 1500,
            estado: 'En Curso',
            cuadroJuego: 'https://via.placeholder.com/400x300?text=Cuadro+Cordoba',
            resultados: 'https://via.placeholder.com/400x300?text=Resultados+Cordoba'
        }
    ];

    const tournamentListContainer = document.getElementById('tournament-list-container');
    const tournamentDetailSection = document.getElementById('tournament-detail');
    const tournamentDetailContent = document.getElementById('tournament-detail-content');
    const backButtonTournament = document.querySelector('#tournament-detail .back-button');

    function renderTournamentList(tournaments) {
        tournamentListContainer.innerHTML = '';
        tournaments.forEach(tournament => {
            const tournamentCard = document.createElement('div');
            tournamentCard.classList.add('tournament-card');
            tournamentCard.innerHTML = `
                <div>
                    <h3>${tournament.nombre}</h3>
                    <p>Fechas: ${tournament.fechas}</p>
                    <p>Sede: ${tournament.sede}, ${tournament.localidad}</p>
                    <p>Puntos: ${tournament.puntos}</p>
                    <p>Estado: <strong>${tournament.estado}</strong></p>
                </div>
            `;
            tournamentListContainer.appendChild(tournamentCard);

            tournamentCard.addEventListener('click', () => {
                renderTournamentDetail(tournament);
                document.getElementById('calendario').classList.add('hidden-section');
                tournamentDetailSection.classList.remove('hidden-section');
            });
        });
    }

    function renderTournamentDetail(tournament) {
        tournamentDetailContent.innerHTML = `
            <div class="tournament-detail-header">
                <h2>${tournament.nombre}</h2>
                <p>Fechas: ${tournament.fechas}</p>
                <p>Sede: ${tournament.sede}, ${tournament.localidad}</p>
                <p>Puntos: ${tournament.puntos}</p>
                <p>Estado: <strong>${tournament.estado}</strong></p>
            </div>

            <h3 class="profile-section-title">Cuadro de Juego</h3>
            <img src="${tournament.cuadroJuego}" alt="Cuadro de Juego" style="max-width: 100%; height: auto; margin-bottom: 20px;">

            <h3 class="profile-section-title">Resultados</h3>
            <img src="${tournament.resultados}" alt="Resultados" style="max-width: 100%; height: auto;">
        `;
    }

    // Back button for tournament detail
    backButtonTournament.addEventListener('click', () => {
        tournamentDetailSection.classList.add('hidden-section');
        document.getElementById('calendario').classList.remove('hidden-section');
    });

    // Initial render of tournament list
    renderTournamentList(tournamentsData);

    // Sample Ranking Data
    const individualRankingData = [
        { posicion: 1, nombre: 'María Sánchez', provincia: 'Buenos Aires', puntos: 10000 },
        { posicion: 2, nombre: 'Laura Gómez', provincia: 'Santa Fe', puntos: 9500 },
        { posicion: 3, nombre: 'Ana Fernández', provincia: 'Córdoba', puntos: 9200 },
        { posicion: 4, nombre: 'Sofía Pérez', provincia: 'Mendoza', puntos: 8800 },
        { posicion: 5, nombre: 'Elena Ruiz', provincia: 'Buenos Aires', puntos: 8500 }
    ];

    const parejasRankingData = [
        { posicion: 1, nombres: 'Sánchez / Gómez', puntos: 18000 },
        { posicion: 2, nombres: 'Fernández / Pérez', puntos: 17500 },
        { posicion: 3, nombres: 'Ruiz / Martínez', puntos: 16000 }
    ];

    const individualRankingList = document.getElementById('individual-ranking-list');
    const parejasRankingList = document.getElementById('parejas-ranking-list');
    const individualSearchInput = document.getElementById('individual-search');
    const rankingTabButtons = document.querySelectorAll('.tabs .tab-button');
    const rankingTabContents = document.querySelectorAll('#rankings .tab-content');

    function renderIndividualRanking(ranking) {
        individualRankingList.innerHTML = '';
        ranking.forEach(player => {
            const listItem = document.createElement('div');
            listItem.classList.add('ranking-item');
            listItem.innerHTML = `
                <span>#${player.posicion}</span>
                <span>${player.nombre} (${player.provincia})</span>
                <span>${player.puntos} pts</span>
            `;
            individualRankingList.appendChild(listItem);
        });
    }

    function renderParejasRanking(ranking) {
        parejasRankingList.innerHTML = '';
        ranking.forEach(pair => {
            const listItem = document.createElement('div');
            listItem.classList.add('ranking-item');
            listItem.innerHTML = `
                <span>#${pair.posicion}</span>
                <span>${pair.nombres}</span>
                <span>${pair.puntos} pts</span>
            `;
            parejasRankingList.appendChild(listItem);
        });
    }

    // Tab switching logic for Rankings
    rankingTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            rankingTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            rankingTabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(button.dataset.tab).classList.remove('hidden');
        });
    });

    // Search functionality for individual ranking
    individualSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredRanking = individualRankingData.filter(player => 
            player.nombre.toLowerCase().includes(searchTerm)
        );
        renderIndividualRanking(filteredRanking);
    });

    // Initial render of rankings
    renderIndividualRanking(individualRankingData);
    renderParejasRanking(parejasRankingData);

    // Sample Live Matches Data
    const liveMatchesData = [
        {
            id: 1,
            jugadoras: 'María Sánchez / Laura Gómez vs Ana Fernández / Sofía Pérez',
            marcador: '6-3, 4-5 (en juego)',
            estadisticas: 'Duración: 1h 15min, Aces: 5',
            streaming: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder YouTube embed URL
        },
        {
            id: 2,
            jugadoras: 'Elena Ruiz / Carla Díaz vs Martina López / Julia Castro',
            marcador: '2-6, 1-0 (en juego)',
            estadisticas: 'Duración: 45min, Aces: 2',
            streaming: '' // No streaming for this match
        }
    ];

    const liveMatchesContainer = document.getElementById('live-matches-container');

    function renderLiveMatches(matches) {
        liveMatchesContainer.innerHTML = '';
        if (matches.length === 0) {
            liveMatchesContainer.innerHTML = '<p>No hay partidos en vivo en este momento.</p>';
            return;
        }
        matches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.classList.add('live-match-card');
            matchCard.innerHTML = `
                <h3>${match.jugadoras}</h3>
                <p>Marcador: <strong>${match.marcador}</strong></p>
                <p>${match.estadisticas}</p>
                ${match.streaming ? `
                    <div class="video-container">
                        <iframe src="${match.streaming}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                ` : '<p>Streaming no disponible.</p>'}
            `;
            liveMatchesContainer.appendChild(matchCard);
        });
    }

    // Initial render of live matches
    renderLiveMatches(liveMatchesData);

    // Sample News Data
    const newsData = [
        { id: 1, title: 'María Sánchez gana el Master de Buenos Aires', imageUrl: 'https://via.placeholder.com/100x70?text=Noticia1', date: '2023-09-15' },
        { id: 2, title: 'Nuevas incorporaciones al circuito AJPP Damas', imageUrl: 'https://via.placeholder.com/100x70?text=Noticia2', date: '2023-09-14' },
        { id: 3, title: 'Entrevista exclusiva con Laura Gómez', imageUrl: 'https://via.placeholder.com/100x70?text=Noticia3', date: '2023-09-13' }
    ];

    const nextTournamentContainer = document.getElementById('next-tournament-container');
    const top5RankingContainer = document.getElementById('top-5-ranking-container');
    const recentNewsContainer = document.getElementById('recent-news-container');
    const liveAccessBannerContainer = document.getElementById('live-access-banner-container');

    function renderHomeSection() {
        // Próximo Torneo
        const nextTournament = tournamentsData.find(t => t.estado === 'Programado' || t.estado === 'Confirmado');
        if (nextTournament) {
            nextTournamentContainer.innerHTML = `
                <div class="card">
                    <h3>Próximo Torneo</h3>
                    <p>${nextTournament.nombre}</p>
                    <p>Fechas: ${nextTournament.fechas}</p>
                    <p>Sede: ${nextTournament.sede}</p>
                </div>
            `;
        } else {
            nextTournamentContainer.innerHTML = '<p>No hay próximos torneos programados.</p>';
        }

        // Top 5 Ranking
        top5RankingContainer.innerHTML = `
            <div class="card">
                <h3>Top 5 Ranking</h3>
                <ul>
                    ${individualRankingData.slice(0, 5).map(player => {
                        const fullPlayer = playersData.find(p => p.nombreCompleto === player.nombre);
                        return `
                            <li>
                                <img src="${fullPlayer ? fullPlayer.fotoPerfil : 'https://via.placeholder.com/30x30?text=Jug'}" alt="${player.nombre}" style="width:30px; height:30px; border-radius:50%; margin-right:5px;">
                                #${player.posicion} ${player.nombre}
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>
        `;

        // Noticias Recientes
        recentNewsContainer.innerHTML = `
            <div class="card">
                <h3>Noticias Recientes</h3>
                <div class="news-feed">
                    ${newsData.map(news => `
                        <div class="news-item" style="display:flex; align-items:center; margin-bottom:10px;">
                            <img src="${news.imageUrl}" alt="${news.title}" style="width:60px; height:40px; object-fit:cover; margin-right:10px; border-radius:3px;">
                            <div>
                                <h4>${news.title}</h4>
                                <p style="font-size:0.8em; color:#666;">${new Date(news.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Acceso a "AJPP en Vivo"
        const hasLiveMatches = liveMatchesData.length > 0;
        liveAccessBannerContainer.innerHTML = `
            <div class="banner ${hasLiveMatches ? 'live-active' : ''}" style="cursor:pointer;" data-section="en-vivo">
                <h3>AJPP en Vivo</h3>
                <p>${hasLiveMatches ? '¡Partido(s) en directo! Haz clic para ver.' : 'No hay partidos en vivo en este momento.'}</p>
            </div>
        `;
        if (hasLiveMatches) {
            liveAccessBannerContainer.querySelector('.banner').addEventListener('click', () => {
                // Simulate navigation to "En Vivo" section
                navItems.forEach(nav => nav.classList.remove('active'));
                document.querySelector('.nav-item[data-section="en-vivo"]').classList.add('active');
                sections.forEach(section => section.classList.add('hidden-section'));
                document.getElementById('en-vivo').classList.remove('hidden-section');
            });
        }
    }

    // Initial render of Home section
    renderHomeSection();
});
