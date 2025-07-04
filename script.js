// --- Datos de Ejemplo (ACTUALIZADOS) ---
const datosClips = [ 
    { id: 1, titulo: "¡Victoria épica en el último segundo!", creador: "AlexGamer_Pro", avatar: "1", likes: "12.3K", enVivo: true, categoria: "Gaming", duracion: "0:45", videoUrl: "videos/Rocket.mp4" }, 
    { id: 2, titulo: "El golazo que nadie esperaba", creador: "SarahSports_", avatar: "2", likes: "8.7K", enVivo: false, categoria: "Sports", duracion: "0:23", videoUrl: "videos/Fifa.mp4" }, 
    { id: 3, titulo: "Mi reacción al nuevo trailer", creador: "MikeReacts_TV", avatar: "3", likes: "15.2K", enVivo: true, categoria: "Entertainment", duracion: "1:12", videoUrl: "videos/Trailereaccion.mp4" }, 
    { id: 4, titulo: "Cocinando la mejor pasta carbonara", creador: "ChefLuisa_", avatar: "4", likes: "9.1K", enVivo: false, categoria: "Cooking", duracion: "2:05", videoUrl: "videos/PastaCarbo.mp4" }, 
    { id: 5, titulo: "El secreto de CSS Grid en 2 minutos", creador: "CodeWizard_YT", avatar: "5", likes: "5.5K", enVivo: false, categoria: "Education", duracion: "1:40", videoUrl: "videos/CSSgrid.mp4" }, 
    { id: 6, titulo: "Meditación para empezar el día", creador: "ZenMind_Flow", avatar: "6", likes: "7.8K", enVivo: false, categoria: "Wellness", duracion: "0:58", videoUrl: "videos/Meditacion.mp4" }, 
];
const datosStreamers = [ 
    { id: 1, nombre: "AlexGamer_Pro", avatar: "1", seguidores: "1.2M", enVivo: true, categoria: "Gaming", viewers: 3200, liveVideoUrl: "videos/RocketVideo.mp4", streamTitle: "Rankeds con Subs! | !sorteo", tags: ["Rocket League", "Competitivo", "Español"] }, 
    { id: 2, nombre: "SarahSports_", avatar: "2", seguidores: "850K", enVivo: false, categoria: "Sports", viewers: 0 }, 
    { id: 3, nombre: "MikeReacts_TV", avatar: "3", seguidores: "1.5M", enVivo: true, categoria: "Entertainment", viewers: 5100, liveVideoUrl: "videos/ReaccionVideo.mp4", streamTitle: "Analizando la nueva generación de consolas", tags: ["Gaming", "Consolas", "Debate"] }, 
    { id: 4, nombre: "ChefLuisa_", avatar: "4", seguidores: "920K", enVivo: false, categoria: "Cooking", viewers: 0 }, 
    { id: 5, nombre: "CodeWizard_YT", avatar: "5", seguidores: "600K", enVivo: false, categoria: "Education", viewers: 0 }, 
    { id: 6, nombre: "ZenMind_Flow", avatar: "6", seguidores: "750K", enVivo: false, categoria: "Wellness", viewers: 0 }, 
];
const datosCategorias = [ { nombre: "Gaming", cantidad: "1.2K", icono: "🎮" }, { nombre: "Music", cantidad: "987", icono: "🎵" }, { nombre: "Entertainment", cantidad: "1.5K", icono: "🎭" }, { nombre: "Sports", cantidad: "876", icono: "⚽" }, { nombre: "Cooking", cantidad: "654", icono: "👨‍🍳" }, { nombre: "Education", cantidad: "523", icono: "📚" }, ];

// Objeto con chats para cada streamer (ACTUALIZADO)
const datosChats = {
    1: [ // Chat para AlexGamer_Pro (id: 1)
        { usuario: "StreamMod", texto: "¡Recuerden ser respetuosos en el chat! Buena vibra para todos.", rol: "mod" },
        { usuario: "RocketFan_99", texto: "¡Qué buena partida! 🔥", rol: "user" },
        { usuario: "VIP_Alex", texto: "¡Vamos Alex, tú puedes!", rol: "vip" },
        { usuario: "Lola", texto: "Primera vez aquí, ¡qué nivel!", rol: "user" },
    ],
    3: [ // Chat para MikeReacts_TV (id: 3)
        { usuario: "GamerVIP", texto: "¿Creen que la nueva PS5 Pro valga la pena?", rol: "vip" },
        { usuario: "XboxFan", texto: "Aguante Xbox, ¡el Game Pass es imbatible!", rol: "user" },
        { usuario: "ModeradorTech", texto: "Chicos, mantengamos el debate sano. Sin fanatismos.", rol: "mod" },
        { usuario: "MikeFan_1", texto: "¡Mike, tu análisis es el mejor!", rol: "user" },
        { usuario: "SwitchPlayer", texto: "Yo sigo feliz con mi Nintendo Switch jaja saludos!", rol: "user" },
    ]
};

// --- Lógica de la Aplicación ---
let vistaActual = "inicio";
let clipActual = 0;
let streamerSeleccionado = null;
let mensajesChatActual = []; 
let clipsConLike = [];
let clipsGuardados = [];
let canalesSeguidos = [3]; 
let modalVideo = null;
let offlineStreamerModal = null;
let configuracion = { calidadVideo: "auto", notificacionesPush: true, notificacionesSonido: true, reproduccionAutomatica: true, volumen: 1.0, mute: true };

// Variables para la navegación táctil (NUEVO)
let touchStartX = 0;
let touchEndX = 0;

$(document).ready(() => {
    modalVideo = new bootstrap.Modal(document.getElementById("videoModal"));
    offlineStreamerModal = new bootstrap.Modal(document.getElementById("offlineModal"));
    cargarConfiguracion();
    inicializarEventos();
    cargarContenidoInicial();
});

function inicializarEventos() {
    // Eventos de Navegación
    $(".nav-item").click(function () { 
        cambiarVista($(this).data("view")); 
        if ($(window).width() <= 992) {
            toggleSidebar(false);
        }
    });

    // Eventos de UI Móvil
    $("#menu-toggle-btn").click(() => toggleSidebar());
    $("#sidebar-overlay").click(() => toggleSidebar(false));

    // Eventos para navegación táctil en Wavves (NUEVO)
    // Se usa .on() para delegar el evento, ya que el contenido se carga dinámicamente
    $('#wavves-container').on('touchstart', '#current-clip-container', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    $('#wavves-container').on('touchend', '#current-clip-container', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    // Otros eventos
    $("#searchInput").on("input", function () {
        const consultaBusqueda = $(this).val();
        actualizarStreamersFiltrados(consultaBusqueda);
    });
    $("#chatInput").keypress((e) => { if (e.which == 13) enviarMensajeChat(); });
    $("#videoQuality, #pushNotifications, #soundNotifications, #autoplay").change(guardarConfiguracion);
    
    $('#videoModal').on('hidden.bs.modal', function () {
        const videoContainer = document.getElementById('modal-video-container');
        videoContainer.innerHTML = ''; 
    });
}

// Función para manejar el deslizamiento (NUEVO)
function handleSwipe() {
    const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe
    if (touchEndX < touchStartX - swipeThreshold) {
        clipSiguiente();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        clipAnterior();
    }
}

function toggleSidebar(open) {
    const isOpen = $("#sidebar").hasClass("open");
    const action = (typeof open === 'undefined') ? !isOpen : open;

    if (action) {
        $("#sidebar").addClass("open");
        $("#sidebar-overlay").addClass("active");
    } else {
        $("#sidebar").removeClass("open");
        $("#sidebar-overlay").removeClass("active");
    }
}

function cargarContenidoInicial() {
    cargarWavvesDestacados();
    cargarStreamsDestacados();
    cargarCategorias();
    cargarStreamersRecomendados();
    actualizarStreamersFiltrados("");
    cargarFeedWavves();
}

function cambiarVista(vista) {
    vistaActual = vista;
    $(".nav-item").removeClass("active");
    $(`.nav-item[data-view="${vista}"]`).addClass("active");
    $(".view").removeClass("active");
    $(`#${vista}-view`).addClass("active");
    $("#rightSidebar").toggle(vista === "inicio" || vista === "explorar");
    
    const wavveVideo = document.getElementById('wavve-video');
    if (vista !== 'wavves' && wavveVideo) {
        wavveVideo.pause();
    } else if (vista === 'wavves' && wavveVideo && configuracion.reproduccionAutomatica) {
        wavveVideo.play().catch(e => console.log("La reproducción automática fue bloqueada."));
    }

    if (vista === "siguiendo") cargarStreamersSiguiendo();
    if (vista === "guardados") cargarClipsGuardados();
    window.scrollTo(0, 0);
}

function cargarStreamsDestacados() {
    let html = "";
    const streamsEnVivo = datosStreamers.filter(s => s.enVivo);

    streamsEnVivo.forEach(streamer => {
        let imageUrl = `https://placehold.co/600x400/141414/EAEAEA?text=${streamer.categoria}`;
        if (streamer.nombre === 'AlexGamer_Pro') {
            imageUrl = 'imagenes/Rocket2.png';
        } else if (streamer.nombre === 'MikeReacts_TV') {
            imageUrl = 'imagenes/Reaccion2.png';
        }

        html += `
            <div class="col-md-6 mb-4">
                <div class="card h-100" onclick="manejarClickStreamer('${streamer.nombre}')">
                    <div class="position-relative clip-thumbnail clip-thumbnail-horizontal">
                        <img class="w-100 h-100" style="object-fit: cover;" src="${imageUrl}" alt="Stream de ${streamer.nombre}">
                        <div class="video-overlay"><i class="fas fa-play fa-2x text-white"></i></div>
                        <span class="badge badge-live position-absolute top-0 start-0 m-2">EN VIVO</span>
                        <span class="badge bg-dark text-white position-absolute bottom-0 end-0 m-2"><i class="fas fa-eye me-1"></i> ${streamer.viewers.toLocaleString()}</span>
                    </div>
                    <div class="card-body d-flex align-items-center gap-3">
                        <img src="https://placehold.co/40x40/00f7ff/0A0A0A?text=${streamer.nombre.charAt(0)}" class="avatar" alt="${streamer.nombre}">
                        <div>
                            <p class="fw-bold text-white mb-0 text-truncate">${streamer.nombre}</p>
                            <span class="text-secondary small">${streamer.categoria}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    $("#featured-streams").html(html);
}

function cargarWavvesDestacados() {
    let html = "";
    datosClips.slice(0, 3).forEach(clip => {
        html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100" onclick="manejarClickClip(${clip.id})">
                    <div class="position-relative clip-thumbnail clip-thumbnail-vertical">
                        <video muted loop playsinline class="w-100 h-100" style="object-fit: cover;" src="${clip.videoUrl}" onmouseenter="this.play()" onmouseleave="this.pause()"></video>
                        <div class="video-overlay"><i class="fas fa-play fa-2x text-white"></i></div>
                        ${clip.enVivo ? '<span class="badge badge-live position-absolute top-0 start-0 m-2">LIVE</span>' : ''}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="clip-title fw-bold text-white mb-2">${clip.titulo}</p>
                        <div class="d-flex align-items-center mt-auto">
                            <img src="https://placehold.co/40x40/00f7ff/0A0A0A?text=${clip.creador.charAt(0)}" class="avatar me-2" alt="${clip.creador}" style="width: 24px; height: 24px; border-width: 1px;">
                            <span class="clip-creator-name text-secondary small">${clip.creador}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    $("#latest-clips").html(html);
}

function cargarCategorias() {
    let html = "";
    datosCategorias.forEach(cat => {
        html += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card h-100" onclick="filtrarPorCategoria('${cat.nombre}')">
                    <a href="#" class="category-card">
                        <div class="category-icon">${cat.icono}</div>
                        <div class="category-name">${cat.nombre}</div>
                        <div class="category-count">${cat.cantidad} streamers</div>
                    </a>
                </div>
            </div>`;
    });
    $("#categories-grid").html(html);
}

function cargarStreamersRecomendados() {
    let html = "";
    datosStreamers.slice(0, 4).forEach(streamer => {
        html += `
            <div class="d-flex align-items-center gap-3 cursor-pointer" onclick="manejarClickStreamer('${streamer.nombre}')">
                <div class="position-relative">
                    <img src="https://placehold.co/40x40/32ff6a/0A0A0A?text=${streamer.nombre.charAt(0)}" class="avatar" alt="${streamer.nombre}">
                    ${streamer.enVivo ? '<span class="live-dot" style="position: absolute; bottom: 0px; right: 0px; border: 2px solid var(--bg-primary);"></span>' : ''}
                </div>
                <div class="flex-grow-1">
                    <div class="streamer-name text-white fw-bold small">${streamer.nombre}</div>
                    <div class="streamer-followers text-secondary small">${streamer.enVivo ? `${streamer.viewers.toLocaleString()} Viendo` : `${streamer.seguidores} Seguidores`}</div>
                </div>
                 ${!streamer.enVivo ? '<span class="badge bg-secondary text-white small">Offline</span>' : ''}
            </div>`;
    });
    $("#recommended-streamers").html(html);
}

function actualizarStreamersFiltrados(consulta) {
    const streamersFiltrados = datosStreamers.filter(s => s.nombre.toLowerCase().includes(consulta.toLowerCase()));
    mostrarStreamersFiltrados(streamersFiltrados);
}

function mostrarStreamersFiltrados(streamers) {
    let html = "";
    if (streamers.length > 0) {
        streamers.forEach(streamer => {
            html += `
            <div class="card" onclick="manejarClickStreamer('${streamer.nombre}')">
                <div class="card-body d-flex align-items-center gap-3">
                     <img src="https://placehold.co/48x48/00f7ff/0A0A0A?text=${streamer.nombre.charAt(0)}" class="avatar" style="width: 48px; height: 48px;" alt="${streamer.nombre}">
                     <div class="flex-grow-1">
                        <h6 class="text-white mb-1">${streamer.nombre} ${streamer.enVivo ? '<span class="badge badge-live small">LIVE</span>' : ''}</h6>
                        <p class="text-muted small mb-1">${streamer.categoria}</p>
                     </div>
                     <span class="text-secondary small d-flex align-items-center gap-2"><i class="fas fa-eye"></i> ${streamer.enVivo ? streamer.viewers.toLocaleString() : streamer.seguidores}</span>
                </div>
            </div>`;
        });
    } else {
        html = `<p class="text-muted text-center py-5">No se encontraron streamers.</p>`;
    }
    $("#filtered-streamers").html(html);
    $("#streamers-count").text(`(${streamers.length})`);
}

function filtrarPorCategoria(categoria) {
    const streamersFiltrados = datosStreamers.filter(s => s.categoria === categoria);
    cambiarVista('explorar');
    mostrarStreamersFiltrados(streamersFiltrados);
    $("#streamers-title").text(`Streamers de ${categoria}`);
    $("#reset-filter-btn").removeClass("d-none");
}

function resetStreamerFilter() {
    actualizarStreamersFiltrados("");
    $("#streamers-title").text("Todos los Streamers");
    $("#reset-filter-btn").addClass("d-none");
}

function cargarStreamersSiguiendo() {
    let liveHtml = "", offlineHtml = "";
    const seguidos = datosStreamers.filter(s => canalesSeguidos.includes(s.id));
    seguidos.forEach(s => {
        const cardHtml = `
            <div class="card" onclick="manejarClickStreamer('${s.nombre}')">
                <div class="card-body d-flex align-items-center gap-3">
                    <img src="https://placehold.co/48x48/00f7ff/0A0A0A?text=${s.nombre.charAt(0)}" class="avatar" style="width: 48px; height: 48px;" alt="${s.nombre}">
                    <div class="flex-grow-1">
                        <h6 class="text-white mb-1">${s.nombre}</h6>
                        <p class="text-muted small mb-0">${s.categoria}</p>
                    </div>
                    ${s.enVivo ? `<span class="badge badge-live">${s.viewers.toLocaleString()} viewers</span>` : '<span class="text-muted small">Offline</span>'}
                </div>
            </div>`;
        if(s.enVivo) liveHtml += cardHtml; else offlineHtml += cardHtml;
    });
    $("#live-streamers").html(liveHtml || '<p class="text-muted text-center py-5">Nadie a quien sigues está en vivo.</p>');
    $("#offline-streamers").html(offlineHtml);
}

function cargarFeedWavves() {
    const clip = datosClips[clipActual];
    const autoplay = configuracion.reproduccionAutomatica ? 'autoplay' : '';
    const muted = configuracion.mute ? 'muted' : '';

    let html = `
        <div class="card bg-dark border-0 position-relative overflow-hidden" style="border-radius: var(--border-radius-lg);">
            <div class="clip-thumbnail clip-thumbnail-vertical">
                 <video id="wavve-video" ${autoplay} ${muted} loop playsinline class="w-100 h-100" style="object-fit: cover;" src="${clip.videoUrl}"></video>
                 <div class="video-overlay" style="opacity: 1; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%);"></div>
            </div>
            <div class="position-absolute bottom-0 start-0 end-0 p-4 text-white">
                <div class="d-flex align-items-center mb-2 gap-2">
                     <img src="https://placehold.co/40x40/00f7ff/0A0A0A?text=${clip.creador.charAt(0)}" class="avatar" alt="${clip.creador}">
                     <span class="fw-bold me-2">${clip.creador}</span>
                     ${clip.enVivo ? `<button class="badge badge-live small border-0" onclick="manejarClickStreamer('${clip.creador}')">IR AL VIVO</button>` : ''}
                </div>
                <p class="small mb-2">${clip.titulo}</p>
            </div>
            
            <div class="wavve-interaction-buttons-right">
                <button id="volume-toggle-btn" class="wavve-interaction-btn" onclick="toggleMute(event)">
                    <i class="fas ${configuracion.mute ? 'fa-volume-mute' : 'fa-volume-high'}"></i>
                </button>
                <button class="wavve-interaction-btn ${clipsConLike.includes(clip.id) ? 'liked' : ''}" onclick="alternarLikeWavve(event, ${clip.id})"><i class="fas fa-heart"></i></button>
                <button class="wavve-interaction-btn ${clipsGuardados.includes(clip.id) ? 'saved' : ''}" onclick="alternarGuardarWavve(event, ${clip.id})"><i class="fas fa-bookmark"></i></button>
            </div>
        </div>`;
    $("#current-clip-container").html(html);
    
    const videoElement = document.getElementById('wavve-video');
    if (videoElement) {
        if (configuracion.reproduccionAutomatica) {
            videoElement.play().catch(e => console.log("La reproducción automática fue bloqueada."));
        }
    }
}

function toggleMute(event) {
    event.stopPropagation();
    configuracion.mute = !configuracion.mute;
    const video = document.getElementById('wavve-video');
    if (video) {
        video.muted = configuracion.mute;
    }
    actualizarIconoVolumen();
    guardarConfiguracion();
}

function actualizarIconoVolumen() {
    const icon = $('#volume-toggle-btn i');
    if (configuracion.mute) {
        icon.removeClass('fa-volume-high').addClass('fa-volume-mute');
    } else {
        icon.removeClass('fa-volume-mute').addClass('fa-volume-high');
    }
}

function manejarClickClip(clipId) {
    clipActual = datosClips.findIndex(c => c.id === clipId);
    cambiarVista("wavves");
}
function clipAnterior() { clipActual = (clipActual > 0) ? clipActual - 1 : datosClips.length - 1; cargarFeedWavves(); }
function clipSiguiente() { clipActual = (clipActual < datosClips.length - 1) ? clipActual + 1 : 0; cargarFeedWavves(); }

function alternarLikeWavve(event, clipId) {
    event.stopPropagation();
    const index = clipsConLike.indexOf(clipId);
    if (index > -1) clipsConLike.splice(index, 1); else clipsConLike.push(clipId);
    localStorage.setItem("wavve-likes", JSON.stringify(clipsConLike));
    $(event.currentTarget).toggleClass('liked');
}

function alternarGuardarWavve(event, clipId) {
    event.stopPropagation();
    const index = clipsGuardados.indexOf(clipId);
    if (index > -1) clipsGuardados.splice(index, 1); else clipsGuardados.push(clipId);
    localStorage.setItem("wavve-saved", JSON.stringify(clipsGuardados));
    
    if (vistaActual === 'wavves') {
        $(event.currentTarget).toggleClass('saved');
    }
    if (vistaActual === 'guardados') {
        cargarClipsGuardados();
    }
}

function cargarClipsGuardados() {
    let html = "";
    if (clipsGuardados.length === 0) {
        html = `<div class="text-center py-5 text-muted">
            <i class="fas fa-bookmark fa-3x mb-3"></i>
            <h5>No tienes nada guardado</h5>
            <p>Guarda clips para verlos más tarde.</p>
        </div>`;
    } else {
        clipsGuardados.forEach(clipId => {
            const clip = datosClips.find(c => c.id === clipId);
            if (clip) {
                 html += `
                 <div class="card" onclick="manejarClickClip(${clip.id})">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div style="width: 120px; height: 70px; border-radius: 8px; overflow: hidden; background-color: #000;">
                            <video muted playsinline class="w-100 h-100" style="object-fit: cover;" src="${clip.videoUrl}"></video>
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="text-white mb-1 text-truncate">${clip.titulo}</h6>
                            <p class="text-muted small mb-0">Por ${clip.creador}</p>
                        </div>
                        <button class="btn btn-outline-danger btn-sm" onclick="event.stopPropagation(); alternarGuardarWavve(event, ${clip.id})"><i class="fas fa-trash"></i></button>
                    </div>
                 </div>`;
            }
        });
    }
    $("#saved-clips").html(html);
}

function manejarClickStreamer(nombreStreamer) {
    const streamer = datosStreamers.find(s => s.nombre === nombreStreamer);
    if (streamer) {
        if (streamer.enVivo) {
            abrirModalVideo(streamer);
        } else {
            offlineStreamerModal.show();
        }
    }
}

// --- Lógica del Modal de Stream (ACTUALIZADA) ---

function abrirModalVideo(streamer) {
    streamerSeleccionado = streamer;
    
    // Poblar información del stream
    $("#modal-viewer-count").text(streamer.viewers.toLocaleString());
    $("#modal-avatar").attr("src", `https://placehold.co/50x50/00f7ff/0A0A0A?text=${streamer.nombre.charAt(0)}`);
    $("#modal-streamer-name").text(streamer.nombre);
    $("#modal-stream-title").text(streamer.streamTitle);

    let tagsHtml = streamer.tags.map(tag => `<span class="badge me-1">${tag}</span>`).join('');
    $("#stream-tags").html(tagsHtml);
    
    // Configurar video
    const videoContainer = document.getElementById('modal-video-container');
    if (streamer.liveVideoUrl) {
        videoContainer.innerHTML = `<video id="modal-video-player" class="w-100 h-100" style="object-fit: contain;" autoplay loop controls src="${streamer.liveVideoUrl}"></video>`;
        const videoPlayer = document.getElementById('modal-video-player');
        videoPlayer.muted = false;
    } else {
        videoContainer.innerHTML = '<p class="text-muted">Simulación de Stream de Video</p>';
    }
    
    // Cargar el chat específico del streamer
    mensajesChatActual = (datosChats[streamer.id] || []).slice();
    cargarMensajesChat();
    
    // Configurar estado del botón de seguir
    actualizarBotonSeguir();
    
    modalVideo.show();
}

function cargarMensajesChat() {
    let html = "";
    const userColors = {};
    const colors = ['#00F7FF', '#32FF6A', '#FFD700', '#FF69B4', '#9370DB'];
    
    mensajesChatActual.forEach(msg => {
        let badgeHtml = '';
        if (msg.rol === 'mod') {
            badgeHtml = '<span class="user-badge mod"><i class="fas fa-shield-alt"></i> MOD</span>';
        } else if (msg.rol === 'vip') {
            badgeHtml = '<span class="user-badge vip"><i class="fas fa-star"></i> VIP</span>';
        }
        
        if (!userColors[msg.usuario]) {
            userColors[msg.usuario] = colors[Object.keys(userColors).length % colors.length];
        }
        const color = userColors[msg.usuario];

        html += `
            <div class="chat-message">
                <span class="username" style="color: ${color};">${badgeHtml}${msg.usuario}:</span>
                <span class="message-text"> ${msg.texto}</span>
            </div>`;
    });
    const chatBox = $("#chatMessages");
    chatBox.html(html);
    chatBox.scrollTop(chatBox[0].scrollHeight);
}

function enviarMensajeChat() {
    const texto = $("#chatInput").val().trim();
    if (texto) {
        mensajesChatActual.push({ usuario: "Tú", texto: texto, rol: "user" });
        $("#chatInput").val("");
        cargarMensajesChat();
    }
}

function alternarSeguir() {
    if (!streamerSeleccionado) return;
    const streamerId = streamerSeleccionado.id;
    const index = canalesSeguidos.indexOf(streamerId);
    if (index > -1) {
        canalesSeguidos.splice(index, 1);
    } else {
        canalesSeguidos.push(streamerId);
    }
    localStorage.setItem("wavve-followed", JSON.stringify(canalesSeguidos));
    actualizarBotonSeguir();
}

function actualizarBotonSeguir() {
    if (!streamerSeleccionado) return;
    const siguiendo = canalesSeguidos.includes(streamerSeleccionado.id);
    const btn = $("#followBtn");
    
    if (siguiendo) {
        btn.addClass("following");
        btn.find("#followText").text("Siguiendo");
        btn.find("i").removeClass("fa-heart").addClass("fa-check");
    } else {
        btn.removeClass("following");
        btn.find("#followText").text("Seguir");
        btn.find("i").removeClass("fa-check").addClass("fa-heart");
    }
}

function manejarHoverSeguir(isHovering) {
    if (!streamerSeleccionado) return;
    const siguiendo = canalesSeguidos.includes(streamerSeleccionado.id);
    const btn = $("#followBtn");
    if (siguiendo) {
        if (isHovering) {
            btn.addClass("btn-danger");
            btn.find("#followText").text("Dejar de seguir");
            btn.find("i").removeClass("fa-check").addClass("fa-heart-crack");
        } else {
            btn.removeClass("btn-danger");
            btn.find("#followText").text("Siguiendo");
            btn.find("i").removeClass("fa-heart-crack").addClass("fa-check");
        }
    }
}

function cargarConfiguracion() {
    const savedLikes = localStorage.getItem("wavve-likes");
    const savedClips = localStorage.getItem("wavve-saved");
    const savedFollowed = localStorage.getItem("wavve-followed");
    const savedConfig = localStorage.getItem("wavve-config");
    if(savedLikes) clipsConLike = JSON.parse(savedLikes);
    if(savedClips) clipsGuardados = JSON.parse(savedClips);
    if(savedFollowed) canalesSeguidos = JSON.parse(savedFollowed);
    if(savedConfig) {
        configuracion = {...configuracion, ...JSON.parse(savedConfig)};
        $("#videoQuality").val(configuracion.calidadVideo);
        $("#pushNotifications").prop("checked", configuracion.notificacionesPush);
        $("#soundNotifications").prop("checked", configuracion.notificacionesSonido);
        $("#autoplay").prop("checked", configuracion.reproduccionAutomatica);
    }
}

function guardarConfiguracion() {
    const currentConfig = {
        calidadVideo: $("#videoQuality").val(),
        notificacionesPush: $("#pushNotifications").is(":checked"),
        notificacionesSonido: $("#soundNotifications").is(":checked"),
        reproduccionAutomatica: $("#autoplay").is(":checked"),
        volumen: configuracion.volumen,
        mute: configuracion.mute
    };
    localStorage.setItem("wavve-config", JSON.stringify(currentConfig));
}
