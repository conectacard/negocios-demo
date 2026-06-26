// --- CONFIGURACIÓN DE PAGO DE LA PYME ---
const USA_STRIPE = true;
const STRIPE_PUBLIC_KEY = ""; 
const DATOS_BANCARIOS = {
    banco: "",
    clabe: "",
    titular: "Nombre del Titular"
};
// ----------------------------------------

const CONFIG = {
    whatsapp: "4491472336",
    whatsappAdicional: "4491472336",
    sitioWeb: "https://altpro22.github.io/Jean-Luis-David/",
    facebook: "https://www.facebook.com/profile.php?id=61575004556983&sk=directory_contact_info",
    instagram: "https://www.instagram.com/jldavid_mx/",
    maps: "https://maps.app.goo.gl/HN7bNvnZ56yEZTP76", 
    youtubeUrl: "https://www.youtube.com/shorts/IouyAdZmD18",
    textos: {
        cat1: { t: "CONÓCENOS / ABOUT US", c: "Nacemos de la pasión por la perfección estética. En nuestro santuario, cada trazo y cada corte se ejecuta con la maestría de un artist, garantizando que tu imagen refleje la elegancia y el poder que llevas dentro. Somos más que un salón, somos tu aliado en la creación de una marca personal inolvidable.\n\nWe are born from a passion for aesthetic perfection. In our sanctuary, every stroke and cut is executed with master artistry, ensuring your image reflects elegance." },
        cat2: { t: "SERVICIOS EXCLUSIVOS / SERVICES", c: "Desde colorimetría avanzada que respeta la salud de tu fibra capilar, hasta diseños de corte vanguardistas. Nuestro equipo domina las tendencias globales de Balayage, tratamientos de reconstrucción profunda y estilismo para eventos de alto nivel. Aquí, la calidad no es un servicio, es nuestro estándar innegociable.\n\nFrom advanced hair coloring to cutting-edge designs. Deep reconstruction treatments and elite styling." },
        cat3: { t: "TESTIMONIOS EN VIDEO E IMAGEN", c: "La exclusividad merece recognition. Disfruta de nuestras promociones diseñadas para la mujer Mona Lisa: \n\n• LUNES DE COLOR / COLOR MONDAY: 20% de descuento en servicios químicos.\n• MARTES DE HIDRATACIÓN / MOISTURE TUESDAY: Tratamiento VIP en cada corte.\n• JUEVES DE AMIGAS / THURSDAY FRIENDS: Promociones grupales exclusivas." }
    }
};
let currentGallery = [];
let currentIndex = 0;
let isMuted = false;
let currentGatewayState = { citas: false, ventas: false, cotizar: false };
let globalCompiledTicketText = "";

function openYouTubeVideo() { 
    playClick(); 
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    let videoId = "7NWN73CYBlY"; 
    if(CONFIG.youtubeUrl.includes("shorts/")) { videoId = CONFIG.youtubeUrl.split("shorts/")[1].split("?")[0]; } 
    else if(CONFIG.youtubeUrl.includes("v=")) { videoId = CONFIG.youtubeUrl.split("v=")[1].split("&")[0]; }
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    overlay.style.display = 'flex';
}

function closeVideoLightbox() {
    playClick();
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    iframe.src = ""; 
    overlay.style.display = 'none';
}

function openProfileZoom() {
    playClick();
    const imgElement = document.getElementById('profile-pic-img');
    if(imgElement) { const src = imgElement.src; openLightbox(src, [src], true); }
}

function showAppContent(cat) {
    playClick();
    document.getElementById('dynamic-content-layer').style.display = 'flex';
    document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
    const pane = document.getElementById(`${cat}-pane`);
    if(pane) pane.style.display = 'flex';
    if(cat !== 'cat4') renderGallery(cat);
}

function renderGallery(cat) {
    const grid = document.getElementById(`grid-${cat}`);
    if(!grid) return; 
    grid.innerHTML = '';
    
    const titleHeader = document.createElement('h2');
    titleHeader.className = 'gallery-title-white';
    titleHeader.innerText = CONFIG.textos[cat].t;
    grid.appendChild(titleHeader);
    
    const imgCount = (cat === 'cat3') ? 3 : (cat === 'cat1' || cat === 'cat2') ? 6 : 4;
    const imgs = [];
    for(let i = 1; i <= imgCount; i++) { imgs.push(`assets/gallery/${cat}/${i}.jpg`); }
    
    const rowGrid = document.createElement('div');
    rowGrid.className = 'quad-row-grid';
    imgs.forEach((src, index) => {
        const posClass = (index % 2 === 0) ? 'pos-left' : 'pos-right';
        rowGrid.appendChild(createPol(src, posClass, imgs));
    });
    grid.appendChild(rowGrid);
    
    // 1. PRIMERO: Insertamos los botones de video (SOLO si es cat3)
    if (cat === 'cat3') {
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = "display: flex; gap: 10px; margin-top: 15px; justify-content: center; width: 100%;";
        videoContainer.innerHTML = `
            <a href="https://www.youtube.com/shorts/pLPcbWtiy-Y" target="_blank" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.7rem; border: 1px solid #d4af37;">VIDEO 1</a>
            <a href="https://www.youtube.com/shorts/0WF5h9Dew5U" target="_blank" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.7rem; border: 1px solid #d4af37;">VIDEO 2</a>
        `;
        grid.appendChild(videoContainer);
    }
    
    // 2. DESPUÉS: Insertamos el botón de detalles al final
    const btn = document.createElement('button');
    btn.className = 'btn-details-gold'; 
    btn.innerHTML = `<i class="fas fa-plus-circle"></i> VER DETALLES / DETAILS`;
    btn.onclick = (e) => { e.stopPropagation(); openTextZoom(cat); };
    grid.appendChild(btn);
}


function createPol(src, pos, arr) {
    const div = document.createElement('div');
    div.className = `polaroid-item ${pos}`;
    div.innerHTML = `<img src="${src}">`;
    div.onclick = (e) => { e.stopPropagation(); openLightbox(src, arr, false); };
    return div;
}

function openLightbox(src, arr, hideControls) {
    playClick();
    currentGallery = arr;
    currentIndex = arr.indexOf(src);
    const lightboxEl = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    if(hideControls) { lightboxEl.classList.add('hide-nav-arrows'); } else { lightboxEl.classList.remove('hide-nav-arrows'); }
    imgEl.src = src;
    lightboxEl.style.display = 'flex';
}

function changeLightboxImage(dir) {
    if(currentGallery.length <= 1) return;
    playClick();
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    document.getElementById('lightbox-image').src = currentGallery[currentIndex];
}

function openTextZoom(cat) {
    playClick();
    document.getElementById('text-zoom-title').innerText = CONFIG.textos[cat].t;
    document.getElementById('text-zoom-content').innerText = CONFIG.textos[cat].c;
    document.getElementById('text-zoom-modal').style.display = 'flex';
}

function closeLightbox() { document.getElementById('lightbox').style.display = 'none'; }
function closeAppContent() { document.getElementById('dynamic-content-layer').style.display = 'none'; }
function closeTextZoom() { document.getElementById('text-zoom-modal').style.display = 'none'; }
function openBrandModal(modalId) { playClick(); const modal = document.getElementById(modalId); if (modal) modal.style.display = 'flex'; }
function closeBrandModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; }
function playClickSound() { playClick(); }
function openWAChat() { 
    playClick(); 
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=Hola, deseo agendar una cita.`, '_blank'); 
}

// AQUÍ EMPIEZA TU BLOQUE DE VALIDACIÓN DE DISPONIBILIDAD (CITAS Y PEDIDOS)
function validarCitaWhatsApp() {
    playClick();
    let name = document.getElementById('cita-nombre').value;
    let service = document.getElementById('cita-servicio').value;
    let date = document.getElementById('cita-fecha').value;
    let time = document.getElementById('cita-horario').value;

    if (!date || !time) {
        alert("Por favor, selecciona fecha y horario.");
        return;
    }

    let mensaje = `Hola, soy ${name}. Deseo validar disponibilidad para: ${service} el día ${date} a las ${time}. ¿Tienen disponibilidad?`;
    let url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

function validarVentaWhatsApp() {
    playClick();
    let name = document.getElementById('venta-nombre').value;
    
    // Validamos que exista un nombre para que el mensaje sea profesional
    if (!name) {
        alert("Por favor, ingresa tu nombre para validar disponibilidad.");
        return;
    }

    let mensaje = `Hola, soy ${name}. Deseo validar la disponibilidad de los productos seleccionados en mi pedido. ¿Tienen existencia? Gracias.`;
    let url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
}
// AQUÍ TERMINA EL BLOQUE DE VALIDACIÓN DE DISPONIBILIDAD
function toggleAudioGlobal() {
    isMuted = !isMuted;
    const spot = document.getElementById('spot-intro');
    const icon = document.getElementById('audio-icon');
    spot.muted = isMuted;
    icon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

function playClick() { const snd = document.getElementById('sndFxClick'); if(snd && !isMuted) { snd.currentTime = 0; snd.play().catch(()=>{}); } }
function playAcierto() { const snd = document.getElementById('sndFxAcierto'); if(snd && !isMuted) { snd.currentTime = 0; snd.play().catch(()=>{}); } }
function playError() { const snd = document.getElementById('sndFxError'); if(snd && !isMuted) { snd.currentTime = 0; snd.play().catch(()=>{}); } }
function playEmpate() { const snd = document.getElementById('sndFxEmpate'); if(snd && !isMuted) { snd.currentTime = 0; snd.play().catch(()=>{}); } }
function openNetworkCard(url) { playClick(); window.open(url, '_blank'); }
function openTransactionModal() { playClick(); document.getElementById('modal-transaccional').style.display = 'flex'; calculateShopTotal(); }
function closeTransactionModal() { document.getElementById('modal-transaccional').style.display = 'none'; }
function switchBusinessForm(type) {
    playClick();
    document.querySelectorAll('.tab-selector-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.business-dynamic-form').forEach(f => f.style.display = 'none');
    document.getElementById(`tab-${type}`).classList.add('active');
    document.getElementById(`form-case-${type}`).style.display = 'flex';
}

function calculateShopTotal() {
    let subtotal = 0;
    const checkedBoxes = document.querySelectorAll('.prod-item-check:checked');
    checkedBoxes.forEach(box => {
        const price = parseFloat(box.getAttribute('data-price'));
        const row = box.closest('.catalog-item-row');
        const qtyInput = row.querySelector('.prod-item-qty');
        const qty = parseInt(qtyInput.value) || 1;
        subtotal += (price * qty);
    });
    const fleteSelect = document.getElementById('venta-flete');
    let fleteCost = 0;
    if(fleteSelect && fleteSelect.value) { fleteCost = parseFloat(fleteSelect.value.split('|')[1]) || 0; }
    let total = subtotal + fleteCost;
    document.getElementById('math-subtotal').innerText = subtotal;
    document.getElementById('math-envio').innerText = fleteCost;
    document.getElementById('math-total').innerText = total;
}

function triggerGatewayDeposit(formType, fixedAmount) {
    playClick();
    
    let totalToCharge = fixedAmount;

    // Si no es un monto fijo, calculamos el total del carrito
    if (!fixedAmount && formType === 'ventas') {
        calculateShopTotal();
        totalToCharge = parseFloat(document.getElementById('math-total').innerText) || 0;
        if (totalToCharge === 0) {
            playError();
            alert("Seleccione al menos un producto para abonar.");
            return;
        }
    }

    // Lógica directa a WhatsApp
    const mensaje = `Hola, quiero realizar mi pago de $${totalToCharge} MXN. Datos: Banco: ${DATOS_BANCARIOS.banco}, CLABE: ${DATOS_BANCARIOS.clabe}, Titular: ${DATOS_BANCARIOS.titular}.`;
    
    // Abrimos WhatsApp con el mensaje prellenado
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

function processTransactionForm(event, formType) {
    event.preventDefault();
    if(!currentGatewayState[formType]) { playError(); alert("Por favor, procese el depósito o pago obligatorio en el botón correspondiente antes de continuar. / Payment required."); return; }
    let ticketHtml = "";
    let systemFolio = "FOL-JLD-" + Math.floor(100000 + Math.random() * 900000);
    let currentDateStr = new Date().toLocaleString();
    if(formType === 'citas') {
        let name = document.getElementById('cita-nombre').value;
        let whatsapp = document.getElementById('cita-whatsapp').value;
        let service = document.getElementById('cita-servicio').value;
        let date = document.getElementById('cita-fecha').value;
        let time = document.getElementById('cita-horario').value;
        ticketHtml = `FOLIO: ${systemFolio}\nFECHA: ${currentDateStr}\nGIRO: RESERVACIONES / CITAS\n-------------------------\nCLIENTE: ${name}\nTEL: ${whatsapp}\nSERVICIO: ${service}\nFECHA CITA: ${date}\nHORA CITA: ${time}\n-------------------------\nESTADO: ANTICIPO $200 MXN VERIFICADO`;
        playAcierto();
    } else if(formType === 'ventas') {
        let name = document.getElementById('venta-nombre').value;
        let phone = document.getElementById('venta-telefono').value;
        let address = document.getElementById('venta-direccion').value;
        let deliveryZone = document.getElementById('venta-flete').value.split('|')[0];
        let subtotal = document.getElementById('math-subtotal').innerText;
        let flete = document.getElementById('math-envio').innerText;
        let total = document.getElementById('math-total').innerText;
        let itemsStr = "";
        document.querySelectorAll('.prod-item-check:checked').forEach(box => {
            const row = box.closest('.catalog-item-row');
            const qty = row.querySelector('.prod-item-qty').value;
            itemsStr += `• ${box.value} (Cant: ${qty})\n`;
        });
        ticketHtml = `FOLIO: ${systemFolio}\nFECHA: ${currentDateStr}\nGIRO: PEDIDOS / VENTAS\n-------------------------\nCLIENTE: ${name}\nTEL: ${phone}\nDIR: ${address}\nZONA: ${deliveryZone}\n-------------------------\nPRODUCTOS:\n${itemsStr}-------------------------\nSUBTOTAL: $${subtotal} MXN\nENVÍO: $${flete} MXN\nTOTAL NETO: $${total} MXN\n-------------------------\nESTADO: LIQUIDADO EN LÍNEA`;
        playAcierto();
    } else if(formType === 'cotizar') {
        let name = document.getElementById('cotizar-nombre').value;
        let whatsapp = document.getElementById('cotizar-whatsapp').value;
        let category = document.getElementById('cotizar-categoria').value;
        let details = document.getElementById('cotizar-detalles').value;
        ticketHtml = `FOLIO: ${systemFolio}\nFECHA: ${currentDateStr}\nGIRO: COTIZACIÓN COMPLEJA\n-------------------------\nSOLICITANTE: ${name}\nTEL: ${whatsapp}\nRAMO: ${category}\nDETALLES: ${details}\n-------------------------\nEVIDENCIA VISUAL CARGADA\nDIAGNÓSTICO BASE: $150 MXN PAGADO\n-------------------------\nPROCESO: EVALUACIÓN MANUAL <24 HRS`;
        playEmpate();
    }
    globalCompiledTicketText = ticketHtml;
    document.getElementById('ticket-dynamic-content').innerText = ticketHtml;
    closeTransactionModal();
    document.getElementById('modal-ticket-recibo').style.display = 'flex';
}

function dispatchTicketToWhatsApp() {
    playClick();
    let encodedText = encodeURIComponent(`*BOCA EN BOCA CARD - COMPROBANTE DIGITAL*\n\n${globalCompiledTicketText}`);
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodedText}`, '_blank');
    document.getElementById('modal-ticket-recibo').style.display = 'none';
}

function executeViralShare() {
    playClick();
    let currentShares = parseInt(localStorage.getItem('conecta_viral_shares')) || 0;
    let shareText = encodeURIComponent("¡Descubre la CARD oficial de Jean Louis David México! Agenda, compra y cotiza servicios exclusivos aquí: ");
    let shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${shareText}${shareUrl}`, '_blank');
    currentShares++;
    localStorage.setItem('conecta_viral_shares', currentShares);
    updateViralUI();
}

function updateViralUI() {
    let currentShares = parseInt(localStorage.getItem('conecta_viral_shares')) || 0;
    const label = document.getElementById('viral-counter-label');
    const overlay = document.getElementById('viral-lock-overlay');
    if(currentShares >= 5) {
        if(label) label.innerText = "¡DESBLOQUEADO! / UNLOCKED: 10% DESC VIP";
        if(overlay) { overlay.className = "viral-locked viral-unlocked"; overlay.innerHTML = `<i class="fas fa-gift"></i> <span>¡CUPÓN DESBLOQUEADO: CONECTA AMIGOS!</span>`; }
    } else { if(label) label.innerText = `COMPARTIDOS / SHARED: ${currentShares} / 5`; }
    const lockLabel10 = document.getElementById('status-lock-10');
    const lockLabel20 = document.getElementById('status-lock-20');
    if(currentShares >= 10) { if(lockLabel10) { lockLabel10.className = "tier-status-lock tier-status-unlocked"; lockLabel10.innerHTML = `<i class="fas fa-lock-open"></i> DESBLOQUEADO`; } } else { if(lockLabel10) lockLabel10.innerHTML = `<i class="fas fa-lock"></i> FALTA ${10 - currentShares} AMIGOS`; }
    if(currentShares >= 20) { if(lockLabel20) { lockLabel20.className = "tier-status-lock tier-status-unlocked"; lockLabel20.innerHTML = `<i class="fas fa-lock-open"></i> DESBLOQUEADO`; } } else { if(lockLabel20) lockLabel20.innerHTML = `<i class="fas fa-lock"></i> FALTA ${20 - currentShares} AMIGOS`; }
}

document.addEventListener('DOMContentLoaded', () => {
    const fbLink = document.getElementById('link-fb-direct');
    const mapsLink = document.getElementById('link-maps-direct');
    const igLink = document.getElementById('link-ig-direct');
    const webLink = document.getElementById('link-web-direct');
    const waAddLink = document.getElementById('link-wa-additional');
    if(fbLink) fbLink.href = CONFIG.facebook;
    if(mapsLink) mapsLink.href = CONFIG.maps;
    if(igLink) igLink.href = CONFIG.instagram;
    if(webLink) webLink.href = CONFIG.sitioWeb;
    if(waAddLink) waAddLink.href = `https://wa.me/${CONFIG.whatsappAdicional}?text=Hola, solicito información sobre soporte de CONECTA de Alt Pro.`;
    updateViralUI();
    window.addEventListener('click', () => {
        const spot = document.getElementById('spot-intro');
        if(spot && !isMuted) spot.play().catch(()=>{});
    }, {once: true});
});

async function shareExperienceRobust() {
    try { await navigator.share({ title: 'Jean Louis David México', url: window.location.href }); playAcierto(); }
    catch { playClick(); navigator.clipboard.writeText(window.location.href).then(() => { playAcierto(); alert("¡Enlace de la CARD copiado! Compártelo con tus amigos. / Link copied!"); }); }
}
async function enviarCotizacionWhatsApp(event) {
    event.preventDefault(); 
    
    const nombre = document.getElementById('cotizar-nombre').value;
    const whats = document.getElementById('cotizar-whatsapp').value;
    const cat = document.getElementById('cotizar-categoria').value;
    const detalles = document.getElementById('cotizar-detalles').value;
    
    const mensaje = `*SOLICITUD DE COTIZACIÓN - CONECTA*\n\n*Cliente:* ${nombre}\n*WhatsApp:* ${whats}\n*Servicio:* ${cat}\n*Detalles:* ${detalles}\n\n*Nota:* El cliente ha adjuntado evidencia visual.`;
    
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank');
    
    playAcierto();
    alert("¡Solicitud enviada! En breve nos pondremos en contacto.");
}